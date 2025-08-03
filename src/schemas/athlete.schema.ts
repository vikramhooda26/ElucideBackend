import z from "zod";
import { operationsTypeEnum } from "../lib/constants.js";

export const createAthleteSchema = z.object({
  name: z.string().min(1, "Required"),
  association: z
    .object({
      associationLevelId: z.string(),
      costOfAssociation: z.number().optional(),
    })
    .array()
    .optional(),
  userId: z.string().min(1, "Required"),
  strategyOverview: z.string().trim().optional(),
  sportId: z.string().optional(),
  agencyId: z.string().optional(),
  athleteAge: z.string().optional(),
  ageIds: z.string().array().optional(),
  facebook: z.string().trim().optional(),
  instagram: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  website: z.string().trim().optional(),
  subPersonalityTraitIds: z.string().array().optional(),
  genderIds: z.string().array().optional(),
  athleteGenderId: z.string().optional(),
  nccsIds: z.string().array().optional(),
  primaryMarketIds: z.string().array().optional(),
  tierIds: z.string().array().optional(),
  secondaryMarketIds: z.string().array().optional(),
  tertiaryIds: z.string().array().optional(),
  stateId: z.string().optional(),
  nationalityId: z.string().optional(),
  primarySocialMediaPlatformIds: z.string().array().optional(),
  secondarySocialMediaPlatformIds: z.string().array().optional(),
  statusId: z.string().optional(),
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
});

export const editAthleteSchema = createAthleteSchema.partial().extend({
  name: z.string().min(1, "Required"),
  association: z
    .object({
      associationLevelId: z.string(),
      costOfAssociation: z.number().optional(),
    })
    .array()
    .optional(),
  userId: z.string(),
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
});

export const filteredAthleteSchema = z.object({
  ids: z
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
          cost: z
            .number()
            .array()
            .max(2, "Cost array can have maximum of 2 elements i.e the min and max range")
            .optional(),
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
        )
        .refine(
          (data) => {
            if (data?.cost?.length === 2 && data.operationType !== "in") {
              return false;
            }
            return true;
          },
          {
            message: "operationType must be 'in' if cost array length is 2",
            path: ["operationType"],
          },
        ),
      isMandatory: z.boolean(),
    })
    .optional(),
  strategyOverview: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  sportIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  agencyIds: z
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
  facebook: z
    .object({
      value: z.string().trim().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  instagram: z
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
  linkedin: z
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
  subPersonalityTraitIds: z
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
  athleteGenderIds: z
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
  stateIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  nationalityIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  tierIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  athleteStatusIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  primarySocialMediaPlatformIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  secondarySocialMediaPlatformIds: z
    .object({
      value: z.string().array().optional(),
      isMandatory: z.boolean(),
    })
    .optional(),
  athleteAge: z
    .object({
      value: z
        .object({
          age: z.number().array().max(2, "Age array can have maximum of 2 elements").optional(),
          operationType: z
            .enum(operationsTypeEnum, { message: "operationType can only be either gte, lte, equals or in" })
            .optional(),
        })
        .optional()
        .refine(
          (data) => {
            if (data?.age && data?.operationType === undefined) {
              return false;
            }
            return true;
          },
          {
            message: "operationType is required when age is provided",
            path: ["operationType"],
          },
        )
        .refine(
          (data) => {
            if (data?.operationType && data?.age === undefined) {
              return false;
            }
            return true;
          },
          {
            message: "age is required when operationType is provided",
            path: ["age"],
          },
        )
        .refine(
          (data) => {
            if (data?.age?.length === 2 && data.operationType !== "in") {
              return false;
            }
            return true;
          },
          {
            message: "operationType must be 'in' if age array length is 2",
            path: ["operationType"],
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
});

export type TCreateAthleteSchema = z.infer<typeof createAthleteSchema>;
export type TEditAthleteSchema = z.infer<typeof editAthleteSchema>;
export type TFilteredAthleteSchema = z.infer<typeof filteredAthleteSchema>;
