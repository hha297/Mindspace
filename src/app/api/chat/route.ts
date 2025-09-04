import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
        try {
                const { message } = await request.json();

                if (!message) {
                        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
                }

                const systemPrompt = `You are a compassionate mental health support AI assistant designed specifically for students. Your role is to:

1. Provide empathetic and supportive responses
2. Offer practical coping strategies and techniques
3. Help users understand their emotions and thoughts
4. Guide users toward professional help when needed
5. Maintain a warm, non-judgmental tone
6. Focus on evidence-based mental health practices
7. Encourage self-care and healthy habits

Important guidelines:
- Always prioritize user safety and well-being
- If someone mentions self-harm or suicidal thoughts, immediately provide crisis resources
- Encourage professional help for serious mental health concerns
- Be supportive but don't replace professional therapy
- Use a gentle, understanding tone
- Provide practical, actionable advice when appropriate

Current user message: ${message}`;

                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                                Authorization: `Bearer ${OPENAI_API_KEY}`,
                                'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                                model: 'gpt-3.5-turbo',
                                messages: [
                                        {
                                                role: 'system',
                                                content: systemPrompt,
                                        },
                                        {
                                                role: 'user',
                                                content: message,
                                        },
                                ],
                                max_tokens: 500,
                                temperature: 0.7,
                        }),
                });

                if (!response.ok) {
                        const errorData = await response.json();
                        console.error('OpenAI API error:', errorData);
                        return NextResponse.json({ error: 'Failed to get response from AI' }, { status: 500 });
                }

                const data = await response.json();
                const aiResponse = data.choices[0]?.message?.content;

                if (!aiResponse) {
                        return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
                }

                return NextResponse.json({
                        response: aiResponse,
                });
        } catch (error) {
                console.error('Chat API error:', error);
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
}
