import z from "zod";
import { operationsTypeEnum } from "../lib/constants.js";

export const filteredStakeholdersSchema = z.object({
  subPersonalityTraitIds: z.string().array().optional(),
  tierIds: z.string().array().optional(),
  sportIds: z.string().array().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  website: z.string().optional(),
  strategyOverview: z.string().optional(),
  ageIds: z.string().array().optional(),
  genderIds: z.string().array().optional(),
  primaryMarketIds: z.string().array().optional(),
  secondaryMarketIds: z.string().array().optional(),
  tertiaryIds: z.string().array().optional(),
  nccsIds: z.string().array().optional(),
  contactName: z.string().optional(),
  contactDesignation: z.string().optional(),
  contactEmail: z.string().optional(),
  contactNumber: z.string().optional(),
  contactLinkedin: z.string().optional(),
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
  isMandatory: z.boolean({ message: "isMandatory is required" }),
});

export type TFilteredStakeholdersSchema = z.infer<typeof filteredStakeholdersSchema>;
