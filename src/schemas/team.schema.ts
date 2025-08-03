import z from "zod";
import { operationsTypeEnum, partnerTypeEnum } from "../lib/constants.js";

export const createTeamSchema = z.object({
  name: z.string().trim(),
  yearOfInception: z.string().optional(),
  sportId: z.string().optional(),
  leagueId: z.string().optional(),
  ownerIds: z.string().array().optional(),
  franchiseFee: z.number().optional(),
  cityId: z.string().optional(),
  stateId: z.string().optional(),
  subPersonalityTraitIds: z.string().array().optional(),
  instagram: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  website: z.string().trim().optional(),
  tierIds: z.string().array().optional(),
  strategyOverview: z.string().trim().optional(),
  taglineIds: z.string().array().optional(),
  activeCampaignIds: z.string().array().optional(),
  primaryMarketingPlatformIds: z.string().array().optional(),
  secondaryMarketingPlatformIds: z.string().array().optional(),
  ageIds: z.string().array().optional(),
  genderIds: z.string().array().optional(),
  primaryMarketIds: z.string().array().optional(),
  secondaryMarketIds: z.string().array().optional(),
  tertiaryIds: z.string().array().optional(),
  nccsIds: z.string().array().optional(),
  association: z
    .object({
      associationLevelId: z.string(),
      costOfAssociation: z.number().optional(),
      brandIds: z.string().array().optional(),
    })
    .array()
    .optional(),
  ottPartnerMetrics: z
    .object({
      id: z.string().optional(),
      reach: z.string().optional(),
      viewership: z.string().optional(),
      year: z.string(),
      ottPartnerId: z.string(),
    })
    .array()
    .optional(),
  broadcastPartnerMetrics: z
    .object({
      id: z.string().optional(),
      reach: z.string().optional(),
      viewership: z.string().optional(),
      year: z.string(),
      broadcastPartnerId: z.string(),
    })
    .array()
    .optional(),
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
      name: z.string().trim(),
      active: z.boolean(),
    })
    .array()
    .optional(),
});

export const editTeamSchema = createTeamSchema.partial().extend({
  name: z.string().trim(),
  association: z
    .object({
      associationId: z.string().optional(),
      associationLevelId: z.string(),
      costOfAssociation: z.number().optional(),
      brandIds: z.string().array().optional(),
    })
    .array()
    .optional(),
  contactPerson: z
    .object({
      contactId: z.string().optional(),
      contactName: z.string().trim(),
      contactDesignation: z.string().trim().optional(),
      contactEmail: z.string().trim().optional(),
      contactNumber: z.string().trim().optional(),
      contactLinkedin: z.string().trim().optional(),
    })
    .array()
    .optional(),
  endorsements: z
    .object({
      name: z.string().trim(),
      active: z.boolean(),
    })
    .array()
    .optional(),
});

