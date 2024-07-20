import asyncHandler from "express-async-handler";
import { prisma } from "../db/index.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import { STATUS_CODE } from "../lib/constants.js";
import {
    TCreateBrandSchema,
    TEditBrandSchema,
} from "../schemas/brand.schema.js";

// TODO verify that the edit method is correct and contains all the required fields (AI generated)

export const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await prisma.dashapp_companydata.findMany({
        select: {
            id: true,
            company_name: true,
            created_date: true,
            modified_date: true,
            modified_by: { select: { id: true, email: true } },
            created_by: { select: { id: true, email: true } },
        },
    });

    if (brands.length < 1) {
        throw new NotFoundError("No brands found");
    }

    res.status(STATUS_CODE.OK).json(brands);
});

export const getBrandById = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    if (!brandId) {
        throw new BadRequestError("Brand ID not found");
    }

    const brand = await prisma.dashapp_companydata.findUnique({
        where: { id: Number(brandId) },
    });

    if (!brand) {
        throw new NotFoundError("This brand does not exists");
    }

    res.status(STATUS_CODE.OK).json(brand);
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
                connect: {
                    id: parentOrgId,
                },
            },
            dashapp_companydata_subcategory: {
                create: subCategoryIds?.map((subCategoryId) => ({
                    dashapp_subcategory: { connect: { id: subCategoryId } },
                })),
            },
            dashapp_hqcity: {
                connect: {
                    id: hqCityId,
                },
            },
            hq_state: {
                connect: {
                    id: hqStateId,
                },
            },
            dashapp_agency: {
                connect: {
                    id: agencyId,
                },
            },
            dashapp_companydata_tier: {
                create: tierIds?.map((tierId) => ({
                    dashapp_tier: {
                        connect: { id: tierId },
                    },
                })),
            },
            dashapp_companydata_personality_traits: {
                create: personalityTraitIds?.map((traitId) => ({
                    dashapp_subpersonality: {
                        connect: { id: traitId },
                    },
                })),
            },
            dashapp_companydata_taglines: {
                create: taglineIds?.map((taglineId) => ({
                    dashapp_taglines: {
                        connect: { id: taglineId },
                    },
                })),
            },
            dashapp_companydata_active_campaigns: {
                create: activeCampaignIds?.map((activeCampaignId) => ({
                    dashapp_activecampaigns: {
                        connect: { id: activeCampaignId },
                    },
                })),
            },
            dashapp_companydata_marketing_platforms_primary: {
                create: marketingPlatformPrimaryIds?.map(
                    (marketingPlatformPrimaryId) => ({
                        dashapp_marketingplatform: {
                            connect: { id: marketingPlatformPrimaryId },
                        },
                    }),
                ),
            },
            dashapp_companydata_marketing_platforms_secondary: {
                create: marketingPlatformSecondaryIds?.map(
                    (marketingPlatformSecondaryId) => ({
                        dashapp_marketingplatform: {
                            connect: { id: marketingPlatformSecondaryId },
                        },
                    }),
                ),
            },
            dashapp_companydata_age: {
                create: ageIds?.map((ageId) => ({
                    dashapp_age: {
                        connect: { id: ageId },
                    },
                })),
            },
            dashapp_companydata_gender: {
                create: genderIds?.map((genderId) => ({
                    dashapp_gender: {
                        connect: { id: genderId },
                    },
                })),
            },
            dashapp_companydata_income: {
                create: incomeIds?.map((incomeId) => ({
                    dashapp_income: {
                        connect: { id: incomeId },
                    },
                })),
            },
            dashapp_companydata_key_markets_primary: {
                create: primaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: marketId } },
                })),
            },
            dashapp_companydata_key_markets_secondary: {
                create: secondaryMarketIds?.map((marketId) => ({
                    dashapp_keymarket: { connect: { id: marketId } },
                })),
            },
            dashapp_companydata_key_markets_tertiary: {
                create: tertiaryIds?.map((tertiaryId) => ({
                    dashapp_states: { connect: { id: tertiaryId } },
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

    res.status(STATUS_CODE.OK).send("Brand created");
});

export const editBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

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
                ? { connect: { id: parentOrgId } }
                : undefined,
            dashapp_companydata_subcategory: subCategoryIds
                ? {
                      deleteMany: {},
                      create: subCategoryIds.map((subCategoryId) => ({
                          dashapp_subcategory: {
                              connect: { id: subCategoryId },
                          },
                      })),
                  }
                : undefined,
            dashapp_hqcity: hqCityId
                ? { connect: { id: hqCityId } }
                : undefined,
            hq_state: hqStateId ? { connect: { id: hqStateId } } : undefined,
            dashapp_agency: agencyId
                ? { connect: { id: agencyId } }
                : undefined,
            dashapp_companydata_tier: tierIds
                ? {
                      deleteMany: {},
                      create: tierIds.map((tierId) => ({
                          dashapp_tier: { connect: { id: tierId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_personality_traits: personalityTraitIds
                ? {
                      deleteMany: {},
                      create: personalityTraitIds.map((traitId) => ({
                          dashapp_subpersonality: { connect: { id: traitId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_taglines: taglineIds
                ? {
                      deleteMany: {},
                      create: taglineIds.map((taglineId) => ({
                          dashapp_taglines: { connect: { id: taglineId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_active_campaigns: activeCampaignIds
                ? {
                      deleteMany: {},
                      create: activeCampaignIds.map((activeCampaignId) => ({
                          dashapp_activecampaigns: {
                              connect: { id: activeCampaignId },
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
                                          id: marketingPlatformPrimaryId,
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
                                          id: marketingPlatformSecondaryId,
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
                          dashapp_age: { connect: { id: ageId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_gender: genderIds
                ? {
                      deleteMany: {},
                      create: genderIds.map((genderId) => ({
                          dashapp_gender: { connect: { id: genderId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_income: incomeIds
                ? {
                      deleteMany: {},
                      create: incomeIds.map((incomeId) => ({
                          dashapp_income: { connect: { id: incomeId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_primary: primaryMarketIds
                ? {
                      deleteMany: {},
                      create: primaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: { connect: { id: marketId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_secondary: secondaryMarketIds
                ? {
                      deleteMany: {},
                      create: secondaryMarketIds.map((marketId) => ({
                          dashapp_keymarket: { connect: { id: marketId } },
                      })),
                  }
                : undefined,
            dashapp_companydata_key_markets_tertiary: tertiaryIds
                ? {
                      deleteMany: {},
                      create: tertiaryIds.map((tertiaryId) => ({
                          dashapp_states: { connect: { id: tertiaryId } },
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

    res.status(STATUS_CODE.OK).send("Brand updated");
});

export const deleteBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    if (!brandId) {
        throw new BadRequestError("Brand ID not found");
    }

    const deletedBrand = await prisma.dashapp_companydata.delete({
        where: { id: Number(brandId) },
        select: { id: true },
    });

    if (!deletedBrand.id) {
        throw new NotFoundError("This brand does not exists");
    }

    res.status(STATUS_CODE.OK).send("Brand deleted");
});
