export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        console.error("Server Configuration Error: GROQ_API_KEY is not defined in environment variables.");
        return res.status(500).json({ error: 'Groq API Key is not configured on the server.' });
    }

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Invalid messages array provided.' });
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages,
                model: "llama-3.3-70b-versatile",
                temperature: 0.6,
                max_tokens: 250
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Groq API Response Error:", data);
            return res.status(response.status).json({ error: data.error?.message || 'Error from Groq API' });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.error("Vercel Serverless Function Proxy Error:", err);
        return res.status(500).json({ error: 'Failed to communicate with Groq AI engine.' });
    }
}
