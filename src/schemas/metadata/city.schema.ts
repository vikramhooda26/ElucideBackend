import z from "zod";

export const createCitySchema = z.object({
    userId: z.string(),
    cityName: z.string(),
});

export const editCitySchema = createCitySchema;

export type TCreateCitySchema = z.infer<typeof createCitySchema>;

export type TEditCitySchema = z.infer<typeof editCitySchema>;
