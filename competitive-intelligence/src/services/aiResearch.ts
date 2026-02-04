// AI Research Service - Uses Claude API to generate competitive intelligence research

export interface ResearchResult {
  publicAnnouncements: string;
  patents: string;
  maActivities: string;
  annualReports: string;
  secFilings: string;
  industryChanges: string;
  socialMediaSentiment: string;
  technicalLevers: string[];
  ipWhitespace: string[];
  consumerTrends: string[];
}

export interface APISettings {
  provider: 'claude' | 'openai';
  apiKey: string;
}

// Save API settings to localStorage
export function saveAPISettings(settings: APISettings): void {
  localStorage.setItem('ci-api-settings', JSON.stringify(settings));
}

// Load API settings from localStorage
export function loadAPISettings(): APISettings | null {
  const saved = localStorage.getItem('ci-api-settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

// Clear API settings
export function clearAPISettings(): void {
  localStorage.removeItem('ci-api-settings');
}

const RESEARCH_PROMPT = `You are a competitive intelligence research analyst. Given an industry and research question, provide comprehensive research in the following areas.

IMPORTANT: Respond ONLY with valid JSON in exactly this format, no other text:

{
  "publicAnnouncements": "Summary of recent public announcements from major players in this space...",
  "patents": "Analysis of recent patent filings and trends...",
  "maActivities": "Summary of mergers, acquisitions, and partnerships...",
  "annualReports": "Key insights from annual reports and 10-K filings...",
  "secFilings": "Relevant SEC filing insights...",
  "industryChanges": "How the industry is evolving and changing...",
  "socialMediaSentiment": "Consumer sentiment from social media...",
  "technicalLevers": ["Technical lever 1", "Technical lever 2", "Technical lever 3"],
  "ipWhitespace": ["IP whitespace area 1", "IP whitespace area 2", "IP whitespace area 3"],
  "consumerTrends": ["Consumer trend 1", "Consumer trend 2", "Consumer trend 3"]
}

Research the following:
Industry: {industry}
Company/Focus: {company}
Research Question: {question}

Provide detailed, specific, and actionable intelligence. Base your analysis on your knowledge of this industry up to your training cutoff. Be specific with company names, technologies, and trends where possible.`;

export async function generateResearch(
  industry: string,
  company: string,
  question: string,
  settings: APISettings
): Promise<ResearchResult> {
  const prompt = RESEARCH_PROMPT
    .replace('{industry}', industry)
    .replace('{company}', company)
    .replace('{question}', question);

  if (settings.provider === 'claude') {
    return callClaudeAPI(prompt, settings.apiKey);
  } else {
    return callOpenAIAPI(prompt, settings.apiKey);
  }
}

async function callClaudeAPI(prompt: string, apiKey: string): Promise<ResearchResult> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (e) {
    console.error('Failed to parse response:', content);
    throw new Error('Failed to parse AI response as JSON');
  }
}

async function callOpenAIAPI(prompt: string, apiKey: string): Promise<ResearchResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (e) {
    console.error('Failed to parse response:', content);
    throw new Error('Failed to parse AI response as JSON');
  }
}
