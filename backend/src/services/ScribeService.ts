import config from '../lib/config.js';
import { Anthropic } from '@anthropic-ai/sdk';

export class ScribeService {
  private anthropic: Anthropic | null;

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    } else {
      this.anthropic = null;
    }
  }

  async translate(transcript: string, dialect: string): Promise<string> {
    if (!this.anthropic) {
      // Mock response with clear label
      const mockTranslation = `[Mock translation to ${dialect} — no AI key configured yet]\n\n${transcript}`;
      return mockTranslation;
    }

    // Real Claude API call
    const instruction = `Rewrite this doctor–patient conversation in ${dialect}. Use natural, regional, plain and respectful language the patient can easily read or hear aloud. Keep the speaker labels. Preserve every medication name, dose, and timing exactly.\n\n${transcript}`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2048,
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
