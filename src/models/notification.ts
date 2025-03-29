import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Tasks } from './tasks';
import { Users } from './users';

export type NotificationDocument = HydratedDocument<Notifications>;

@Schema({ timestamps: true })
export class Notifications {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tasks' })
  task_id: Tasks;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users' })
  notify_to: Users;

  @Prop()
  notification_content: String;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users' })
  updated_by: Users;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
