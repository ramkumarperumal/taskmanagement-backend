import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  DefaultMessage,
  ResponseMessage,
  ResponseStatus,
  responseStructure,
  RoleConstant,
} from 'src/constants';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  async validateUserById(id: string) {
    const isValidId = isValidObjectId(id);
    if (!isValidId) {
      throw new HttpException(
        DefaultMessage.NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.findOne({ _id: id });
    if (!user) {
      throw new HttpException(
        DefaultMessage.NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
  }

  async emailValidation(email: String) {
    const user = await this.usersService.findOne({ email });

    if (user) {
      throw new HttpException(
        DefaultMessage.EMAIL_ALREADY_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      await this.emailValidation(email);
      const res = await this.usersService.create(createUserDto);
      delete res['password'];
      return responseStructure(res, 'User Created Successfully');
      return res;
    } catch (error) {
      return responseStructure(null, error.message, 'failure');
    }
  }

  @Get()
  @Roles(RoleConstant.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  async findAll() {
    try {
      const res = await this.usersService.findAll();
      return responseStructure(res, '');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Get('curr_user')
  @UseGuards(AuthGuard, RolesGuard)
  async findCurrUser(@Req() req) {
    try {
      return responseStructure(req['user'], '');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Get(':id')
  @Roles(RoleConstant.Admin)
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      await this.validateUserById(id);
      const where = { _id: id };
      const res = await this.usersService.findOne(where);
      return responseStructure(res, '');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Put(':id')
  @Roles(RoleConstant.Admin)
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    try {
      await this.validateUserById(id);
      const where = { _id: id };
      const res = await this.usersService.update(where, payload);
      return responseStructure(res, 'User updated successfully');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }

  @Delete(':id')
  @Roles(RoleConstant.Admin)
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.validateUserById(id);
      const where = { _id: id };
      await this.usersService.remove(where);
      return responseStructure(null, 'User deleted successfully');
    } catch (err) {
      return responseStructure(null, err.message, 'failure');
    }
  }
}
