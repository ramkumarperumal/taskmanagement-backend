import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('notification')
export class NotificationConsumer extends WorkerHost {
  constructor(private readonly taskService: TasksService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      let progress = 0;
      await this.taskService.createNotification(job.data);
      progress += 1;
      await job.updateProgress(progress);
      return;
    } catch (err) {
      console.log(err);
    }
  }
}