export const filteredTeamSchema = z.object({
  ids: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  yearOfInception: z
    .object({
      value: z.string().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  sportIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  leagueIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  ownerIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  franchiseFee: z
    .object({
      value: z.number().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  cityIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  stateIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  subPersonalityTraitIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  instagram: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  facebook: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  linkedin: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  twitter: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  youtube: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  website: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  tierIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  strategyOverview: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  taglineIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  activeCampaignIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  primaryMarketingPlatformIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  secondaryMarketingPlatformIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  ageIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  genderIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  primaryMarketIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  secondaryMarketIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  tertiaryIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  nccsIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  associationLevelIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  costOfAssociation: z
    .object({
      value: z
        .object({
          cost: z.number().array().max(2, "Cost array can have maximum of 2 elements i.e the min and max range").optional(),
          operationType: z
            .enum(operationsTypeEnum, { message: "operationType can only be either gte, lte, equals or in" })
            .optional(),
        })
        .optional()
        .refine(
          (data) => {
            if (data?.cost && data?.operationType === undefined) {
              return false;
            }
            return true;
          },
          {
            message: "operationType is required when cost is provided",
            path: ["operationType"],
          },
        )
        .refine(
          (data) => {
            if (data?.operationType && data?.cost === undefined) {
              return false;
            }
            return true;
          },
          {
            message: "cost is required when operationType is provided",
            path: ["cost"],
          },
        ),
      isMandatory: z.boolean(),
    })
    .optional(),
  reachMetrics: z
    .object({
      value: z
        .object({
          reach: z
            .string()
            .array()
            .max(2, "Reach array can have maximum of 2 elements i.e the min and max range")
            .optional(),
          operationType: z
            .enum(operationsTypeEnum, { message: "operationType can only be either gte, lte, equals or in" })
            .optional(),
          partnerType: z
            .enum(partnerTypeEnum, { message: "partnerTypeEnum can only be either ott or broadcast" })
            .optional(),
        })
        .optional()
        .refine(
          (data) => {
            if (data?.reach && (data?.operationType === undefined || data?.partnerType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "operationType and partnerType are both required when reach is provided",
            path: ["operationType", "partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.operationType && (data?.reach === undefined || data.partnerType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "Reach and partnerType are both required when operationType is provided",
            path: ["reach", "partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.partnerType && (data?.reach === undefined || data.operationType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "Reach and operationType are both required when operationType is provided",
            path: ["reach", "operationType"],
          },
        ),
      isMandatory: z.boolean(),
    })
    .optional(),
  viewershipMetrics: z
    .object({
      value: z
        .object({
          viewership: z
            .string()
            .array()
            .max(2, "Viewership array can have maximum of 2 elements i.e the min and max range")
            .optional(),
          operationType: z
            .enum(operationsTypeEnum, { message: "operationType can only be either gte, lte, equals or in" })
            .optional(),
          partnerType: z
            .enum(partnerTypeEnum, { message: "partnerTypeEnum can only be either ott or broadcast" })
            .optional(),
        })
        .optional()
        .refine(
          (data) => {
            if (data?.viewership && (data?.operationType === undefined || data?.partnerType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "operationType and partnerType are both required when viewership is provided",
            path: ["operationType", "partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.operationType && (data?.viewership === undefined || data.partnerType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "Viewership and partnerType are both required when operationType is provided",
            path: ["viewership", "partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.partnerType && (data?.viewership === undefined || data.operationType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "Viewership and operationType are both required when operationType is provided",
            path: ["viewership", "operationType"],
          },
        ),
      isMandatory: z.boolean(),
    })
    .optional(),
  yearMetrics: z
    .object({
      value: z
        .object({
          year: z
            .string()
            .array()
            .max(2, "Year array can have maximum of 2 elements i.e the min and max range")
            .optional(),
          operationType: z
            .enum(operationsTypeEnum, { message: "operationType can only be either gte, lte, equals or in" })
            .optional(),
          partnerType: z
            .enum(partnerTypeEnum, { message: "partnerTypeEnum can only be either ott or broadcast" })
            .optional(),
        })
        .optional()
        .refine(
          (data) => {
            if (data?.year && (data?.operationType === undefined || data?.partnerType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "operationType and partnerType are both required when year is provided",
            path: ["operationType", "partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.operationType && (data?.year === undefined || data.partnerType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "Year and partnerType are both required when operationType is provided",
            path: ["year", "partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.partnerType && (data?.year === undefined || data.operationType === undefined)) {
              return false;
            }
            return true;
          },
          {
            message: "Year and operationType are both required when operationType is provided",
            path: ["year", "operationType"],
          },
        ),
      isMandatory: z.boolean(),
    })
    .optional(),
  partnerIdMetrics: z
    .object({
      value: z
        .object({
          partnerIds: z.string().array().optional(),
          partnerType: z
            .enum(partnerTypeEnum, { message: "partnerTypeEnum can only be either ott or broadcast" })
            .optional(),
        })
        .optional()
        .refine(
          (data) => {
            if (data?.partnerIds && data?.partnerType === undefined) {
              return false;
            }
            return true;
          },
          {
            message: "partnerType is required when partner id is provided",
            path: ["partnerType"],
          },
        )
        .refine(
          (data) => {
            if (data?.partnerType && data?.partnerIds === undefined) {
              return false;
            }
            return true;
          },
          {
            message: "Partner ID is required when operationType is provided",
            path: ["partnerIds"],
          },
        ),
      isMandatory: z.boolean(),
    })
    .optional(),
  contactName: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  contactDesignation: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  contactEmail: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  contactNumber: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  contactLinkedin: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  endorsement: z
    .object({
      value: z
        .object({
          name: z.string().optional(),
          isActive: z.boolean().optional(),
        })
        .optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
});

export type TCreateTeamSchema = z.infer<typeof createTeamSchema>;
export type TEditTeamSchema = z.infer<typeof editTeamSchema>;
export type TFilteredTeamSchema = z.infer<typeof filteredTeamSchema>;
