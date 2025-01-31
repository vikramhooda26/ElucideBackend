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
import { getEndorsementQuery, getGenderQuery } from "./constants/index.js";
import { getBrandsCount } from "./dashboard/helpers.js";

export const getBrands = async ({
    query,
    take,
    skip,
    select,
}: {
    query?: Prisma.dashapp_companydataWhereInput;
    take?: any;
    skip?: any;
    select: Prisma.dashapp_companydataSelect;
}) => {
    return await prisma.dashapp_companydata.findMany({
        where: query || undefined,
        select: select,
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });
};

export const getAllBrands = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

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

    const brands = await getBrands({ take, skip, select: selectBrand });

    if (brands.length < 1) {
        throw new NotFoundError("Brands data does not exists");
    }

    const count = await getBrandsCount();

    res.status(STATUS_CODE.OK).json(
        brands.map((brand) => ({
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
            count,
        })),
    );
});

export const getBrandById = asyncHandler(async (req, res) => {
    const brandId = req.params.id;

    if (!brandId) {
        throw new BadRequestError("Brand ID not found");
    }

    const brand = await prisma.dashapp_companydata.findUnique({
        where: { id: BigInt(brandId) },
        select: brandSelect,
    });

    if (!brand?.id) {
        throw new NotFoundError("This brand does not exists");
    }

    const mainCategories = await prisma.dashapp_category.findMany({
        where: {
            dashapp_subcategory: {
                some: {
                    dashapp_companydata_subcategory: {
                        some: { companydata_id: BigInt(brandId) },
                    },
                },
            },
        },
        select: {
            id: true,
            category: true,
            dashapp_subcategory: {
                where: {
                    dashapp_companydata_subcategory: {
                        some: {
                            companydata_id: BigInt(brandId),
                        },
                    },
                },
                select: {
                    id: true,
                    subcategory: true,
                },
            },
        },
    });

    const mainPersonalities = await prisma.dashapp_mainpersonality.findMany({
        where: {
            dashapp_subpersonality: {
                some: {
                    dashapp_companydata_personality_traits: {
                        some: { companydata_id: BigInt(brandId) },
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
                            companydata_id: BigInt(brandId),
                        },
                    },
                },
            },
        },
    });

    const updatedBrand = {
        ...brand,
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
                  none: {
                      dashapp_age: {
                          id: { notIn: ageIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        facebook: facebook ? { contains: facebook, mode: "insensitive" } : undefined,
        instagram: instagram ? { contains: instagram, mode: "insensitive" } : undefined,
        twitter: twitter ? { contains: twitter, mode: "insensitive" } : undefined,
        linkedin: linkedin ? { contains: linkedin, mode: "insensitive" } : undefined,
        youtube: youtube ? { contains: youtube, mode: "insensitive" } : undefined,
        website: website ? { contains: website, mode: "insensitive" } : undefined,

        dashapp_companydata_personality_traits: subPersonalityTraitIds?.length
            ? {
                  some: {
                      dashapp_subpersonality: {
                          id: {
                              in: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
                      },
                  },
                  none: {
                      dashapp_subpersonality: {
                          id: {
                              notIn: subPersonalityTraitIds.map((id) => BigInt(id)),
                          },
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
                  none: {
                      dashapp_nccs: {
                          id: { notIn: nccsIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_taglines: taglineIds?.length
            ? {
                  some: {
                      dashapp_taglines: {
                          id: { in: taglineIds.map((id) => BigInt(id)) },
                      },
                  },
                  none: {
                      dashapp_taglines: {
                          id: { notIn: taglineIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_key_markets_primary: primaryMarketIds?.length
            ? {
                  some: {
                      dashapp_keymarket: {
                          id: { in: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
                  none: {
                      dashapp_keymarket: {
                          id: { notIn: primaryMarketIds.map((id) => BigInt(id)) },
                      },
                  },
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
                  none: {
                      dashapp_keymarket: {
                          id: {
                              notIn: secondaryMarketIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_key_markets_tertiary: tertiaryIds?.length
            ? {
                  some: {
                      dashapp_states: {
                          id: { in: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
                  none: {
                      dashapp_states: {
                          id: { notIn: tertiaryIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_tier: tierIds?.length
            ? {
                  some: {
                      dashapp_tier: {
                          id: { in: tierIds.map((id) => BigInt(id)) },
                      },
                  },
                  none: {
                      dashapp_tier: {
                          id: { notIn: tierIds.map((id) => BigInt(id)) },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_active_campaigns: activeCampaignIds?.length
            ? {
                  some: {
                      dashapp_activecampaigns: {
                          id: { in: activeCampaignIds.map((id) => BigInt(id)) },
                      },
                  },
                  none: {
                      dashapp_activecampaigns: {
                          id: { notIn: activeCampaignIds.map((id) => BigInt(id)) },
                      },
                  },
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
                  none: {
                      dashapp_marketingplatform: {
                          id: {
                              notIn: primaryMarketingPlatformIds.map((id) => BigInt(id)),
                          },
                      },
                  },
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
                  none: {
                      dashapp_marketingplatform: {
                          id: {
                              notIn: secondaryMarketingPlatformIds.map((id) => BigInt(id)),
                          },
                      },
                  },
              }
            : undefined,

        dashapp_companydata_subcategory: subCategoryIds?.length
            ? {
                  some: {
                      dashapp_subcategory: {
                          id: { in: subCategoryIds.map((id) => BigInt(id)) },
                      },
                  },
                  none: {
                      dashapp_subcategory: {
                          id: { notIn: subCategoryIds.map((id) => BigInt(id)) },
                      },
                  },
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

    const modifiedBrands =
        genderIds?.length === 2 ? brands.filter((brand) => brand.dashapp_companydata_gender.length === 2) : brands;

    const mainCategories = await prisma.dashapp_category.findMany({
        where: {
            dashapp_subcategory: {
                some: {
                    dashapp_companydata_subcategory: {
                        some: { companydata_id: { in: modifiedBrands.map((brand) => brand.id) } },
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
                        some: { companydata_id: { in: modifiedBrands.map((brand) => brand.id) } },
                    },
                },
            },
        },
        select: {
            id: true,
            name: true,
            dashapp_subpersonality: {
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
        const brandIds = personality.dashapp_subpersonality
            .flatMap((sub) => sub.dashapp_companydata_personality_traits.map((trait) => trait.companydata_id))
            .filter(Boolean);
        brandIds.forEach((brandId) => {
            const brandIdStr = brandId.toString();
            if (!personalitiesByBrandId[brandIdStr]) {
                personalitiesByBrandId[brandIdStr] = [];
            }

            const alreadyAdded = personalitiesByBrandId[brandIdStr].some((p) => p.id === personality.id);

            if (!alreadyAdded) {
                personalitiesByBrandId[brandIdStr].push(personality);
            }
        });
    });

    const categoriesByBrandId: Record<string, typeof mainCategories> = {};

    mainCategories.forEach((category) => {
        const brandIds = category.dashapp_subcategory.flatMap((sub) =>
            sub.dashapp_companydata_subcategory.map((trait) => trait?.companydata_id).filter(Boolean),
        );
        brandIds.forEach((brandId) => {
            const brandIdStr = brandId?.toString() || "";
            if (!categoriesByBrandId[brandIdStr]) {
                categoriesByBrandId[brandIdStr] = [];
            }

            const alreadyAdded = categoriesByBrandId[brandIdStr].some((p) => p.id === category.id);

            if (!alreadyAdded) {
                categoriesByBrandId[brandIdStr].push(category);
            }
        });
    });

    const updatedBrands = modifiedBrands.map((brand) => ({
        ...brand,
        mainPersonalities: personalitiesByBrandId[brand?.id?.toString()] || [],
        mainCategories: categoriesByBrandId[brand?.id?.toString()] || [],
    }));

    const brandResponse: BrandResponseDTO[] = updatedBrands.map((brand) =>
        BrandResponseDTO.toResponse(brand as unknown as TBrandDetails),
    );

    res.status(STATUS_CODE.OK).json(brandResponse);
});
