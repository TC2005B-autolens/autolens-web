import { z } from "zod"

export const BaseTest = z.object({
    id: z.string(),
    type: z.string(),
    title: z.string()
})

const Test = z.discriminatedUnion('type', [
    BaseTest.extend({
        type: z.literal('io'),
        in: z.array(z.string()),
        out: z.string()
    }),
    BaseTest.extend({
        type: z.literal('function'),
        file: z.string(),
        function: z.string(),
        params: z.array(z.string()),
        out: z.string(),
    }),
    BaseTest.extend({
        type: z.literal('unit'),
        contents: z.string()
    })
]);


const NewAssignmentFormSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    dueDate: z.string().datetime(),
    files: z.array(z.object({
        path: z.string().min(1),
        content: z.string()
    })),
    language: z.enum(['python']),
    tests: z.array(Test)
});
