import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});


export async function POST(req: Request) {
    try {

        const body = await req.json();
        const category = body.category ?? "Allgemeinwissen";
        const difficulty = body.difficulty ?? "Medium";

        const completion = await client.chat.completions.create({
        model: "gpt-4",
        temperature: 1,
        tools: [
            {
            type: "function",
            function: {
                name: "return_trivia_questions",
                description: "Generiere eine Liste von Trivia-Fragen mit Antworten auf Deutsch",
                parameters: {
                type: "object",
                properties: {
                    questions: {
                    type: "array",
                    description: "Array von Trivia-Fragen mit Antworten",
                    items: {
                        type: "object",
                        properties: {
                        question: {
                            type: "string",
                            description: "Die Trivia-Frage"
                        },
                        answer: {
                            type: "string",
                            description: "Die korrekte Antwort zur Trivia-Frage"
                        }
                        },
                        required: ["question", "answer"]
                    }
                    }
                },
                required: ["questions"]
                }
            }
            }
        ],
        tool_choice: { type: "function", function: { name: "return_trivia_questions" } },
        messages: [
            {
            role: "system",
            content: "Du bist ein Trivia-Fragen-Generator, der strukturierte JSON-Daten mit Fragen und Antworten auf Deutsch liefert und nur Function Calling verwendet."
            },
            {
            role: "user",
            content: `Erstelle 25 verschiedene Trivia-Fragen mit korrekten Antworten auf Deutsch für ein Quizspiel in der Kategorie ${category} und Schwierigkeitsgrad ${difficulty}.`
            }
        ]
        });

        const responseMessage = completion.choices[0].message;

        if (responseMessage.tool_calls && responseMessage.tool_calls[0].function.arguments) {
            const parsed = JSON.parse(responseMessage.tool_calls[0].function.arguments);

            return NextResponse.json({ questions: parsed.questions });
        } else {
            return new NextResponse("Keine Fragen erhalten", { status: 500 });
        }

    } catch (error) {
        console.log(error);
        return new NextResponse("Failed to get information", {status: 500});
    }
}