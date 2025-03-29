import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  NotificationDocument,
  Notifications,
  TaskDocument,
  Tasks,
} from 'src/models';
import { Model, PaginateModel } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Tasks.name)
    private TaskDocumentModel: Model<TaskDocument>,
    @InjectModel(Tasks.name)
    private TaskDocumentModelPag: PaginateModel<TaskDocument>,
    @InjectModel(Notifications.name)
    private NotificationDocumentModel: Model<NotificationDocument>,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}
  async create(createUserPayload: CreateTaskDto): Promise<any> {
    const task = await this.TaskDocumentModel.create(createUserPayload);
    await this.taskNotify({
      task_id: task.id,
      notify_to: task.assignee,
      notification_content: `${task.task_name} is assigned to you`,
      updated_by: task.created_by,
    });
    return task;
  }

  async findAll(payload: {}, paginationPayload: {}) {
    const pagTask = await this.TaskDocumentModelPag.paginate(payload, {
      ...paginationPayload,
      populate: [{ path: 'assignee' }, { path: 'created_by' }],
    });
    const res = {
      data: pagTask['docs'],
      totalDocs: pagTask['totalDocs'],
      limit: pagTask['limit'],
      totalPages: pagTask['totalPages'],
      page: pagTask['page'],
    };
    return res;
  }

  async findOne(payload: {}) {
    const task = await this.TaskDocumentModel.findOne(payload).populate([
      { path: 'assignee' },
      { path: 'created_by' },
    ]);
    return task;
  }

  async update(payload: {}, updateTaskData: UpdateTaskDto) {
    const task = await this.TaskDocumentModel.findOneAndUpdate(
      payload,
      updateTaskData,
      { new: true },
    );
    return task;
  }

  async remove(payload: {}) {
    const task = await this.TaskDocumentModel.findOneAndDelete(payload);
    return task;
  }

  async createNotification(payload: any) {
    const notification = await this.NotificationDocumentModel.create(payload);
    return notification;
  }

  async taskNotify(payload) {
    const job = await this.notificationQueue.add('notification', payload);
    return job;
  }
}
