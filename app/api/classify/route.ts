import { model } from '@/lib/gemini';
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        let pageContent = '';
        let metaTitle = '';
        let metaDescription = '';
        let ogImage = '';

        try {
            // Attempt to scrape the URL for better context
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const res = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                const html = await res.text();
                const $ = cheerio.load(html);

                metaTitle = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
                metaDescription = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
                ogImage = $('meta[property="og:image"]').attr('content') || '';

                // Handle relative URLs for image
                if (ogImage && !ogImage.startsWith('http')) {
                    try {
                        ogImage = new URL(ogImage, url).toString();
                    } catch (e) {
                        ogImage = '';
                    }
                }

                // Remove noise
                $('script, style, nav, footer, header, noscript, iframe').remove();
                pageContent = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 4000);
            }
        } catch (e) {
            console.warn('Scraping failed, falling back to URL-only analysis:', e);
        }

        const prompt = `
      Analyze the following content (URL: ${url}).
      
      ${pageContent ? `
      [Scraped Data]
      Title: ${metaTitle}
      Description: ${metaDescription}
      Image: ${ogImage || 'None'}
      Content Snippet: ${pageContent}
      ` : ''}
      
      Return a JSON object with the following fields:
      - title: A concise and descriptive title. Use the Scraped Title if available and good.
      - summary: A brief 1-sentence summary.
      - category: Choose the best fit from [Development, Design, Business, Marketing, Life, Memo, Other].
      - type: "link" if it looks like a URL, "text" otherwise.
      - image: The image URL provided in [Scraped Data]. If none, return null or empty string.
      
      Output ONLY the JSON object, no markdown formatting.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanText);

        return NextResponse.json(data);
    } catch (error: unknown) {
        console.error('Classification error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
