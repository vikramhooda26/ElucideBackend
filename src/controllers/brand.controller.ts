import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { STATUS_CODE } from "../lib/constants.js";
import {
    TCreateBrandSchema,
    TEditBrandSchema,
} from "../schemas/brand.schema.js";
import { brandSelect } from "../types/brand.type.js";
import { BrandResponseDTO } from "../dto/brand.dto.js";

export const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await prisma.dashapp_companydata.findMany({
        select: {
            id: true,
            company_name: true,
            created_date: true,
            modified_date: true,
            modified_by: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                },
            },
            created_by: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                },
            },
        },
    });

    if (brands.length < 1) {
        throw new NotFoundError("Brands data does not exists");
    }

    res.status(STATUS_CODE.OK).json(
        brands.map((brand) => ({
            id: brand.id,
            athleteName: brand.company_name,
            createdDate: brand.created_date,
            modifiedDate: brand.modified_date,
            createdBy: {
                userId: brand.created_by?.id,
                email: brand.created_by?.email,
                firstName: brand.created_by?.first_name,
                lastName: brand.created_by?.last_name,
                username: brand.created_by?.username,
            },
            modifiedBy: {
                userId: brand.modified_by?.id,
                email: brand.modified_by?.email,
                firstName: brand.modified_by?.first_name,
                lastName: brand.modified_by?.last_name,
                username: brand.modified_by?.username,
            },
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

    if (!brand) {
        throw new NotFoundError("This brand does not exists");
    }

    const brandResponse: BrandResponseDTO = BrandResponseDTO.toResponse(brand);

    res.status(STATUS_CODE.OK).json(brandResponse);
});

export const createBrand = asyncHandler(async (req, res) => {
    const {
        companyName,
        parentOrgId,
        subCategoryIds,
        hqCityId,
        hqStateId,
        agencyId,
        tierIds,
        facebook,
        instagram,
        linkedin,
        twitter,
        website,
        youtube,
        personalityTraitIds,
        strategyOverview,
        taglineIds,
        activeCampaignIds,
        marketingPlatformPrimaryIds,
        marketingPlatformSecondaryIds,
        ageIds,
        genderIds,
        incomeIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
    } = req.validatedData as TCreateBrandSchema;

    await prisma.dashapp_companydata.create({
        data: {
            company_name: companyName,
            dashapp_parentorg: {
                connect: parentOrgId
                    ? {
                          id: BigInt(parentOrgId),
                      }
                    : undefined,
            },
            dashapp_companydata_subcategory: {
                create: subCategoryIds?.map((subCategoryId) => ({
                    dashapp_subcategory: {
                        connect: { id: BigInt(subCategoryId) },
                    },
                })),
            },
            dashapp_hqcity: {
                connect: hqCityId
                    ? {
                          id: BigInt(hqCityId),
                      }
                    : undefined,
            },
            dashapp_states: {
                connect: hqStateId
                    ? {
                          id: BigInt(hqStateId),
                      }
                    : undefined,
            },
            dashapp_agency: {
                connect: agencyId
                    ? {
                          id: BigInt(agencyId),
                      }
                    : undefined,
            },
            dashapp_companydata_tier: {
                create: tierIds?.map((tierId) => ({
                    dashapp_tier: {
                        connect: { id: BigInt(tierId) },
                    },
                })),
            },
            dashapp_companydata_personality_traits: {
                create: personalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: BigInt(traitId) },
                    },
                })),
            },
            dashapp_companydata_taglines: {
                create: taglineIds?.map((taglineId) => ({
                    dashapp_taglines: {
                        connect: { id: BigInt(taglineId) },
                    },
                })),
            },
            dashapp_companydata_active_campaigns: {
                create: activeCampaignIds?.map((activeCampaignId) => ({
                    dashapp_activecampaigns: {
                        connect: { id: BigInt(activeCampaignId) },
                    },
                })),
            },
            dashapp_companydata_marketing_platforms_primary: {
                create: marketingPlatformPrimaryIds?.map(
                    (marketingPlatformPrimaryId) => ({
                        dashapp_marketingplatform: {
                            connect: { id: BigInt(marketingPlatformPrimaryId) },
                        },
                    }),
                ),
            },
            dashapp_companydata_marketing_platforms_secondary: {
                create: marketingPlatformSecondaryIds?.map(
                    (marketingPlatformSecondaryId) => ({
                        dashapp_marketingplatform: {
                            connect: {
                                id: BigInt(marketingPlatformSecondaryId),
                            },
                        },
                    }),
                ),
            },
            dashapp_companydata_age: {
                create: ageIds?.map((ageId) => ({
                    dashapp_age: {
                        connect: { id: BigInt(ageId) },
                    },
                })),
            },
            dashapp_companydata_gender: {
                create: genderIds?.map((genderId) => ({
                    dashapp_gender: {
                        connect: { id: BigInt(genderId) },
                    },
                })),
            },
            dashapp_companydata_income: {
                create: incomeIds?.map((incomeId) => ({
                    dashapp_income: {
                        connect: { id: BigInt(incomeId) },
                    },
                })),
            },
            dashapp_companydata_key_markets_primary: {
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_companydata_key_markets_secondary: {
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: BigInt(marketId) } },
                })),
            },
            dashapp_companydata_key_markets_tertiary: {
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: BigInt(tertiaryId) } },
                })),
            },
            strategy_overview: strategyOverview,
            instagram,
            facebook,
            linkedin,
            twitter,
            youtube,
            website,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Brand created",
    });
});

