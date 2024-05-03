import { useForm } from "react-hook-form"
import { NewAssignmentFormSchema, processAssignmentForm } from "@/lib/assignment"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

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
import { TestEditor } from "@/components/test_editor"
import { FileEditor } from "@/components/file_editor"

function CreateAssignmentScreen() {
  const form = useForm<z.infer<typeof NewAssignmentFormSchema>>({
    resolver: zodResolver(NewAssignmentFormSchema),
    defaultValues: {
      language: "python",
    }
  });

  function sectionHasErrors(section: "assignment" | "filesntests" | "publish"): boolean {
    const errorMap: Record<string, string[]> = {
      assignment: ["title", "description", "dueDate", "language"],
      filesntests: ["files", "tests"],
      publish: []
    }
    return Object.keys(form.formState.errors).some((key) => errorMap[section].includes(key));
  }

  return <div className="h-screen w-full px-12 py-8 relative">
    <h1 className="text-4xl font-extrabold mb-8">Create Assignment</h1>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(processAssignmentForm)}>
        <Tabs defaultValue="assignment">
            <TabsList>
              <TabsTrigger
                value="assignment"
                className={sectionHasErrors("assignment") ? "!text-red-500" : ""}
              >
                Assignment
              </TabsTrigger>
              <TabsTrigger
                value="filesntests"
                className={sectionHasErrors("filesntests") ? "!text-red-500" : ""}
              >
                Files & Tests
              </TabsTrigger>
              <TabsTrigger
                value="publish"
                className={sectionHasErrors("publish") ? "!text-red-500" : ""}
              >
                Publish
              </TabsTrigger>
            </TabsList>
            <div className="absolute top-[10rem] bottom-10 left-12 right-12">
              <TabsContent value="assignment" className="mt-0 h-full w-96">
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
                            selected={new Date(field.value)}
                            onSelect={value => {
                              value?.setHours(23, 59, 59, 999);
                              field.onChange(value?.toISOString());
                            }}
                            disabled={(date: Date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>The submission deadline is always set to 23:59 on your current timezone.</FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="filesntests" className="mt-0 h-full">
                <div className="h-full flex">
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem className="h-full flex-grow">
                        <FormControl>
                          <FileEditor onChange={field.onChange} value={field.value}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tests"
                    render={({ field }) => (
                      <FormItem className="h-full">
                        <FormControl>
                          <TestEditor onChange={field.onChange} value={field.value} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="publish">
                <Button>Publish</Button>
                {
                  Object.keys(form.formState.errors).length > 0 && (
                    <div className="mt-4">
                      <FormMessage>
                        There are some errors in the form. Please fix them before submitting.
                      </FormMessage>
                    </div>
                  )
                }
              </TabsContent>
            </div>
        </Tabs>
      </form>
    </Form>
  </div>
}

export default CreateAssignmentScreen;
