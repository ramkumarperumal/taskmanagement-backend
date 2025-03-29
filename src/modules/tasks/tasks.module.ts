import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Notifications,
  NotificationsSchema,
  Tasks,
  TasksSchema,
} from 'src/models';
import { BullModule } from '@nestjs/bullmq';
import { NotificationConsumer } from './task-notify.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tasks.name, schema: TasksSchema },
      { name: Notifications.name, schema: NotificationsSchema },
    ]),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService, NotificationConsumer],
})
export class TasksModule {}
