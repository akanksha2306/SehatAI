import { Response } from 'express';
import { WorkflowService } from '../services/WorkflowService.js';
import type { AuthenticatedRequest } from './AuthController.js';
import type { GenerateWorkflowRequest, SaveWorkflowRequest } from '../schemas/workflow.js';

export class WorkflowController {
  constructor(private workflowService: WorkflowService) {}

  async generateWorkflow(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const data = req.body as GenerateWorkflowRequest;

    const output = await this.workflowService.generateWorkflow(
      data.task,
      data.description
    );

    res.status(200).json({
      output,
    });
  }

  async saveWorkflow(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const data = req.body as SaveWorkflowRequest;

    const workflow = await this.workflowService.saveWorkflow(
      userId,
      data.task,
      data.output,
      data.description
    );

    res.status(201).json(workflow);
  }

  async getWorkflows(
    req: AuthenticatedRequest,
    res: Response<unknown>
  ): Promise<void> {
    const userId = req.user?.userId;
    if (!userId) {
      throw new Error('User not found in request');
    }

    const workflows = await this.workflowService.getUserWorkflows(userId);

    res.status(200).json(workflows);
  }
}
