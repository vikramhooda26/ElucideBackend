import { Prisma } from "@prisma/client";
import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BrandResponseDTO } from "../dto/brand.dto.js";
import { METADATA_KEYS, STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { areElementsDistinct } from "../lib/helpers.js";
import { metadataStore } from "../managers/MetadataManager.js";
import { TCreateBrandSchema, TEditBrandSchema, TFilteredBrandSchema } from "../schemas/brand.schema.js";
import { brandSelect, TBrandDetails } from "../types/brand.type.js";
import { exactSetMatch, getEndorsementQuery, getGenderQuery } from "./constants/index.js";
import { getBrandsCount } from "./dashboard/helpers.js";

export const getBrands = async ({
  query,
  take,
  skip,
  select,
  orderBy = "modified_date",
  orderDirection = "desc",
}: {
  query?: Prisma.dashapp_companydataWhereInput;
  take?: any;
  skip?: any;
  select: Prisma.dashapp_companydataSelect;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}) => {
  let orderByObject: any = {};

  if (orderBy === "created_by" || orderBy === "modified_by") {
    orderByObject = {
      [orderBy]: {
        email: orderDirection,
      },
    };
  } else {
    orderByObject = {
      [orderBy]: orderDirection,
    };
  }
  return await prisma.dashapp_companydata.findMany({
    where: query,
    select: select,
    orderBy: orderByObject,
    take: Number.isNaN(Number(take)) ? undefined : Number(take),
    skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
  });
};

export const getAllBrands = asyncHandler(async (req, res) => {
  const { take, skip, orderBy, orderDirection, search } = req.query;

  const selectBrand = {
    id: true,
    company_name: true,
    created_by: {
      select: {
        id: true,
        email: true,
      },
    },
    dashapp_companydata_gender: true,
    created_date: true,
    modified_by: {
      select: {
        id: true,
        email: true,
      },
    },
    modified_date: true,
  };

  const fieldMapping: Record<string, string> = {
    name: "company_name",
    createdDate: "created_date",
    modifiedDate: "modified_date",
    createdBy: "created_by",
    modifiedBy: "modified_by",
  };

  const dbOrderByField = orderBy ? fieldMapping[orderBy as string] || "modified_date" : "modified_date";
  const dbOrderDirection = (orderDirection as "asc" | "desc") || "desc";

  const query: Prisma.dashapp_companydataWhereInput = {};

  if (search && typeof search === "string" && search.trim() !== "") {
    query.company_name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  const [brands, totalCount] = await Promise.all([
    getBrands({ query, take, skip, select: selectBrand, orderBy: dbOrderByField, orderDirection: dbOrderDirection }),
    getBrandsCount(search ? query : undefined),
  ]);

  res.status(STATUS_CODE.OK).json({
    items: brands.map((brand) => ({
      id: brand.id,
      name: brand.company_name,
      createdDate: brand.created_date,
      modifiedDate: brand.modified_date,
      createdBy: {
        userId: brand.created_by?.id,
        email: brand.created_by?.email,
      },
      modifiedBy: {
        userId: brand.modified_by?.id,
        email: brand.modified_by?.email,
      },
    })),
    totalCount,
  });
});

export const getBrandById = asyncHandler(async (req, res) => {
  const brandId = req.params.id;

  if (!brandId) {
    throw new BadRequestError("Brand ID not found");
  }

  const brand = await prisma.dashapp_companydata.findUnique({
    where: { id: BigInt(brandId) },
    select: {
      ...brandSelect,
      dashapp_companydata_subcategory: {
        select: {
          dashapp_subcategory: {
            select: {
              id: true,
              subcategory: true,
              dashapp_category: {
                select: {
                  id: true,
                  category: true,
                },
              },
            },
          },
        },
      },
      dashapp_companydata_personality_traits: {
        select: {
          dashapp_subpersonality: {
            select: {
              id: true,
              name: true,
              dashapp_mainpersonality: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!brand?.id) {
    throw new NotFoundError("This brand does not exists");
  }

  const mainCategories: {
    id: bigint;
    name: string;
    subCategories: {
      id: bigint;
      name: string;
    }[];
  }[] = [];
  const categoryMap = new Map();

  brand.dashapp_companydata_subcategory.forEach(({ dashapp_subcategory }) => {
    if (!dashapp_subcategory) return;
    const category = dashapp_subcategory.dashapp_category;
    if (!categoryMap.has(category.id.toString())) {
      categoryMap.set(category.id.toString(), {
        id: category.id,
        category: category.category,
        dashapp_subcategory: [],
      });
      mainCategories.push(categoryMap.get(category.id.toString()));
    }

    categoryMap.get(category.id.toString()).dashapp_subcategory.push({
      id: dashapp_subcategory.id,
      subcategory: dashapp_subcategory.subcategory,
    });
  });

  const mainPersonalityMap = new Map();
  const mainPersonalities: {
    id: bigint;
    name: string;
    dashapp_subpersonality: {
      id: bigint;
      name: string;
    }[];
  }[] = [];

  brand.dashapp_companydata_personality_traits.forEach(({ dashapp_subpersonality }) => {
    const mainPersonality = dashapp_subpersonality.dashapp_mainpersonality;
    if (!mainPersonalityMap.has(mainPersonality.id.toString())) {
      mainPersonalityMap.set(mainPersonality.id.toString(), {
        id: mainPersonality.id,
        name: mainPersonality.name,
        dashapp_subpersonality: [],
      });
      mainPersonalities.push(mainPersonalityMap.get(mainPersonality.id.toString()));
    }

    mainPersonalityMap.get(mainPersonality.id.toString()).dashapp_subpersonality.push({
      id: dashapp_subpersonality.id,
      name: dashapp_subpersonality.name,
    });
  });

  const { dashapp_companydata_subcategory, dashapp_companydata_personality_traits, ...brandData } = brand;

  const updatedBrand = {
    ...brandData,
    mainPersonalities,
    mainCategories,
  };

  const brandResponse: BrandResponseDTO = BrandResponseDTO.toResponse(updatedBrand);

  res.status(STATUS_CODE.OK).json(brandResponse);
});

export const getTotalBrands = asyncHandler(async (_req, res) => {
  const count = getBrandsCount();

  res.status(STATUS_CODE.OK).json({ count });
});

export const createBrand = asyncHandler(async (req, res) => {
  const {
    name,
    parentOrgId,
    subCategoryIds,
    cityId,
    stateId,
    agencyId,
    tierIds,
    facebook,
    instagram,
    linkedin,
    twitter,
    website,
    youtube,
    subPersonalityTraitIds,
    strategyOverview,
    taglineIds,
    activeCampaignIds,
    primaryMarketingPlatformIds,
    secondaryMarketingPlatformIds,
    ageIds,
    genderIds,
    nccsIds,
    primaryMarketIds,
    secondaryMarketIds,
    tertiaryIds,
    userId,
    contactPerson,
    endorsements,
  } = req.validatedData as TCreateBrandSchema;

  if (endorsements?.length) {
    const isEndorsementsExists = await prisma.dashapp_brandendorsements.findFirst({
      where: {
        name: { in: endorsements?.map((endorse) => endorse.name) },
      },
      select: {
        name: true,
      },
    });

    if (isEndorsementsExists?.name) {
      res.status(STATUS_CODE.CONFLICT).json({
        key: isEndorsementsExists.name,
        message: "This endorsement already exists",
      });
      return;
    }
  }

  const brand = await prisma.dashapp_companydata.create({
    data: {
      company_name: name,
      created_by: { connect: { id: BigInt(userId) } },
      modified_by: { connect: { id: BigInt(userId) } },
      dashapp_parentorg: parentOrgId
        ? {
            connect: {
              id: BigInt(parentOrgId),
            },
          }
        : undefined,
      dashapp_companydata_subcategory: subCategoryIds
        ? {
            create: subCategoryIds?.map((subCategoryId) => ({
              dashapp_subcategory: {
                connect: { id: BigInt(subCategoryId) },
              },
            })),
          }
        : undefined,
      dashapp_hqcity: cityId
        ? {
            connect: {
              id: BigInt(cityId),
            },
          }
        : undefined,
      dashapp_states: stateId
        ? {
            connect: {
              id: BigInt(stateId),
            },
          }
        : undefined,
      dashapp_agency: agencyId
        ? {
            connect: {
              id: BigInt(agencyId),
            },
          }
        : undefined,
      dashapp_brandendorsements: endorsements?.length
        ? {
            create: endorsements.map((endorse) => ({
              name: endorse.name,
              active: endorse.active,
            })),
          }
        : undefined,
      dashapp_companydata_tier: tierIds?.length
        ? {
            create: tierIds?.map((tierId) => ({
              dashapp_tier: {
                connect: { id: BigInt(tierId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_personality_traits: subPersonalityTraitIds?.length
        ? {
            create: subPersonalityTraitIds?.map((traitId) => ({
              dashapp_subpersonality: {
                connect: { id: BigInt(traitId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_taglines: taglineIds?.length
        ? {
            create: taglineIds?.map((taglineId) => ({
              dashapp_taglines: {
                connect: { id: BigInt(taglineId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_active_campaigns: activeCampaignIds?.length
        ? {
            create: activeCampaignIds?.map((activeCampaignId) => ({
              dashapp_activecampaigns: {
                connect: {
                  id: BigInt(activeCampaignId),
                },
              },
            })),
          }
        : undefined,
      dashapp_companydata_marketing_platforms_primary: primaryMarketingPlatformIds?.length
        ? {
            create: primaryMarketingPlatformIds?.map((primaryMarketingPlatformId) => ({
              dashapp_marketingplatform: {
                connect: {
                  id: BigInt(primaryMarketingPlatformId),
                },
              },
            })),
          }
        : undefined,
      dashapp_companydata_marketing_platforms_secondary: secondaryMarketingPlatformIds?.length
        ? {
            create: secondaryMarketingPlatformIds?.map((secondaryMarketingPlatformId) => ({
              dashapp_marketingplatform: {
                connect: {
                  id: BigInt(secondaryMarketingPlatformId),
                },
              },
            })),
          }
        : undefined,
      dashapp_companydata_age: ageIds?.length
        ? {
            create: ageIds?.map((ageId) => ({
              dashapp_age: {
                connect: { id: BigInt(ageId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_gender: genderIds?.length
        ? {
            create: genderIds?.map((genderId) => ({
              dashapp_gender: {
                connect: { id: BigInt(genderId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_income: nccsIds?.length
        ? {
            create: nccsIds?.map((nccsId) => ({
              dashapp_nccs: {
                connect: { id: BigInt(nccsId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_key_markets_primary: primaryMarketIds?.length
        ? {
            create: primaryMarketIds?.map((marketId) => ({
              dashapp_keymarket: {
                connect: { id: BigInt(marketId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_key_markets_secondary: secondaryMarketIds?.length
        ? {
            create: secondaryMarketIds?.map((marketId) => ({
              dashapp_keymarket: {
                connect: { id: BigInt(marketId) },
              },
            })),
          }
        : undefined,
      dashapp_companydata_key_markets_tertiary: tertiaryIds?.length
        ? {
            create: tertiaryIds?.map((tertiaryId) => ({
              dashapp_states: {
                connect: { id: BigInt(tertiaryId) },
              },
            })),
          }
        : undefined,
      strategy_overview: strategyOverview,
      instagram: instagram,
      facebook: facebook,
      linkedin: linkedin,
      twitter: twitter,
      youtube: youtube,
      website: website,
    },
    select: {
      id: true,
    },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.BRAND, true);

  if (contactPerson?.length) {
    await prisma.dashapp_brandcontact.createMany({
      data: contactPerson.map((details) => ({
        contact_name: details.contactName,
        contact_designation: details.contactDesignation,
        contact_email: details.contactEmail,
        contact_no: details.contactNumber,
        contact_linkedin: details.contactLinkedin,
        brand_id: brand.id,
      })),
    });
  }

  res.status(STATUS_CODE.OK).json({
    message: "Brand created",
  });
});

export const editBrand = asyncHandler(async (req, res) => {
  const brandId = req.params.id;

  if (!brandId) {
    throw new BadRequestError("Brand ID not found");
  }

  const brandExists = await prisma.dashapp_companydata.findUnique({
    where: { id: BigInt(brandId) },
    select: { id: true },
  });

  if (!brandExists?.id) {
    throw new NotFoundError("This brand does not exists");
  }

  const {
    name,
    parentOrgId,
    subCategoryIds,
    cityId,
    stateId,
    agencyId,
    tierIds,
    facebook,
    instagram,
    linkedin,
    twitter,
    website,
    youtube,
    subPersonalityTraitIds,
    strategyOverview,
    taglineIds,
    activeCampaignIds,
    primaryMarketingPlatformIds,
    secondaryMarketingPlatformIds,
    ageIds,
    genderIds,
    nccsIds,
    primaryMarketIds,
    secondaryMarketIds,
    tertiaryIds,
    userId,
    contactPerson,
    endorsements,
  } = req.validatedData as TEditBrandSchema;

  if (endorsements?.length) {
    const isDistinct = areElementsDistinct(endorsements?.map((endorse) => endorse.name));

    if (!isDistinct) {
      throw new BadRequestError("Endorsements must be unique");
    }
  }

  await prisma.dashapp_companydata.update({
    where: { id: BigInt(brandId) },
    data: {
      company_name: name,
      modified_by: { connect: { id: BigInt(userId) } },
      dashapp_parentorg: parentOrgId ? { connect: { id: BigInt(parentOrgId) } } : { disconnect: true },
      dashapp_companydata_subcategory: {
        deleteMany: {},
        ...(subCategoryIds?.length
          ? {
              create: subCategoryIds.map((subCategoryId) => ({
                dashapp_subcategory: {
                  connect: { id: BigInt(subCategoryId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_brandendorsements: {
        deleteMany: {},
        ...(endorsements?.length
          ? {
              create: endorsements.map((endorse) => ({
                name: endorse.name,
                active: endorse.active,
              })),
            }
          : undefined),
      },
      dashapp_hqcity: cityId ? { connect: { id: BigInt(cityId) } } : { disconnect: true },
      dashapp_states: stateId ? { connect: { id: BigInt(stateId) } } : { disconnect: true },
      dashapp_agency: agencyId ? { connect: { id: BigInt(agencyId) } } : { disconnect: true },
      dashapp_companydata_tier: {
        deleteMany: {},
        ...(tierIds?.length
          ? {
              create: tierIds.map((tierId) => ({
                dashapp_tier: { connect: { id: BigInt(tierId) } },
              })),
            }
          : undefined),
      },
      dashapp_companydata_personality_traits: {
        deleteMany: {},
        ...(subPersonalityTraitIds?.length
          ? {
              create: subPersonalityTraitIds.map((traitId) => ({
                dashapp_subpersonality: {
                  connect: { id: BigInt(traitId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_taglines: {
        deleteMany: {},
        ...(taglineIds?.length
          ? {
              create: taglineIds.map((taglineId) => ({
                dashapp_taglines: {
                  connect: { id: BigInt(taglineId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_active_campaigns: {
        deleteMany: {},
        ...(activeCampaignIds?.length
          ? {
              create: activeCampaignIds.map((activeCampaignId) => ({
                dashapp_activecampaigns: {
                  connect: { id: BigInt(activeCampaignId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_marketing_platforms_primary: {
        deleteMany: {},
        ...(primaryMarketingPlatformIds?.length
          ? {
              create: primaryMarketingPlatformIds.map((primaryMarketingPlatformId) => ({
                dashapp_marketingplatform: {
                  connect: {
                    id: BigInt(primaryMarketingPlatformId),
                  },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_marketing_platforms_secondary: {
        deleteMany: {},
        ...(secondaryMarketingPlatformIds?.length
          ? {
              create: secondaryMarketingPlatformIds.map((secondaryMarketingPlatformId) => ({
                dashapp_marketingplatform: {
                  connect: {
                    id: BigInt(secondaryMarketingPlatformId),
                  },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_age: {
        deleteMany: {},
        ...(ageIds?.length
          ? {
              create: ageIds.map((ageId) => ({
                dashapp_age: { connect: { id: BigInt(ageId) } },
              })),
            }
          : undefined),
      },
      dashapp_companydata_gender: {
        deleteMany: {},
        ...(genderIds?.length
          ? {
              create: genderIds.map((genderId) => ({
                dashapp_gender: {
                  connect: { id: BigInt(genderId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_income: {
        deleteMany: {},
        ...(nccsIds?.length
          ? {
              create: nccsIds.map((nccsId) => ({
                dashapp_nccs: { connect: { id: BigInt(nccsId) } },
              })),
            }
          : undefined),
      },
      dashapp_companydata_key_markets_primary: {
        deleteMany: {},
        ...(primaryMarketIds?.length
          ? {
              create: primaryMarketIds.map((marketId) => ({
                dashapp_keymarket: {
                  connect: { id: BigInt(marketId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_key_markets_secondary: {
        deleteMany: {},
        ...(secondaryMarketIds?.length
          ? {
              create: secondaryMarketIds.map((marketId) => ({
                dashapp_keymarket: {
                  connect: { id: BigInt(marketId) },
                },
              })),
            }
          : undefined),
      },
      dashapp_companydata_key_markets_tertiary: {
        deleteMany: {},
        ...(tertiaryIds?.length
          ? {
              create: tertiaryIds.map((tertiaryId) => ({
                dashapp_states: {
                  connect: { id: BigInt(tertiaryId) },
                },
              })),
            }
          : undefined),
      },
      strategy_overview: strategyOverview,
      instagram: instagram,
      facebook: facebook,
      linkedin: linkedin,
      twitter: twitter,
      youtube: youtube,
      website: website,
    },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.BRAND, true);

  await prisma.dashapp_brandcontact.deleteMany();

  if (contactPerson?.length) {
    const contactData = contactPerson.map((details) => ({
      contact_name: details.contactName,
      contact_designation: details.contactDesignation,
      contact_email: details.contactEmail,
      contact_no: details.contactNumber,
      contact_linkedin: details.contactLinkedin,
      brand_id: BigInt(brandId),
    }));
    await prisma.dashapp_brandcontact.createMany({
      data: contactData,
    });
  }

  res.status(STATUS_CODE.OK).json({
    message: "Brand details updated",
  });
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brandId = req.params.id;

  if (!brandId) {
    throw new BadRequestError("Brand ID not found");
  }

  const brandExists = await prisma.dashapp_companydata.findUnique({
    where: { id: BigInt(brandId) },
    select: { id: true },
  });

  if (!brandExists?.id) {
    throw new NotFoundError("This brand does not exists");
  }

  await prisma.dashapp_companydata.delete({
    where: { id: BigInt(brandId) },
    select: { id: true },
  });

  metadataStore.setHasUpdated(METADATA_KEYS.BRAND, true);

  res.status(STATUS_CODE.OK).json({
    message: "Brand deleted",
  });
});

export const getFilteredBrand = asyncHandler(async (req, res) => {
  const { take, skip } = req.query;

  const {
    isMandatory,
    activeCampaignIds,
    ageIds,
    agencyIds,
    cityIds,
    contactDesignation,
    contactEmail,
    contactLinkedin,
    contactName,
    contactNumber,
    endorsement,
    facebook,
    genderIds,
    ids,
    instagram,
    linkedin,
    nccsIds,
    parentOrgIds,
    primaryMarketIds,
    primaryMarketingPlatformIds,
    secondaryMarketIds,
    secondaryMarketingPlatformIds,
    stateIds,
    strategyOverview,
    subCategoryIds,
    maincategoryIds,
    mainpersonalityIds,
    subPersonalityTraitIds,
    taglineIds,
    tertiaryIds,
    tierIds,
    twitter,
    website,
    youtube,
  } = req.validatedData as TFilteredBrandSchema;

  const filterConditions: Prisma.dashapp_companydataWhereInput = {
    id: ids?.length ? { in: ids.map((id) => BigInt(id)) } : undefined,

    dashapp_brandendorsements:
      endorsement?.name || endorsement?.isActive
        ? {
            some: getEndorsementQuery(endorsement),
          }
        : undefined,

    strategy_overview: strategyOverview
      ? {
          contains: strategyOverview,
          mode: "insensitive",
        }
      : undefined,

    dashapp_companydata_age: ageIds?.length
      ? {
          some: {
            dashapp_age: {
              id: { in: ageIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_age: {
          //           id: { notIn: ageIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
    instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
    twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
    linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
    youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
    website: website ? { contains: website, mode: "insensitive" } : undefined,

    dashapp_companydata_subcategory:
      subCategoryIds?.length || maincategoryIds?.length
        ? {
            some: {
              dashapp_subcategory: {
                OR: [
                  {
                    ...(subCategoryIds?.length ? { id: { in: subCategoryIds.map((id) => BigInt(id)) } } : {}),
                  },
                  {
                    ...(maincategoryIds?.length
                      ? {
                          dashapp_category: {
                            id: { in: maincategoryIds.map((id) => BigInt(id)) },
                          },
                        }
                      : {}),
                  },
                ],
              },
            },
            //   none: {
            //       dashapp_subcategory: {
            //           id: { notIn: subCategoryIds.map((id) => BigInt(id)) },
            //       },
            //   },
          }
        : undefined,

    dashapp_companydata_personality_traits:
      subPersonalityTraitIds?.length || mainpersonalityIds?.length
        ? {
            some: {
              dashapp_subpersonality: {
                OR: [
                  {
                    ...(subPersonalityTraitIds?.length
                      ? {
                          id: {
                            in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                        }
                      : {}),
                  },
                  {
                    ...(mainpersonalityIds?.length
                      ? {
                          dashapp_mainpersonality: {
                            id: { in: mainpersonalityIds.map((id) => BigInt(id)) },
                          },
                        }
                      : {}),
                  },
                ],
              },
            },
          }
        : undefined,

    dashapp_companydata_gender: genderIds?.length
      ? {
          every: {
            dashapp_gender: await getGenderQuery(genderIds),
          },
        }
      : undefined,

    dashapp_companydata_income: nccsIds?.length
      ? {
          some: {
            dashapp_nccs: {
              id: { in: nccsIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_nccs: {
          //           id: { notIn: nccsIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_taglines: taglineIds?.length
      ? {
          some: {
            dashapp_taglines: {
              id: { in: taglineIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_taglines: {
          //           id: { notIn: taglineIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_key_markets_primary: primaryMarketIds?.length
      ? {
          some: {
            dashapp_keymarket: {
              id: { in: primaryMarketIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_keymarket: {
          //           id: { notIn: primaryMarketIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_key_markets_secondary: secondaryMarketIds?.length
      ? {
          some: {
            dashapp_keymarket: {
              id: {
                in: secondaryMarketIds.map((id) => BigInt(id)),
              },
            },
          },
          //   none: {
          //       dashapp_keymarket: {
          //           id: {
          //               notIn: secondaryMarketIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_key_markets_tertiary: tertiaryIds?.length
      ? {
          some: {
            dashapp_states: {
              id: { in: tertiaryIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_states: {
          //           id: { notIn: tertiaryIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_tier: tierIds?.length
      ? {
          some: {
            dashapp_tier: {
              id: { in: tierIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_tier: {
          //           id: { notIn: tierIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_active_campaigns: activeCampaignIds?.length
      ? {
          some: {
            dashapp_activecampaigns: {
              id: { in: activeCampaignIds.map((id) => BigInt(id)) },
            },
          },
          //   none: {
          //       dashapp_activecampaigns: {
          //           id: { notIn: activeCampaignIds.map((id) => BigInt(id)) },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_marketing_platforms_primary: primaryMarketingPlatformIds?.length
      ? {
          some: {
            dashapp_marketingplatform: {
              id: {
                in: primaryMarketingPlatformIds.map((id) => BigInt(id)),
              },
            },
          },
          //   none: {
          //       dashapp_marketingplatform: {
          //           id: {
          //               notIn: primaryMarketingPlatformIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
        }
      : undefined,

    dashapp_companydata_marketing_platforms_secondary: secondaryMarketingPlatformIds?.length
      ? {
          some: {
            dashapp_marketingplatform: {
              id: {
                in: secondaryMarketingPlatformIds.map((id) => BigInt(id)),
              },
            },
          },
          //   none: {
          //       dashapp_marketingplatform: {
          //           id: {
          //               notIn: secondaryMarketingPlatformIds.map((id) => BigInt(id)),
          //           },
          //       },
          //   },
        }
      : undefined,

    dashapp_states: stateIds?.length
      ? {
          id: { in: stateIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_hqcity: cityIds?.length
      ? {
          id: { in: cityIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_agency: agencyIds?.length
      ? {
          id: { in: agencyIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_parentorg: parentOrgIds?.length
      ? {
          id: { in: parentOrgIds.map((id) => BigInt(id)) },
        }
      : undefined,

    dashapp_brandcontact:
      contactName || contactDesignation || contactEmail || contactNumber || contactLinkedin
        ? {
            some: {
              contact_name: contactName
                ? {
                    contains: contactName,
                    mode: "insensitive",
                  }
                : undefined,
              contact_designation: contactDesignation
                ? {
                    contains: contactDesignation,
                    mode: "insensitive",
                  }
                : undefined,
              contact_email: contactEmail
                ? {
                    contains: contactEmail,
                    mode: "insensitive",
                  }
                : undefined,
              contact_no: contactNumber
                ? {
                    contains: contactNumber,
                  }
                : undefined,
              contact_linkedin: contactLinkedin
                ? {
                    contains: contactLinkedin,
                    mode: "insensitive",
                  }
                : undefined,
            },
          }
        : undefined,
  };

  const combinedFilterConditions = isMandatory
    ? filterConditions
    : {
        OR: Object.entries(filterConditions)
          .filter(([_, condition]) => condition)
          .map(([key, condition]) => ({ [key]: condition })),
      };

  const brands = await getBrands({ query: combinedFilterConditions, take, skip, select: brandSelect });

  if (brands.length < 1) {
    throw new NotFoundError("No brands found for the given filters");
  }

  const mainCategories = await prisma.dashapp_category.findMany({
    where: {
      dashapp_subcategory: {
        some: {
          dashapp_companydata_subcategory: {
            some: { companydata_id: { in: brands.map((brand) => brand.id) } },
          },
        },
      },
    },
    select: {
      id: true,
      category: true,
      dashapp_subcategory: {
        select: {
          id: true,
          subcategory: true,
          dashapp_companydata_subcategory: {
            select: {
              companydata_id: true,
            },
          },
        },
      },
    },
  });

  const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
    where: {
      dashapp_subpersonality: {
        some: {
          dashapp_companydata_personality_traits: {
            some: { companydata_id: { in: brands.map((brand) => brand.id) } },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      dashapp_subpersonality: {
        where: {
          dashapp_companydata_personality_traits: {
            some: {
              companydata_id: { in: brands.map((brand) => brand.id) },
            },
          },
        },
        select: {
          id: true,
          name: true,
          dashapp_companydata_personality_traits: {
            select: {
              companydata_id: true,
            },
          },
        },
      },
    },
  });

  const personalitiesByBrandId: Record<string, typeof mainPersonalities> = {};

  mainPersonalities.forEach((personality) => {
    personality.dashapp_subpersonality.forEach((subPersonality) => {
      const brandIds = subPersonality.dashapp_companydata_personality_traits.map((trait) => trait.companydata_id);

      brandIds.forEach((leagueId) => {
        const brandIdStr = leagueId.toString();

        if (!personalitiesByBrandId[brandIdStr]) {
          personalitiesByBrandId[brandIdStr] = [];
        }

        const alreadyAdded = personalitiesByBrandId[brandIdStr].some((p) => p.id === personality.id);

        if (!alreadyAdded) {
          const filteredPersonality = {
            ...personality,
            dashapp_subpersonality: personality.dashapp_subpersonality.filter((sub) =>
              sub.dashapp_companydata_personality_traits.some(
                (trait) => trait.companydata_id.toString() === brandIdStr,
              ),
            ),
          };

          personalitiesByBrandId[brandIdStr].push(filteredPersonality);
        }
      });
    });
  });

  const categoriesByBrandId: Record<string, typeof mainCategories> = {};

  mainCategories.forEach((category) => {
    category.dashapp_subcategory.forEach((subCategory) => {
      const brandIds = subCategory.dashapp_companydata_subcategory.map((trait) => trait.companydata_id);

      brandIds.forEach((brandId) => {
        const brandIdStr = brandId ? brandId.toString() : "";

        if (!categoriesByBrandId[brandIdStr]) {
          categoriesByBrandId[brandIdStr] = [];
        }

        const alreadyAdded = categoriesByBrandId[brandIdStr].some((p) => p.id === category.id);

        if (!alreadyAdded) {
          const filteredCategory = {
            ...category,
            dashapp_subpersonality: category.dashapp_subcategory.filter((sub) =>
              sub.dashapp_companydata_subcategory.some((x) => x.companydata_id?.toString() === brandIdStr),
            ),
          };

          categoriesByBrandId[brandIdStr].push(filteredCategory);
        }
      });
    });
  });

  const updatedBrands = brands.map((brand) => ({
    ...brand,
    mainPersonalities: personalitiesByBrandId[brand?.id?.toString()] || [],
    mainCategories: categoriesByBrandId[brand?.id?.toString()] || [],
  }));

  let filteredBrands = updatedBrands;

  // 1. Exact filtering for dashapp_companydata_age
  if (ageIds?.length) {
    const requiredAgeIds = ageIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandAgeIds = brand.dashapp_companydata_age.map((entry: any) => {
        return entry.dashapp_age.id.toString();
      });
      return exactSetMatch(brandAgeIds, requiredAgeIds);
    });
  }

  // 2. Exact filtering for dashapp_companydata_personality_traits
  if (subPersonalityTraitIds?.length) {
    const requiredSubPersonalityTraitIds = subPersonalityTraitIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandSubPersonalityTraitIds = brand.mainPersonalities.flatMap((entry: any) => {
        return entry.dashapp_subpersonality.map((sub: any) => {
          return sub.id.toString();
        });
      });
      return exactSetMatch(brandSubPersonalityTraitIds, requiredSubPersonalityTraitIds);
    });
  }

  // 3. Exact filtering for dashapp_companydata_income
  if (nccsIds?.length) {
    const requiredNccsIds = nccsIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandNccsIds = brand.dashapp_companydata_income.map((entry: any) => {
        return entry.dashapp_nccs.id.toString();
      });
      return exactSetMatch(brandNccsIds, requiredNccsIds);
    });
  }

  // 4. Exact filtering for dashapp_companydata_taglines
  if (taglineIds?.length) {
    const requiredTaglineIds = taglineIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandTaglineIds = brand.dashapp_companydata_taglines.map((entry: any) => {
        return entry.dashapp_taglines.id.toString();
      });
      return exactSetMatch(brandTaglineIds, requiredTaglineIds);
    });
  }

  // 5. Exact filtering for dashapp_companydata_key_markets_primary
  if (primaryMarketIds?.length) {
    const requiredKeyPrimaryIds = primaryMarketIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandKeyPrimaryIds = brand.dashapp_companydata_key_markets_primary.map((entry: any) => {
        return entry.dashapp_keymarket.id.toString();
      });
      return exactSetMatch(brandKeyPrimaryIds, requiredKeyPrimaryIds);
    });
  }

  // 6. Exact filtering for dashapp_companydata_key_markets_secondary
  if (secondaryMarketIds?.length) {
    const requiredKeySecondaryIds = secondaryMarketIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandKeySecondaryIds = brand.dashapp_companydata_key_markets_secondary.map((entry: any) => {
        return entry.dashapp_keymarket.id.toString();
      });
      return exactSetMatch(brandKeySecondaryIds, requiredKeySecondaryIds);
    });
  }

  // 7. Exact filtering for dashapp_companydata_key_markets_tertiary
  if (tertiaryIds?.length) {
    const requiredTertiaryIds = tertiaryIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandTertiaryIds = brand.dashapp_companydata_key_markets_tertiary.map((entry: any) => {
        return entry.dashapp_states.id.toString();
      });
      return exactSetMatch(brandTertiaryIds, requiredTertiaryIds);
    });
  }

  // 8. Exact filtering for dashapp_companydata_tier
  if (tierIds?.length) {
    const requiredTierIds = tierIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandTierIds = brand.dashapp_companydata_tier.map((entry: any) => {
        return entry.dashapp_tier.id.toString();
      });
      return exactSetMatch(brandTierIds, requiredTierIds);
    });
  }

  // 9. Exact filtering for dashapp_companydata_active_campaigns
  if (activeCampaignIds?.length) {
    const requiredActiveCampaignIds = activeCampaignIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandActiveCampaignIds = brand.dashapp_companydata_active_campaigns.map((entry: any) => {
        return entry.dashapp_activecampaigns.id.toString();
      });
      return exactSetMatch(brandActiveCampaignIds, requiredActiveCampaignIds);
    });
  }

  // 10. Exact filtering for dashapp_companydata_marketing_platforms_primary
  if (primaryMarketingPlatformIds?.length) {
    const requiredPrimaryIds = primaryMarketingPlatformIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandPrimaryIds = brand.dashapp_companydata_marketing_platforms_primary.map((entry: any) => {
        return entry.dashapp_marketingplatform.id.toString();
      });
      return exactSetMatch(brandPrimaryIds, requiredPrimaryIds);
    });
  }

  // 11. Exact filtering for dashapp_companydata_marketing_platforms_secondary
  if (secondaryMarketingPlatformIds?.length) {
    const requiredSecondaryIds = secondaryMarketingPlatformIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandSecondaryIds = brand.dashapp_companydata_marketing_platforms_secondary.map((entry: any) => {
        return entry.dashapp_marketingplatform.id.toString();
      });
      return exactSetMatch(brandSecondaryIds, requiredSecondaryIds);
    });
  }

  // 12. Exact filtering for dashapp_companydata_subcategory
  if (subCategoryIds?.length) {
    const requiredSubcategoryIds = subCategoryIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandSubcategoryIds = brand.mainCategories.flatMap((entry: any) => {
        return entry.dashapp_subcategory?.map((sub: any) => sub.id.toString()) || [];
      });
      return exactSetMatch(brandSubcategoryIds, requiredSubcategoryIds);
    });
  }

  // 13. Exact filtering for dashapp_companydata_subcategory.dashapp_category
  if (maincategoryIds?.length) {
    const requiredMaincategoryIds = maincategoryIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandMaincategoryIds = brand.mainCategories.map((entry: any) => {
        return entry.id.toString();
      });
      return exactSetMatch(brandMaincategoryIds, requiredMaincategoryIds);
    });
  }

  // 14. Exact filtering for dashapp_companydata_personality_traits
  if (mainpersonalityIds?.length) {
    const requiredMainPersonalityTraitIds = mainpersonalityIds.map((id) => BigInt(id).toString());
    filteredBrands = filteredBrands.filter((brand) => {
      const brandMainPersonalityTraitIds = brand.mainPersonalities.map((entry: any) => {
        return entry.id.toString();
      });
      return exactSetMatch(brandMainPersonalityTraitIds, requiredMainPersonalityTraitIds);
    });
  }

  const modifiedBrands =
    genderIds?.length === 2
      ? filteredBrands.filter((brand) => brand.dashapp_companydata_gender.length === 2)
      : filteredBrands;

  const brandResponse: BrandResponseDTO[] = modifiedBrands.map((brand) =>
    BrandResponseDTO.toResponse(brand as unknown as TBrandDetails),
  );

  res.status(STATUS_CODE.OK).json(brandResponse);
});
