import { z } from "zod";

// avoiding magic numbers in the code
export const MAX_ROWS = 100;
export const MAX_COLUMNS = 100;
export const MAX_STEPS = 10000;

// schema for validating the board state, it represents each cell as 0 (dead) or 1 (alive)
export const cellSchema = z.number().int().min(0).max(1);

// schema for validating the board matrix
export const matrixSchema = z.array(z.array(cellSchema));

export const boardStateSchema = z.object({
    rows: z.number().int().positive(),
    columns: z.number().int().positive(),
    cells: matrixSchema
}).superRefine((val, ctx) => {
    const { rows, columns, cells } = val;

    if (rows > MAX_ROWS) { 
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: "number",
            inclusive: true,
            maximum: MAX_ROWS,
            message: `Number of rows exceeds maximum of ${MAX_ROWS}`,
            path: ["rows"],
            origin: "boardStateSchema"
        });
    }
    if (columns > MAX_COLUMNS) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            type: "number",
            inclusive: true,
            maximum: MAX_COLUMNS,
            message: `Number of columns exceeds maximum of ${MAX_COLUMNS}`,
            path: ["columns"],
            origin: "boardStateSchema"
        });
    }
    // check if cells match rows
    if (cells.length !== rows) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Number of rows does not match number of rows in cells matrix",
            path: ["cells"],
            origin: "boardStateSchema"
        });
    }
    // check if each row matches columns
    for (let r = 0; r < cells.length; r++) {
        const row = cells[r];
        if (row.length !== columns) {
            ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Number of columns in row ${r} does not match number of columns`,
            path: ["cells", r],
            origin: "boardStateSchema"
            });
        }
    }
});

export const advanceStepsSchema = z.object({
    steps: z
    .number()
    .int()
    .min(1, "steps must be at least 1")
    .max(1000, "steps must be at most 1000"),
});

export const finalStepsSchema = z.object({
    maxSteps: z
        .number()
        .int()
        .min(1, "maxSteps must be at least 1")
        .max(10000, "maxSteps must be at most 10000"),
});

export const boardIdSchema = z.string().min(1, "boardId is required");

export const stepsSchema = z.number().int().min(0, "steps must be a positive number");

export const maxStepsSchema = z.number().int().max(MAX_STEPS, `steps cannot exceed ${MAX_STEPS}`);

export type BoardStateInput = z.infer<typeof boardStateSchema>;
export type BoardId = z.infer<typeof boardIdSchema>;
export type Step = z.infer<typeof stepsSchema>;
export type MaxSteps = z.infer<typeof maxStepsSchema>;
export type AdvanceStepsInput = z.infer<typeof advanceStepsSchema>;
export type FinalStepsInput = z.infer<typeof finalStepsSchema>;