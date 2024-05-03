import { z } from "zod"

export const BaseTest = z.object({
    id: z.string().default(""),
    type: z.string().default(""),
    title: z.string().default("")
})

export const Test = z.discriminatedUnion('type', [
    BaseTest.extend({
        type: z.literal('io'),
        in: z.array(z.string()).default([]),
        out: z.string().default('')
    }).strict(),
    BaseTest.extend({
        type: z.literal('function'),
        file: z.string().default(''),
        function: z.string().default(''),
        params: z.array(z.string()).default([]),
        out: z.string().default(''),
    }).strict(),
    BaseTest.extend({
        type: z.literal('unit'),
        contents: z.string().default('')
    }).strict()
]);


export const NewAssignmentFormSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    dueDate: z.string().datetime(),
    files: z.array(z.object({
        path: z.string().min(1),
        content: z.string(),
        write: z.boolean()
    })).min(1),
    language: z.enum(['python']),
    tests: z.array(Test)
}).strict();

export function processAssignmentForm(data: z.infer<typeof NewAssignmentFormSchema>) {
    console.log(data);
}
