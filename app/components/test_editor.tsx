import CodeEditor from "react-simple-code-editor"
import { Plus, Save, Trash } from "lucide-react"
import { useState } from "react"
import { z } from "zod"

// @ts-ignore
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-json"
import 'prismjs/themes/prism.css'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NewAssignmentFormSchema, Test } from "@/lib/assignment"

type AssignmentTests = z.infer<typeof NewAssignmentFormSchema.shape.tests>
type Test = z.infer<typeof Test>

function parseTestJSON(json: string):
  { valid: true, data: Test } | { valid: false, message: string } 
{
  try {
    const data = JSON.parse(json);
    const result = Test.safeParse(data);
    return result.success ? {
      valid: true,
      data: result.data
    } : {
      valid: false,
      message: result.error.errors[0].message
    }
  } catch (e) {
    return {
      valid: false,
      message: "Invalid JSON"
    }
  }
}

export function TestEditor({ onChange, value }: { onChange: (value: AssignmentTests) => void, value?: AssignmentTests }) {
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
      const [testJSON, setTestJSON] = useState(JSON.stringify(test, null, 2));
      const [dirty, setDirty] = useState(false);
      const parsedJSON = parseTestJSON(testJSON);

      // Esta función está aquí en caso que se tenga que actualizar el test
      // si fueramos a dejar de usar el editor de json y usar un formulario
      const updateTest = (newTest: Test) => {
        setTest(newTest);
        setDirty(true);
      }

      const saveJSON = () => {
        if (parsedJSON.valid) {
            onChange(value.map((v, index) => index === id ? parsedJSON.data : v));
            setDirty(false);
        }
      }

      return <div>
      <div className="bg-muted w-full h-8 px-2 flex items-center">
          <span className="text-sm font-mono bg-inherit focus:outline-accent-foreground focus:outline-1 focus:outline rounded-sm">
          {test.id}
          </span>
          <span className="text-xs uppercase ml-2 bg-muted-foreground text-white rounded-sm px-1.5 py-0.5">{value[id].type}</span>
          <Button 
          size="icon"
          className="ml-auto w-6 h-6"
          variant="destructive"
          onClick={() => {
              onChange(value.filter((_, index) => index !== id));
          }}
          >
          <Trash className="w-4 h-4"/>
          </Button>
      </div>
      <div className="relative">
          <CodeEditor 
          highlight={code => highlight(code, languages.json)}
          value={testJSON}
          onValueChange={val => {
              setTestJSON(val);
              setDirty(true);
          }}
          padding={10}
          className={cn("font-mono bg-background", !parsedJSON.valid ? "outline-red-500 outline outline-1" : "")}
          />
          {
            dirty && (
              <Button
                size="icon"
                type="button"
                className="absolute bottom-4 right-4 animate-popup"
                onClick={saveJSON}
                disabled={!parsedJSON.valid}
              >
                <Save className="h-4 w-4"/>
              </Button>
            )
          }
      </div>
      
      { !parsedJSON.valid && <div className="text-red-500 text-sm text-center py-2">{parsedJSON.message}</div> }
      </div>
  }

  return <div className="w-96 border h-full overflow-scroll bg-muted">
      {
        tests.map((_, index) => <TestCard key={index} id={index}/>)
      }
      <div className="h-14 flex">
      <Popover open={popover} onOpenChange={setPopover}>
          <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="m-auto">
            <Plus className="mr-2 w-4 h-4"/> New Test
          </Button>
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