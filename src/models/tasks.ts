import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Users } from './users';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type TaskDocument = HydratedDocument<Tasks>;

@Schema({ timestamps: true })
export class Tasks {
  @Prop({ required: true })
  task_name: String;

  @Prop()
  description: String;

  @Prop()
  due_date: Date;

  @Prop({
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  })
  priority: String;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users' })
  assignee: Users;

  @Prop({
    type: String,
    enum: ['Todo', 'Inprogress', 'Completed', 'Rejected', 'Cancelled'],
    default: 'Todo',
  })
  status: String;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Users' })
  created_by: Users;
}

export const TasksSchema = SchemaFactory.createForClass(Tasks);

TasksSchema.plugin(mongoosePaginate);
