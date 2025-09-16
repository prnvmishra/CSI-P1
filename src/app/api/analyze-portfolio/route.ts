import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google's Generative AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Default fallback response
    const getFallbackResponse = (url: string) => {
      // Simple domain-based detection as fallback
      const urlLower = url.toLowerCase();
      if (urlLower.includes('dribbble') || urlLower.includes('behance') || urlLower.includes('design')) {
        return {
          jobRole: 'Graphic Designer',
          confidence: 'Medium',
          reasoning: 'Portfolio domain suggests design focus',
        };
      } else if (urlLower.includes('github') || urlLower.includes('dev') || urlLower.includes('code')) {
        return {
          jobRole: 'Web Developer',
          confidence: 'Medium',
          reasoning: 'Portfolio domain suggests development focus',
        };
      } else if (urlLower.includes('linkedin') || urlLower.includes('cv') || urlLower.includes('resume')) {
        return {
          jobRole: 'Professional',
          confidence: 'Low',
          reasoning: 'Generic professional profile detected',
        };
      }
      return {
        jobRole: 'Web Developer',
        confidence: 'Low',
        reasoning: 'Could not determine profession from URL',
      };
    };

    let analysis;
    
    try {
      if (!genAI) {
        console.log('Using fallback analysis (no API key)');
        analysis = getFallbackResponse(url);
      } else {
        console.log('Analyzing portfolio with Gemini API...');
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        
        const prompt = `Analyze the following portfolio website and determine the most likely profession of the owner. 
        URL: ${url}
        
        Respond with a JSON object containing:
        {
          "jobRole": "The most likely profession (e.g., 'Graphic Designer', 'Data Analyst', 'Web Developer', 'UX/UI Designer')",
          "confidence": "High/Medium/Low confidence in the analysis",
          "reasoning": "Brief explanation for the determination"
        }`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Parse the response (assuming it's in the requested JSON format)
        try {
          // Try to extract JSON from markdown code block if present
          const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
          analysis = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(text);
          console.log('Analysis successful:', analysis);
        } catch (e) {
          console.error('Error parsing AI response:', e, '\nResponse text:', text);
          analysis = getFallbackResponse(url);
        }
      }
    } catch (error) {
      console.error('Error in portfolio analysis:', error);
      analysis = getFallbackResponse(url);
    }

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error analyzing portfolio:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze portfolio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
