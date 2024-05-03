import { z } from "zod"
import { Plus, Pencil, LockKeyholeOpen, LockKeyhole, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import React from "react"
import CodeEditor from "react-simple-code-editor"

// @ts-ignore
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-python"
import 'prismjs/themes/prism.css'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NewAssignmentFormSchema } from "@/lib/assignment"

type AssignmentFiles = z.infer<typeof NewAssignmentFormSchema.shape.files>

interface File {
  path: string,
  content: string,
  write: boolean
}

interface FileCardProps {
  id?: number,
  file: File,
  setFile: (file: File) => void,
  onDelete: () => void,
  onClick: React.MouseEventHandler<HTMLDivElement>,
  className?: string
}

interface FilenameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnterKey: () => void,
  className?: string
}

const FilenameInput = React.forwardRef<HTMLInputElement, FilenameInputProps>(({ onEnterKey, className, ...props }, ref) => {
  return <input
    type="text"
    ref={ref}
    onKeyDown={e => {
      if (e.key === "Enter") {
        e.preventDefault();
        onEnterKey();
      }
    }}
    onBlur={_ => onEnterKey()}
    className={cn("h-6 text-sm w-28 focus:outline-accent font-mono", className)}
    {...props}
  />
});

function FileCard ({ id, file, setFile, onDelete, onClick, className }: FileCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [partialFile, setPartialFile] = useState<string | null>(null);

  useEffect(() => {
    if (partialFile === null) return;
    inputRef.current?.focus();
  }, [partialFile !== null]);

  return <div className={cn("bg-muted border-muted-foreground", className)} onClick={onClick}>
    <div className="flex flex-1 items-center mx-2 justify-between">
      {
        (partialFile !== null) ? (
          <FilenameInput
            className="h-6 w-28 font-mono my-2 text-sm"
            value={partialFile}
            onChange={e => setPartialFile(e.target.value)}
            onEnterKey={() => {
              if (partialFile === "") return;
              setFile({
                ...file,
                path: partialFile
              });
              setPartialFile(null);
            }}
            onBlur={() => setPartialFile(null)}
            ref={inputRef}
          />
        ) : (
          (file.path.length > 11) ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="h-6 text-sm w-28 font-mono my-2">{file.path.slice(0, 11)}...</span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="text-sm font-mono">{file.path}</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="h-6 text-sm w-28 font-mono my-2">{file.path}</span>
          )
        )
      }
      <div className="flex gap-2 shrink-0">
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          className="h-6 w-6"
          disabled={partialFile !== null}
          onClick={() => {
            setPartialFile(file.path);
          }}
        >
          <Pencil className="h-4 w-4"/>
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          className="h-6 w-6"
          disabled={partialFile !== null}
          onClick={() => {
            setFile({
              ...file,
              write: !file.write
            })
          }}
        >
          {
            file.write ? <LockKeyholeOpen className="h-4 w-4"/> : <LockKeyhole className="h-4 w-4"/>
          }
        </Button>
        <Button 
          type="button" 
          size="icon" 
          variant="destructive" 
          className="h-6 w-6"
          disabled={partialFile !== null}
          onClick={onDelete}
        >
          <Trash className="h-4 w-4"/>
        </Button>
      </div>
    </div>
  </div>
}

export function FileEditor({ onChange, value }: { onChange: (value: AssignmentFiles) => void, value?: AssignmentFiles }) {
  const [newFilename, setNewFilename] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [partialContent, setPartialContent] = useState<string>("");
  const newFilenameRef = useRef<HTMLInputElement>(null);

  const files = value ?? [];

  useEffect(() => {
    if (newFilename === null) return;
    newFilenameRef.current?.focus();
  }, [newFilename !== null])

  const saveCurrentFile = () => {
    return (selectedFile !== null)
      ? files.map((file, i) => i === selectedFile ? { ...file, content: btoa(partialContent ?? "") } : file)
      : files;
  }

  return <div className="h-full border border-zinc-300 flex">
    <div className="w-56 bg-muted overflow-scroll h-full">
      <TooltipProvider>
        {
          files.map((file, index) => (
            <FileCard
              key={index}
              id={index}
              file={file}
              setFile={newFile => {
                onChange(files.map((file, i) => i === index ? newFile : file))
              }}
              onDelete={() => {
                if (selectedFile === index) {
                  setSelectedFile(null);
                  setPartialContent("");
                }
                onChange(files.filter((_, i) => i !== index));
              }}
              onClick={e => {
                if (!(e.target instanceof SVGElement) && !(e.target instanceof HTMLButtonElement)) {
                  onChange(saveCurrentFile());
                  setSelectedFile(index);
                  setPartialContent(atob(files[index].content));
                }
              }}
              className={cn(
                "border-b hover:bg-zinc-200 transition-colors duration-2",
                selectedFile === index ? "bg-slate-200 hover:bg-slate-300" : "hover:bg-zinc-300"
              )}
            />
          ))
        }
      </TooltipProvider>
      <div className="h-14 bg-muted flex">
        { (newFilename !== null) ? (
          <FilenameInput
            value={newFilename}
            onChange={e => setNewFilename(e.target.value)}
            onEnterKey={() => {
              if (newFilename === "") return;
              setNewFilename(null);
              setSelectedFile(files.length);
              setPartialContent("");
              onChange([...(saveCurrentFile()), { path: newFilename, content: "", write: true }]);
            }}
            onBlur={() => setNewFilename(null)}
            ref={newFilenameRef}
            className="m-auto"
          />
        ) : (
          <Button
            type="button"
            variant="outline"
            className="m-auto w-8 h-8"
            size="icon"
            onClick={() => setNewFilename("")}
          >
            <Plus className="w-4 h-4"/>
          </Button>
        ) }
      </div>
    
    </div>
    <div className="flex-1">
      { 
        selectedFile !== null ? (
          <CodeEditor
          value={partialContent}
          onValueChange={setPartialContent}
          padding={10}
          highlight={code => 
            highlight(code, languages.python)
              .split('\n')
              .map((line: any, index: number) => 
                `<span class="rsce-line-number">${index + 1}</span>${line}`
              ).join('\n')
          }
          className="font-mono bg-background w-full h-full [counter-reset:line]"
          textareaClassName="!pl-16"
          preClassName="!pl-16"
        />
        ) : (
          <div className="h-full flex items-center justify-center text-lg text-muted-foreground">Select a file to edit...</div>
        )
      }
    </div>
  </div>
}