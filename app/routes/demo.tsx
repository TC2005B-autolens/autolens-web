import { Form } from "@/components/ui/form";
import { NewAssignmentFormSchema } from "@/lib/assignment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileEditor } from "@/components/file_editor";
import { Button } from "@/components/ui/button";

interface Assignment {
  id: number;
  title: string;
  description: string;
  pubDate: string;
  dueDate: string;
  groupCode: string;
  lensData: {
    id: string;
    files: z.infer<typeof NewAssignmentFormSchema.shape.files>;
    tests: z.infer<typeof NewAssignmentFormSchema.shape.tests>;
    language: string;
  }
};

type AssignmentFiles = z.infer<typeof NewAssignmentFormSchema.shape.files>;

const fetcher = (url: string) => fetch(url).then(res => res.json());

function getAssignmentFiles(assignmentId: number, assignments: Assignment[]): AssignmentFiles {
  return assignments.find(val => val.id === assignmentId)?.lensData.files || [];
}

function DemoScreen() {
  const assignmentSWR = useSWR<Assignment[]>(`/api/users/1/assignments`, fetcher);
  const [assignmentId, setAssignmentId] = useState<number | null>(null);
  const [files, setFiles] = useState<AssignmentFiles>([]);

  if (assignmentSWR.isLoading) return <div className="h-screen w-full px-12 py-8 relative">Loading...</div>;
  if (assignmentSWR.error) return <div className="h-screen w-full px-12 py-8 relative">Error: {assignmentSWR.error}</div>;


  return <div className="h-screen w-full px-12 py-8 relative">
    <h1 className="text-4xl font-extrabold mb-8">Autograder Demo</h1>
    {
      <div className="flex gap-4">
        <Select
          onValueChange={value => {
            const assignmentId = parseInt(value.split("-")[1]);
            setAssignmentId(assignmentId);
            setFiles(getAssignmentFiles(assignmentId, assignmentSWR.data || []))
          }}
          defaultValue={assignmentId !== null ? `assignment-${assignmentId}` : undefined}
          disabled={assignmentId !== null}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una tarea..." />
          </SelectTrigger>
          <SelectContent>
            {
              assignmentSWR.data?.map((assignment, i) => (
                <SelectItem key={i} value={`assignment-${assignment.id}`}>
                  {
                    `${assignment.groupCode} - ${assignment.title}`
                  }
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            console.log(files);
          }}
          disabled={assignmentId === null}
        >Turn In</Button>
      </div>
    }
    <div className="absolute top-[10rem] bottom-10 left-12 right-12">
      {
        assignmentId !== null && assignmentSWR.data !== undefined && (
          <div className="h-full flex">
            <div className="h-full flex-grow">
              <FileEditor
                onChange={setFiles}
                value={files}
              />
            </div>
            <div className="w-96 bg-muted h-full">
              <div className="h-full flex items-center justify-center text-lg text-muted-foreground">
                Test results will appear here
              </div>
            </div>
          </div>
        )
      }
    </div>
  </div>
}

export default DemoScreen;
