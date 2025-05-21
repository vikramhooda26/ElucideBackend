import z from "zod";

export const createBrandSchema = z.object({
  name: z.string(),
  userId: z.string(),
  parentOrgId: z.string().optional(),
  subCategoryIds: z.string().array().optional(),
  cityId: z.string().optional(),
  stateId: z.string().optional(),
  agencyId: z.string().optional(),
  tierIds: z.string().array().optional(),
  instagram: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  website: z.string().trim().optional(),
  subPersonalityTraitIds: z.string().array().optional(),
  strategyOverview: z.string().trim().optional(),
  taglineIds: z.string().array().optional(),
  activeCampaignIds: z.string().array().optional(),
  primaryMarketIds: z.string().array().optional(),
  secondaryMarketIds: z.string().array().optional(),
  tertiaryIds: z.string().array().optional(),
  nccsIds: z.string().array().optional(),
  primaryMarketingPlatformIds: z.string().array().optional(),
  secondaryMarketingPlatformIds: z.string().array().optional(),
  ageIds: z.string().array().optional(),
  genderIds: z.string().array().optional(),
  contactPerson: z
    .object({
      contactName: z.string(),
      contactDesignation: z.string().trim().optional(),
      contactEmail: z.string().trim().optional(),
      contactNumber: z.string().trim().optional(),
      contactLinkedin: z.string().trim().optional(),
    })
    .array()
    .optional(),
  endorsements: z
    .object({
      name: z.string(),
      active: z.boolean(),
    })
    .array()
    .optional(),
});

export const editBrandSchema = createBrandSchema.partial().extend({
  name: z.string(),
  userId: z.string(),
  contactPerson: z
    .object({
      contactId: z.string().optional(),
      contactName: z.string(),
      contactDesignation: z.string().trim().optional(),
      contactEmail: z.string().trim().optional(),
      contactNumber: z.string().trim().optional(),
      contactLinkedin: z.string().trim().optional(),
    })
    .array()
    .optional(),
  endorsements: z
    .object({
      name: z.string(),
      active: z.boolean(),
    })
    .array()
    .optional(),
});

export const filteredBrandSchema = z.object({
  ids: z.string().array().optional(),
  parentOrgIds: z.string().array().optional(),
  subCategoryIds: z.string().array().optional(),
  maincategoryIds: z.string().array().optional(),
  cityIds: z.string().array().optional(),
  stateIds: z.string().array().optional(),
  agencyIds: z.string().array().optional(),
  tierIds: z.string().array().optional(),
  instagram: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  website: z.string().trim().optional(),
  subPersonalityTraitIds: z.string().array().optional(),
  mainpersonalityIds: z.string().array().optional(),
  strategyOverview: z.string().trim().optional(),
  taglineIds: z.string().array().optional(),
  activeCampaignIds: z.string().array().optional(),
  primaryMarketIds: z.string().array().optional(),
  secondaryMarketIds: z.string().array().optional(),
  tertiaryIds: z.string().array().optional(),
  nccsIds: z.string().array().optional(),
  primaryMarketingPlatformIds: z.string().array().optional(),
  secondaryMarketingPlatformIds: z.string().array().optional(),
  ageIds: z.string().array().optional(),
  genderIds: z.string().array().optional(),
  endorsement: z
    .object({
      name: z.string().optional(),
      isActive: z.boolean().optional(),
    })
    .optional(),
  contactName: z.string().trim().optional(),
  contactDesignation: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  contactNumber: z.string().trim().optional(),
  contactLinkedin: z.string().trim().optional(),
  isMandatory: z.boolean({ message: "isMandatory is required" }),
});

export type TCreateBrandSchema = z.infer<typeof createBrandSchema>;
export type TEditBrandSchema = z.infer<typeof editBrandSchema>;
export type TFilteredBrandSchema = z.infer<typeof filteredBrandSchema>;
