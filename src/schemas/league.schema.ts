import z from "zod";
import { operationsTypeEnum, partnerTypeEnum } from "../lib/constants.js";

export const createLeagueSchema = z.object({
    name: z.string().min(1, "Required"),
    sportId: z.string().optional(),
    ownerIds: z.string().array().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    tierIds: z.string().array().optional(),
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
    yearOfInception: z.string().optional(),
    formatId: z.string().optional(),
    broadCastPartnerId: z.string().optional(),
    ottPartnerId: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    strategyOverview: z.string().optional(),
    endorsements: z
        .object({
            name: z.string(),
            active: z.boolean(),
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
    association: z
        .object({
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
        })
        .array()
        .optional(),
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

export const editLeagueSchema = createLeagueSchema.partial().extend({
    name: z.string(),
    association: z
        .object({
            associationLevelId: z.string(),
            costOfAssociation: z.number().optional(),
        })
        .array()
        .optional(),
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
    endorsements: z
        .object({
            name: z.string(),
            active: z.boolean(),
        })
        .array()
        .optional(),
});

export const filteredLeagueSchema = z.object({
    ids: z.string().array().optional(),
    sportIds: z.string().array().optional(),
    ownerIds: z.string().array().optional(),
    subPersonalityTraitIds: z.string().array().optional(),
    tierIds: z.string().array().optional(),
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
    yearOfInception: z.string().optional(),
    formatIds: z.string().array().optional(),
    broadCastPartnerIds: z.string().array().optional(),
    ottPartnerIds: z.string().array().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    website: z.string().optional(),
    strategyOverview: z.string().optional(),
    endorsement: z
        .object({
            name: z.string().optional(),
            isActive: z.boolean().optional(),
        })
        .optional(),
    reachMetrics: z
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
    viewershipMetrics: z
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
    yearMetrics: z
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
    partnerIdMetrics: z
        .object({
            partnerIds: z
                .string()
                .array()
                .max(2, "PartnerIds array can have maximum of 2 elements i.e the min and max range")
                .optional(),
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
    associationLevelIds: z.string().array().optional(),
    costOfAssociation: z
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
        ),
    contactName: z.string().optional(),
    contactDesignation: z.string().optional(),
    contactEmail: z.string().optional(),
    contactNumber: z.string().optional(),
    contactLinkedin: z.string().optional(),
    isMandatory: z.boolean({ message: "isMandatory is required" }),
});

export type TCreateLeagueSchema = z.infer<typeof createLeagueSchema>;
export type TEditLeagueSchema = z.infer<typeof editLeagueSchema>;
export type TFilteredLeagueSchema = z.infer<typeof filteredLeagueSchema>;
