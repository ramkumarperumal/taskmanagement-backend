import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  UseGuards,
  Put,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  DefaultMessage,
  ResponseStatus,
  responseStructure,
  RoleConstant,
} from 'src/constants';
import { Roles } from 'src/decorators/roles.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { isValidObjectId } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  async validateTaskById(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new HttpException(
        DefaultMessage.NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
    const task = await this.tasksService.findOne({ _id: id });
    if (!task) {
      throw new HttpException(
        DefaultMessage.NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
    return task;
  }

  async validateUserTask(task_id, req) {
    const { role, _id } = req['user'];
    if (role === RoleConstant.User) {
      const where = {
        _id: task_id,
        $or: [{ created_by: _id }, { assignee: _id }],
      };
      const task = await this.tasksService.findOne(where);
      if (!task) {
        throw new UnauthorizedException();
      }
    }
  }

  async nameValidation(task_name: String) {
    const task = await this.tasksService.findOne({ task_name });

    if (task) {
      throw new HttpException(
        DefaultMessage.TASK_NAME_ALREADY_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @Roles(RoleConstant.Admin, RoleConstant.User)
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() payload: CreateTaskDto) {
    try {
      const { task_name } = payload;
      await this.nameValidation(task_name);
      const res = await this.tasksService.create(payload);
      return responseStructure(res, 'Task Created Successfully');
      return res;
    } catch (error) {
      return responseStructure(null, error.message, 'failure');
    }
  }

  @Get()
  @Roles(RoleConstant.Admin, RoleConstant.User)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(@Req() req, @Query() query) {
    try {
      let payload = {};
      const { priority, status, ...paginationPayload } = query;
      const { role, _id } = req['user'];
      if (role === RoleConstant.User) {
        payload = { $or: [{ created_by: _id }, { assignee: _id }] };
      }
      if (priority) {
        payload = { ...payload, priority };
      }
      if (status) {
        payload = { ...payload, status };
      }
      const res = await this.tasksService.findAll(payload, paginationPayload);
      return responseStructure(res, '');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Get(':id')
  @Roles(RoleConstant.Admin, RoleConstant.User)
  @UseGuards(AuthGuard, RolesGuard)
  async findOne(@Req() req, @Param('id') id: string) {
    try {
      await this.validateTaskById(id);
      await this.validateUserTask(id, req);
      let where = { _id: id };
      const res = await this.tasksService.findOne(where);
      return responseStructure(res, '');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Put(':id')
  @Roles(RoleConstant.Admin, RoleConstant.User)
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() payload: UpdateTaskDto,
  ) {
    try {
      const task = await this.validateTaskById(id);
      const logged_id = req['user']['_id'];
      await this.validateUserTask(id, req);
      let where = { _id: id };
      if (task.status !== payload.status) {
        const notifyPayload = {
          task_id: id,
          notify_to:
            logged_id === String(task.assignee['_id'])
              ? task.created_by['_id']
              : task.assignee['_id'],
          notification_content: `${task.task_name} status is updated to ${payload.status}`,
          updated_by: logged_id,
        };
        await this.tasksService.taskNotify(notifyPayload);
      }
      const res = await this.tasksService.update(where, payload);
      return responseStructure(res, 'Task updated successfully');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Delete(':id')
  @Roles(RoleConstant.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Req() req, @Param('id') id: string) {
    try {
      await this.validateTaskById(id);
      await this.validateUserTask(id, req);
      let where = { _id: id };
      await this.tasksService.remove(where);
      return responseStructure(null, 'Task deleted successfully');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }
}
