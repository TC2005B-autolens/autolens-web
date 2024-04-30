export async function commentsToCode(language, code) {
    const prompt = `
                    You are a Computer Science teacher who has recently completed grading your students' homework assignments. 
                    Your commitment is to ensure that your students learn effectively. 
                    Your task is to provide constructive feedback on the following homework assignment. 
                    Your comments should not only point out mistakes but also provide guidance on how students can improve and suggest best practices. 
                    Additionally, please include a brief statement identifying the main mistake(s) in the homework, if any.
                    You must write your comments in the code, but do not comment the lines that the student made, the code must still be functional.

                    Please provide your response in JSON format with the following structure:
                    {
                        "comments": "Here, you should provide your comments on the code.",
                        "mistake": "Here, you should specify the main mistake(s) observed in the homework."
                    }

                    Ensure that your response does not include any bad control or escape characters. 
                    You may only use the symbol # to add comments within your feedback.
                    `;


    const endpoint_ai = "https://api.openai.com/v1/chat/completions";
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer sk-proj-bNVXL7Z8l9STzRJDiSaYT3BlbkFJ6iMMwVowurzK51hMPpsq'
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
        const mistake = responseData.mistake;

        console.log("Comentarios:", comments);
        console.log("Error:", mistake);

        // Crear un archivo de Python con los comentarios
        createPythonFileWithComments(comments, 'com7.py');

        return [comments, mistake];
    } catch (error) {
        console.error(error);
        return { error: 'Error al generar los comentarios' };
    }
}

export async function createPythonFileWithComments(comments, fileName) {
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


