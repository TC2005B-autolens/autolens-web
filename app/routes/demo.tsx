import { Form } from "@/components/ui/form";
import { NewAssignmentFormSchema } from "@/lib/assignment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileEditor } from "@/components/file_editor";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

function getAssignment(assignmentId: number, assignments: Assignment[]): Assignment | undefined {
  return assignments.find(val => val.id === assignmentId);
}

function DemoScreen() {
  const assignmentSWR = useSWR<Assignment[]>(`/api/users/1/assignments`, fetcher);
  const [assignmentId, setAssignmentId] = useState<number | null>(null);
  const [files, setFiles] = useState<AssignmentFiles>([]);
  const [refresh, setRefresh] = useState(true);
  const [testResults, setTestResults] = useState<Record<string, any> | null>(null);
  const [refreshTask, setRefreshTask] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (testResults === null) return;
    if (refreshTask === null && refresh) {
      const intervalId = setInterval(() => {
        console.log(`Refreshing test results ${testResults.id}...`);
        fetch(`http://localhost:3000/api/v1/jobs/${testResults.id}`).then(res => res.json()).then(data => {
          setTestResults(data);
        });
      }, 3000);
      setRefreshTask(intervalId);
    }

    if (testResults.results !== undefined && refreshTask !== null) {
      clearInterval(refreshTask);
      setRefreshTask(null);
      setRefresh(false);
    }

    return () => {
      if (refreshTask !== null) {
        clearInterval(refreshTask);
        setRefreshTask(null);
      }
    }
  }, [refreshTask, testResults, assignmentId])

  if (assignmentSWR.isLoading) return <div className="h-screen w-full px-12 py-8 relative">Loading...</div>;
  if (assignmentSWR.error) return <div className="h-screen w-full px-12 py-8 relative">Error: {assignmentSWR.error}</div>;

  const noAssignments = assignmentId === null || !Array.isArray(assignmentSWR.data) || assignmentSWR.data.length === 0;

  return <div className="h-screen w-full px-12 py-8 relative">
    <h1 className="text-4xl font-extrabold mb-8">Autograder Demo</h1>
    {
      <div className="flex gap-4">
        <Select
          onValueChange={value => {
            const assignmentId = parseInt(value.split("-")[1]);
            setAssignmentId(assignmentId);
            setFiles(getAssignment(assignmentId, assignmentSWR.data || [])?.lensData.files || [])
          }}
          defaultValue={assignmentId !== null ? `assignment-${assignmentId}` : undefined}
          disabled={assignmentId !== null || assignmentSWR.data === undefined}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                (Array.isArray(assignmentSWR.data) && assignmentSWR.data.length > 0)
                  ? "Selecciona una tarea..."
                  : "No hay tareas que mostrar"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {
              (Array.isArray(assignmentSWR.data)) ? (assignmentSWR.data?.map((assignment, i) => (
                <SelectItem key={i} value={`assignment-${assignment.id}`}>
                  {
                    `${assignment.groupCode} - ${assignment.title}`
                  }
                </SelectItem>
              ))) : null
            }
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            fetch(`/api/assignments/${assignmentId}/submit`, {
              method: 'POST',
              body: JSON.stringify({
                files: files.map(file => ({
                  path: file.path,
                  content: file.content
                }))
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }).then(res => res.json()).then(data => {
              setTestResults(data.job);
            })
          }}
          disabled={noAssignments || (refreshTask !== null && refresh)}
        >
          {
            (refreshTask !== null && refresh) && (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            )
          }
          Turn In
        </Button>
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
              {
                testResults?.results === undefined ? (
                  <div className="h-full flex items-center justify-center text-lg text-muted-foreground">
                    Test results will appear here
                  </div>
                ) : (
                  <div className="h-full overflow-y-scroll overflow-x-clip break-words whitespace-pre-wrap font-mono text-sm">
                    {JSON.stringify(testResults?.results, null, 2)}
                  </div>
                )
              }
            </div>
          </div>
        )
      }
    </div>
  </div>
}

export default DemoScreen;
