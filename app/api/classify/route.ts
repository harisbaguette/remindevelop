import { model } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const prompt = `
      Analyze the following URL or text: "${url}".
      
      Return a JSON object with the following fields:
      - title: A concise and descriptive title for the content.
      - summary: A brief 1-sentence summary of what this is about.
      - category: Choose the best fit from [Development, Design, Business, Marketing, Life, Other].
      
      Output ONLY the JSON object, no markdown formatting.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanText);

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Classification error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