export const editBrand = asyncHandler(async (req, res) => {
    const brandId = req.params.id;

    if (!brandId) {
        throw new BadRequestError("Brand ID not found");
    }

    const {
        companyName,
        parentOrgId,
        subCategoryIds,
        hqCityId,
        hqStateId,
        agencyId,
        tierIds,
        facebook,
        instagram,
        linkedin,
        twitter,
        website,
        youtube,
        personalityTraitIds,
        strategyOverview,
        taglineIds,
        activeCampaignIds,
        marketingPlatformPrimaryIds,
        marketingPlatformSecondaryIds,
        ageIds,
        genderIds,
        incomeIds,
        primaryMarketIds,
        secondaryMarketIds,
        tertiaryIds,
    } = req.validatedData as TEditBrandSchema;

    await prisma.dashapp_companydata.update({
        where: { id: Number(brandId) },
        data: {
            company_name: companyName,
            dashapp_parentorg: parentOrgId
                ? { connect: { id: BigInt(parentOrgId) } }
                : undefined,
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
            dashapp_hqcity: hqCityId
                ? { connect: { id: BigInt(hqCityId) } }
                : undefined,
            dashapp_states: hqStateId
                ? { connect: { id: BigInt(hqStateId) } }
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
            dashapp_companydata_personality_traits: personalityTraitIds
                ? {
                      deleteMany: {},
                      create: personalityTraitIds.map((traitId) => ({
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
                marketingPlatformPrimaryIds
                    ? {
                          deleteMany: {},
                          create: marketingPlatformPrimaryIds.map(
                              (marketingPlatformPrimaryId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              marketingPlatformPrimaryId,
                                          ),
                                      },
                                  },
                              }),
                          ),
                      }
                    : undefined,
            dashapp_companydata_marketing_platforms_secondary:
                marketingPlatformSecondaryIds
                    ? {
                          deleteMany: {},
                          create: marketingPlatformSecondaryIds.map(
                              (marketingPlatformSecondaryId) => ({
                                  dashapp_marketingplatform: {
                                      connect: {
                                          id: BigInt(
                                              marketingPlatformSecondaryId,
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
            dashapp_companydata_income: incomeIds
                ? {
                      deleteMany: {},
                      create: incomeIds.map((incomeId) => ({
                          dashapp_income: { connect: { id: BigInt(incomeId) } },
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
            strategy_overview: strategyOverview,
            instagram,
            facebook,
            linkedin,
            twitter,
            youtube,
            website,
        },
    });

    res.status(STATUS_CODE.OK).json({
        message: "Brand details updated",
    });
});

export const deleteBrand = asyncHandler(async (req, res) => {
    const brandId = req.params.id;

    if (!brandId) {
        throw new BadRequestError("Brand ID not found");
    }

    const deletedBrand = await prisma.dashapp_companydata.delete({
        where: { id: BigInt(brandId) },
        select: { id: true },
    });

    if (!deletedBrand) {
        throw new NotFoundError("This brand does not exists");
    }

    res.status(STATUS_CODE.OK).json({
        message: "Brand deleted",
    });
});
