import { NewAssignmentFormSchema } from "@/lib/assignment"
import { z } from "zod"
import { Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

type AssignmentFiles = z.infer<typeof NewAssignmentFormSchema.shape.files>

export function FileEditor({ onChange, value }: { onChange: (value: AssignmentFiles) => void, value?: AssignmentFiles }) {
  const [namingFile, setNamingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [partialContent, setPartialContent] = useState<string | null>(null);

  const files = value ?? [];

  const FileCard = ({ id, partial }: { id?: number, partial?: boolean }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [partialFile, setPartialFile] = useState<string>("");

    useEffect(() => {
      if (partial && inputRef.current) {
        inputRef.current.focus();
      }
    }, [])

    if (partial && namingFile) {
      return <div className="h-14 bg-muted flex items-center px-4">
        <input
          type="text"
          ref={inputRef}
          value={partialFile}
          onChange={e => setPartialFile(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (partialFile === "") return;
              setPartialFile("");
              setNamingFile(false);
              onChange([...(files), { path: partialFile, content: "" }]);
            }
          }}
          onBlur={_ => {
            setPartialFile("");
            setNamingFile(false);
          }}
          className="h-6 text-sm w-28 focus:outline-accent font-mono"
        />
      </div>
    } else if (id !== undefined) {
      const file = files[id];
      return <div className="bg-muted border-muted-foreground border-b">
        <div className="flex items-center">
          <span className="h-6 text-sm w-28 font-mono my-2">{file.path}</span>
        </div>
      </div>
    }
    return null
  }

  return <div className="w-48 border">
    {
      files.map((_, index) => <FileCard key={index} id={index}/>)
    }
    <FileCard partial/>
    { !namingFile && (
      <div className="h-14 bg-muted flex">
        <Button
          type="button"
          variant="outline"
          className="m-auto w-8 h-8"
          size="icon"
          onClick={() => setNamingFile(true)}
        >
          <Plus className="w-4 h-4"/>
        </Button>
      </div>
    ) }
  </div>
}
