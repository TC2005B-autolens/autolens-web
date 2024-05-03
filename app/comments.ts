import React from 'react';

export async function commentsToCode(language: string, code: string): Promise<[string, string, string, string]> {
    const prompt = `
        You are a Computer Science teacher who has recently completed grading your students' homework assignments. 
        Your commitment is to ensure that your students learn effectively. 
        Your task is to provide constructive feedback on the following homework assignment. 
        Your comments should not only point out mistakes but also provide guidance on how students can improve and suggest best practices. 
        Additionally, please include a brief statement identifying the main mistake(s) in the homework, if any.
        You must write your comments stating in which Line you are making the comment, for example 
        "Line 14: comment
        Line 21: comment".

        Also, write a little paragraph, around 4 or 6 lines, describing to a teacher what were the most common mistakes for a homework.
        And, write some recommendations for the teacher to apply with the group, around 2 or 3 lines.


        Please provide your response in JSON format with the following structure:
        {
            "comments": "Line 14: comment
                        Line 21: comment",
            "main_mistake": "Here, you should specify the main mistake(s) observed in the homework.",
            "common_mistakes" = "Describe the most common mistakes".,
            "recommendations" = "Write some recommendations to the teacher"
        }

        Ensure that your response does not include any bad control or escape characters. 
        The content must always be strings.

        In case of not receiving a code file, return the same JSON format but saying that you can not analize something if its not code.
    `;

    const endpoint_ai = "https://api.openai.com/v1/chat/completions";
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': import.meta.env.VITE_APIKEY || "",
        },
        body: JSON.stringify({
            model: 'gpt-4',
            temperature: 0.1,
            messages: [
                {
                    "role": "system",
                    "content": prompt
                },
                {
                    "role": "user",
                    "content": `Language: ${language}
                    Homework Code: ${code}`
                }
            ]
        })
    };

    try {
        const response = await fetch(endpoint_ai, options);
        if (!response.ok) {
            throw new Error('Error al generar los comentarios');
        }
        const data = await response.json();

        // Extraer la respuesta generada por la API
        const responseData = JSON.parse(data.choices[0].message.content);
        const comments = responseData.comments;
        const main_mistake = String(responseData.main_mistake);
        const common_mistakes = String(responseData.common_mistakes);
        const recommendations = String(responseData.recommendations);

        //console.log("Comentarios:", comments);
        //console.log("Error:", mistake);

        return [comments, main_mistake, common_mistakes, recommendations];
    } catch (error) {
        console.error(error);
        return [ 'Error al generar los comentarios', 'Error al generar los comentarios' , 'Error al generar los comentarios', 'Error al generar los comentarios'];
    }
}

export async function createPythonFileWithComments(comments: string, fileName: string): Promise<void> {
    // Crear un nuevo Blob con el contenido de los comentarios
    const blob = new Blob([comments], { type: 'text/plain' });

    // Crear una URL del Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un enlace
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);

    // Simular un clic en el enlace para iniciar la descarga
    document.body.appendChild(link);
    link.click();

    // Limpiar después de la descarga
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
