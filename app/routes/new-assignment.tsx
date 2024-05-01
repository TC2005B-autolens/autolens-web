import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function CreateAssignmentScreen() {
  return <div className="px-12 py-8">
    <h1 className="text-4xl font-extrabold mb-8">Create Assignment</h1>
    <Tabs defaultValue="files">
      <TabsList>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="tests">Tests</TabsTrigger>
        <TabsTrigger value="publish">Publish</TabsTrigger>
      </TabsList>
      <TabsContent value="files"> HELLO WORLD</TabsContent>
      <TabsContent value="tests"> HELLO WORLD</TabsContent>
      <TabsContent value="publish"> HELLO WORLDsfasfa </TabsContent>
    </Tabs>
  </div>;
}

export default CreateAssignmentScreen;
