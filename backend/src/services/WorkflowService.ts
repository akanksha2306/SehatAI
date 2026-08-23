import config from '../lib/config.js';
import { Anthropic } from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

export interface SavedWorkflowData {
  id: string;
  userId: string;
  task: string;
  description: string | null;
  output: string;
  createdAt: Date;
}

export class WorkflowService {
  private anthropic: Anthropic | null;

  constructor(private prisma: PrismaClient) {
    if (config.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    } else {
      this.anthropic = null;
    }
  }

  async generateWorkflow(task: string, description?: string): Promise<string> {
    if (!this.anthropic) {
      // Mock response: three-section templated response
      const descriptionText = description || 'not specified';
      const mockWorkflow = `[Mock — no AI key configured yet]

## PLAYBOOK
1. Define scope and current process
2. Identify AI integration points
3. Create safety guardrails
4. Build prompt template
5. Test and iterate with sample cases
6. Train team on new workflow

## READY-TO-USE PROMPT
You are an AI assistant helping clinicians with: ${task}

Context: Clinicians currently ${descriptionText}

Generate a structured output with:
- [STEP_1]: First action item
- [STEP_2]: Second action item
- [VERIFICATION]: Safety checklist
- [NEXT_STEPS]: Follow-up actions

Remember to:
- Preserve clinical accuracy
- Flag any uncertainties
- Request human verification before finalizing

## VERIFY BEFORE YOU SIGN
- [ ] All clinical details are accurate
- [ ] Safety guardrails are in place
- [ ] Output meets regulatory requirements
- [ ] Team has reviewed the workflow
- [ ] Patient safety is prioritized`;
      return mockWorkflow;
    }

    // Real Claude API call
    const instruction = `A clinician repeats this task: "${task}". How they do it now: "${description || 'not specified'}". Build a reusable, safe AI-assisted workflow. Return three labelled sections: 1) PLAYBOOK — short numbered steps; 2) READY-TO-USE PROMPT — a copy-ready template with [bracketed] fields; 3) VERIFY BEFORE YOU SIGN — a brief checklist. Keep it concise for a busy clinician.`;

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

  async saveWorkflow(
    userId: string,
    task: string,
    output: string,
    description?: string
  ): Promise<SavedWorkflowData> {
    const workflow = await this.prisma.savedWorkflow.create({
      data: {
        userId,
        task,
        description: description || null,
        output,
      },
    });

    return workflow;
  }

  async getUserWorkflows(userId: string): Promise<SavedWorkflowData[]> {
    const workflows = await this.prisma.savedWorkflow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return workflows;
  }
}
