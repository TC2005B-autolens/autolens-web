import { useForm } from "react-hook-form"
import { BaseTest, NewAssignmentFormSchema, Test, processAssignmentForm } from "@/lib/assignment"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus as PlusIcon } from "lucide-react"
import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type AssignmentTests = z.infer<typeof NewAssignmentFormSchema.shape.tests>
type Test = z.infer<typeof Test>

function TestEditor({ onChange, value }: { onChange: (value: AssignmentTests) => void, value?: AssignmentTests }) {
  const [popover, setPopover] = useState(false);
  
  const tests = value ?? [];

  const createEmptyTest = (type: "function" | "io" | "unit") => (() => {
    onChange([...tests, {
      ...Test.parse({ type }),
      id: `${type}-${tests.length}`,
    }])
    setPopover(false)
  })

  const TestCard = ({ id }: { id: number }) => {
    if (!value) return null;

    const [test, setTest] = useState(value[id]);
    const [dirty, setDirty] = useState(false);
    const updateTest = (newTest: Test) => {
      setTest(newTest);
      setDirty(true);
    }

    return <>
      <div className="bg-muted w-full h-8 px-2 flex items-center">
        <input
          type="text"
          className="text-sm font-mono bg-inherit focus:outline-accent-foreground focus:outline-1 focus:outline rounded-sm"
          value={test.id}
          onChange={e => updateTest({...test, id: e.target.value})}
        />
        <span className="text-xs uppercase ml-2 bg-muted-foreground text-white rounded-sm px-1.5 py-0.5">{value[id].type}</span>
      </div>
      <div>
      </div>
    </>
  }

  return <div className="w-96 border">
    {
      tests.map((_, index) => <TestCard key={index} id={index}/>)
    }
    <div className="h-14 bg-muted flex">
      <Popover open={popover} onOpenChange={setPopover}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="m-auto" size="icon"><PlusIcon className="w-4 h-4"/></Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex w-full flex-col gap-2">
            <Button variant="secondary" className="block" onClick={createEmptyTest("io")}>IO Test</Button>
            <Button variant="secondary" className="block" onClick={createEmptyTest("function")}>Function Test</Button>
            <Button variant="secondary" className="block" onClick={createEmptyTest("unit")}>Unit Test</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </div>
}

function CreateAssignmentScreen() {
  const form = useForm<z.infer<typeof NewAssignmentFormSchema>>({
    resolver: zodResolver(NewAssignmentFormSchema)
  });

  return <div className="px-12 py-8">
    <h1 className="text-4xl font-extrabold mb-8">Create Assignment</h1>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(processAssignmentForm)}>
        <Tabs defaultValue="assignment">
          <TabsList>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>
          <TabsContent value="assignment">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="w-48 focus:ring-0">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language..."/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Assignment Title" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className="w-64 pl-3 text-left font-normal">
                          {
                            field.value ? format(field.value, "PPP") : <span>Pick a date...</span>
                          }
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>The submission deadline will be at 11:59 PM UTC on the selected date.</FormDescription>
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="files"> HELLO WORLD</TabsContent>
          <TabsContent value="tests">
            <FormField
              control={form.control}
              name="tests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TestEditor onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      
      </form>
    </Form>
  </div>;
}

export default CreateAssignmentScreen;
