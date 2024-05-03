import React, { ChangeEvent, useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { commentsToCode } from "../lib/comments.ts"
import { Loader2 } from "lucide-react"
 
 
export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  )
}

function AIAnalyzerScreen(){
    const [fileContent, setFileContent] = useState<string>(''); // Estado para almacenar el contenido del archivo
    const [results, setResults] = useState<string[]>([]); // Estado para almacenar los resultados
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar la carga
    const [isFileSelected, setIsFileSelected] = useState<boolean>(false); // Estado para controlar si se ha seleccionado un archivo

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            setIsFileSelected(true); // Se ha seleccionado un archivo
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                setFileContent(content); // Almacenar el contenido del archivo en el estado
            };
            reader.readAsText(file);
        }
    };

    async function handleButtonClick() {
        setIsLoading(true); // Iniciar la carga
        try {
            const [comments, main_mistake, common_mistakes, recommendations] = await commentsToCode('Python', fileContent);
            // Almacenar los resultados en el estado
            setResults([comments, main_mistake, common_mistakes, recommendations]);
        } catch (error) {
            console.error('Error al generar comentarios:', error);
        }
        setIsLoading(false); // Finalizar la carga
    }

    return (
        <div className="flex flex-col mt-10 ml-10 space-y-5">
            <h1 className="text-4xl font-extrabold mb-4">AI Analyzer</h1>
            <h3>Sube un archivo y nuestra inteligencia artificial te dará una retroalimentación automática</h3>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Input id="picture" type='file' onChange={handleFileChange} />
            </div>
            <div>
                {isLoading ? <ButtonLoading /> : <Button onClick={handleButtonClick} disabled={!isFileSelected}>Enviar</Button>}
            </div>
            {/* Mostrar los resultados en un div */}
            <div className="mt-4">
                {results.length > 0 && (
                    <div className='w-3/4'>
                    <h2 className='font-bold'>Comentarios</h2>
                    <div> {results[0]} </div>
                    <h2 className='font-bold'>Errores principales</h2>
                    <div>{results[1]}</div>
                    <h2 className='font-bold'>Otros errores</h2>
                    <div>{results[2]}</div>
                    <h2 className='font-bold'>Recomendaciones</h2>
                    <div>{results[3]}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AIAnalyzerScreen;
