import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BrandResponseDTO } from "../dto/brand.dto.js";
import { STATUS_CODE } from "../lib/constants.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import {
    TCreateBrandSchema,
    TEditBrandSchema,
} from "../schemas/brand.schema.js";
import { brandSelect } from "../types/brand.type.js";
import { getBrandsCount } from "./dashboard/helpers.js";

export const getAllBrands = asyncHandler(async (req, res) => {
    const { take, skip } = req.query;

    const brands = await prisma.dashapp_companydata.findMany({
        select: {
            id: true,
            company_name: true,
            created_date: true,
            modified_date: true,
            modified_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            created_by: {
                select: {
                    id: true,
                    email: true,
                },
            },
            _count: true,
        },
        orderBy: { modified_date: "desc" },
        take: Number.isNaN(Number(take)) ? undefined : Number(take),
        skip: Number.isNaN(Number(skip)) ? undefined : Number(skip),
    });

    if (brands.length < 1) {
        throw new NotFoundError("Brands data does not exists");
    }

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
            count: brand._count,
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

    const brandResponse: BrandResponseDTO =
        BrandResponseDTO.toResponse(updatedBrand);

    res.status(STATUS_CODE.OK).json(brandResponse);
});

export const getTotalBrands = asyncHandler(async (req, res) => {
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

    const isEndorsementsExists =
        await prisma.dashapp_brandendorsements.findFirst({
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
            dashapp_companydata_tier: tierIds
                ? {
                      create: tierIds?.map((tierId) => ({
                          dashapp_tier: {
                              connect: { id: BigInt(tierId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_personality_traits: subPersonalityTraitIds
                ? {
                      create: subPersonalityTraitIds?.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_taglines: taglineIds
                ? {
                      create: taglineIds?.map((taglineId) => ({
                          dashapp_taglines: {
                              connect: { id: BigInt(taglineId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_active_campaigns: activeCampaignIds
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
            dashapp_companydata_marketing_platforms_primary:
                primaryMarketingPlatformIds
                    ? {
                          create: primaryMarketingPlatformIds?.map(
                              (primaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              primaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_companydata_marketing_platforms_secondary:
                secondaryMarketingPlatformIds
                    ? {
                          create: secondaryMarketingPlatformIds?.map(
                              (secondaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              secondaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_companydata_age: ageIds
                ? {
                      create: ageIds?.map((ageId) => ({
                          dashapp_age: {
                              connect: { id: BigInt(ageId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_gender: genderIds
                ? {
                      create: genderIds?.map((genderId) => ({
                          dashapp_gender: {
                              connect: { id: BigInt(genderId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_income: nccsIds
                ? {
                      create: nccsIds?.map((nccsId) => ({
                          dashapp_nccs: {
                              connect: { id: BigInt(nccsId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_primary: primaryMarketIds
                ? {
                      create: primaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_secondary: secondaryMarketIds
                ? {
                      create: secondaryMarketIds?.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_tertiary: tertiaryIds
                ? {
                      create: tertiaryIds?.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
                : undefined,
            strategy_overview: strategyOverview || undefined,
            instagram: instagram || undefined,
            facebook: facebook || undefined,
            linkedin: linkedin || undefined,
            twitter: twitter || undefined,
            youtube: youtube || undefined,
            website: website || undefined,
        },
        select: {
            id: true,
        },
    });

    if (contactPerson?.length) {
        await prisma.dashapp_brandcontact.createMany({
            data: contactPerson.map((details) => ({
                contact_name: details.contactName,
                contact_designation: details.contactDesignation || undefined,
                contact_email: details.contactEmail || undefined,
                contact_no: details.contactNumber || undefined,
                contact_linkedin: details.contactLinkedin || undefined,
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

    await prisma.dashapp_companydata.update({
        where: { id: BigInt(brandId) },
        data: {
            company_name: name || undefined,
            dashapp_parentorg: parentOrgId
                ? { connect: { id: BigInt(parentOrgId) } }
                : undefined,
            modified_by: { connect: { id: BigInt(userId) } },
            dashapp_companydata_subcategory: subCategoryIds
                ? {
                      deleteMany: {},
                      create: subCategoryIds.map((subCategoryId) => ({
                          dashapp_subcategory: {
                              connect: { id: BigInt(subCategoryId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_brandendorsements: endorsements?.length
                ? {
                      deleteMany: {},
                      create: endorsements.map((endorse) => ({
                          name: endorse.name,
                          active: endorse.active,
                      })),
                  }
                : undefined,
            dashapp_hqcity: cityId
                ? { connect: { id: BigInt(cityId) } }
                : undefined,
            dashapp_states: stateId
                ? { connect: { id: BigInt(stateId) } }
                : undefined,
            dashapp_agency: agencyId
                ? { connect: { id: BigInt(agencyId) } }
                : undefined,
            dashapp_companydata_tier: tierIds
                ? {
                      deleteMany: {},
                      create: tierIds.map((tierId) => ({
                          dashapp_tier: { connect: { id: BigInt(tierId) } },
                      })),
                  }
                : undefined,
            dashapp_companydata_personality_traits: subPersonalityTraitIds
                ? {
                      deleteMany: {},
                      create: subPersonalityTraitIds.map((traitId) => ({
                          dashapp_subpersonality: {
                              connect: { id: BigInt(traitId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_taglines: taglineIds
                ? {
                      deleteMany: {},
                      create: taglineIds.map((taglineId) => ({
                          dashapp_taglines: {
                              connect: { id: BigInt(taglineId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_active_campaigns: activeCampaignIds
                ? {
                      deleteMany: {},
                      create: activeCampaignIds.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: BigInt(activeCampaignId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_marketing_platforms_primary:
                primaryMarketingPlatformIds
                    ? {
                          deleteMany: {},
                          create: primaryMarketingPlatformIds.map(
                              (primaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              primaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_companydata_marketing_platforms_secondary:
                secondaryMarketingPlatformIds
                    ? {
                          deleteMany: {},
                          create: secondaryMarketingPlatformIds.map(
                              (secondaryMarketingPlatformId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              secondaryMarketingPlatformId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_companydata_age: ageIds
                ? {
                      deleteMany: {},
                      create: ageIds.map((ageId) => ({
                          dashapp_age: { connect: { id: BigInt(ageId) } },
                      })),
                  }
                : undefined,
            dashapp_companydata_gender: genderIds
                ? {
                      deleteMany: {},
                      create: genderIds.map((genderId) => ({
                          dashapp_gender: { connect: { id: BigInt(genderId) } },
                      })),
                  }
                : undefined,
            dashapp_companydata_income: nccsIds
                ? {
                      deleteMany: {},
                      create: nccsIds.map((nccsId) => ({
                          dashapp_nccs: { connect: { id: BigInt(nccsId) } },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_primary: primaryMarketIds
                ? {
                      deleteMany: {},
                      create: primaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_secondary: secondaryMarketIds
                ? {
                      deleteMany: {},
                      create: secondaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: {
                              connect: { id: BigInt(marketId) },
                          },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_tertiary: tertiaryIds
                ? {
                      deleteMany: {},
                      create: tertiaryIds.map((tertiaryId) => ({
                          dashapp_states: {
                              connect: { id: BigInt(tertiaryId) },
                          },
                      })),
                  }
                : undefined,
            strategy_overview: strategyOverview || undefined,
            instagram: instagram || undefined,
            facebook: facebook || undefined,
            linkedin: linkedin || undefined,
            twitter: twitter || undefined,
            youtube: youtube || undefined,
            website: website || undefined,
        },
        select: { id: true },
    });

    if (contactPerson?.length) {
        await prisma.dashapp_brandcontact.deleteMany({
            where: {
                id: {
                    notIn: contactPerson.map((details) =>
                        BigInt(details.contactId || ""),
                    ),
                },
                brand_id: BigInt(brandId),
            },
        });

        for (const details of contactPerson) {
            await prisma.dashapp_brandcontact.upsert({
                where: { id: BigInt(details.contactId || "") },
                create: {
                    contact_name: details.contactName,
                    contact_designation:
                        details.contactDesignation || undefined,
                    contact_email: details.contactEmail || undefined,
                    contact_no: details.contactNumber || undefined,
                    contact_linkedin: details.contactLinkedin || undefined,
                    dashapp_companydata: {
                        connect: {
                            id: BigInt(brandId),
                        },
                    },
                },
                update: {
                    contact_name: details.contactName || undefined,
                    contact_designation:
                        details.contactDesignation || undefined,
                    contact_email: details.contactEmail || undefined,
                    contact_no: details.contactNumber || undefined,
                    contact_linkedin: details.contactLinkedin || undefined,
                },
            });
        }
    } else {
        await prisma.dashapp_brandcontact.deleteMany({
            where: { brand_id: BigInt(brandId) },
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

    res.status(STATUS_CODE.OK).json({
        message: "Brand deleted",
    });
});

export const getFilteredBrand = asyncHandler(async (req, res) => {});
