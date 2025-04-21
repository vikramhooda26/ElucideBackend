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
  strategyOverview: z.string().optional(),
  sportId: z.string().optional(),
  agencyId: z.string().optional(),
  athleteAge: z.string().optional(),
  ageIds: z.string().array().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  website: z.string().optional(),
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
      contactDesignation: z.string().optional(),
      contactEmail: z.string().optional(),
      contactNumber: z.string().optional(),
      contactLinkedin: z.string().optional(),
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
      contactDesignation: z.string().optional(),
      contactEmail: z.string().optional(),
      contactNumber: z.string().optional(),
      contactLinkedin: z.string().optional(),
    })
    .array()
    .optional(),
});

export const filteredAthleteSchema = z.object({
  ids: z.string().array().optional(),
  associationLevelIds: z.string().array().optional(),
  costOfAssociation: z
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
  strategyOverview: z.string().optional(),
  sportIds: z.string().array().optional(),
  agencyIds: z.string().array().optional(),
  ageIds: z.string().array().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  youtube: z.string().optional(),
  website: z.string().optional(),
  subPersonalityTraitIds: z.string().array().optional(),
  genderIds: z.string().array().optional(),
  athleteGenderIds: z.string().array().optional(),
  nccsIds: z.string().array().optional(),
  primaryMarketIds: z.string().array().optional(),
  secondaryMarketIds: z.string().array().optional(),
  tertiaryIds: z.string().array().optional(),
  stateIds: z.string().array().optional(),
  nationalityIds: z.string().array().optional(),
  tierIds: z.string().array().optional(),
  athleteStatusIds: z.string().array().optional(),
  primarySocialMediaPlatformIds: z.string().array().optional(),
  secondarySocialMediaPlatformIds: z.string().array().optional(),
  athleteAge: z
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
  contactName: z.string().optional(),
  contactDesignation: z.string().optional(),
  contactEmail: z.string().optional(),
  contactNumber: z.string().optional(),
  contactLinkedin: z.string().optional(),
  isMandatory: z.boolean({ message: "isMandatory is required" }),
});

export type TCreateAthleteSchema = z.infer<typeof createAthleteSchema>;
export type TEditAthleteSchema = z.infer<typeof editAthleteSchema>;
export type TFilteredAthleteSchema = z.infer<typeof filteredAthleteSchema>;
