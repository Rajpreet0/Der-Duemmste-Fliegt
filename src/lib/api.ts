export async function getQuestions(category: string) {
    const res = await fetch("/api/v1/getQuestions", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({category})
    });

    if (!res.ok) throw new Error("Fehler beim Abrufen der Fragen!");

    return res.json();
}