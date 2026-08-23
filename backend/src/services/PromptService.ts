import config from '../lib/config.js';
import { Anthropic } from '@anthropic-ai/sdk';

export class PromptService {
  private anthropic: Anthropic | null;

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    } else {
      this.anthropic = null;
    }
  }

  async improvePrompt(rawPrompt: string): Promise<string> {
    if (!this.anthropic) {
      // Mock response: wrap in role/task/context/format/constraints template
      const mockImproved = `[Mock — no AI key configured yet]

# ROLE
You are an expert clinical documentation specialist.

# TASK
Generate a clear, structured clinical note based on the following rough input.

# CONTEXT
This input may be unstructured clinician notes, voice-to-text transcription, or fragmentary thoughts. Your job is to transform it into a well-organized, professional clinical record.

# FORMAT
- Use clear headings (Chief Complaint, History of Present Illness, Assessment, Plan)
- Organize findings logically
- Use standard medical abbreviations
- Maintain chronological narrative where appropriate

# CONSTRAINTS
- Preserve all specific details (medications, dosages, lab values, dates)
- Use professional but plain language
- Do not invent clinical information not in the original
- Flag any ambiguities or missing critical information
- Verify accuracy against source material before finalizing

---

Original rough input:
${rawPrompt}`;
      return mockImproved;
    }

    // Real Claude API call
    const instruction = `Rewrite this clinician's rough prompt into a strong, engineered prompt using role, task, context, format, and constraints (including a safety/verify guardrail). Return only the improved prompt.\n\nRough prompt: "${rawPrompt}"`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: instruction,
        },
      ],
    });

    // Extract text from the response
    const textContent = message.content.find(
      (block): block is { type: 'text'; text: string } => block.type === 'text'
    );
    if (!textContent) {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  }
}
