import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from 'src/models';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private UserDocumentModel: Model<UsersDocument>,
  ) {}
  async create(createUserPayload: CreateUserDto): Promise<any> {
    const { password } = createUserPayload;
    const hashedPassword = await bcrypt.hash(password, 10);
    createUserPayload['password'] = hashedPassword;
    const users = await this.UserDocumentModel.create(createUserPayload);
    return users;
  }

  async findAll() {
    const usersList = await this.UserDocumentModel.find({});
    return usersList;
  }

  async findUserWithPassword(payload: {}) {
    const user =
      await this.UserDocumentModel.findOne(payload).select('+password');
    return user;
  }

  async findOne(payload: {}) {
    const user = await this.UserDocumentModel.findOne(payload);
    return user;
  }

  async update(payload: {}, updateUserData: UpdateUserDto) {
    const user = await this.UserDocumentModel.findOneAndUpdate(
      payload,
      updateUserData,
      { new: true },
    );
    return user;
  }

  async remove(payload: {}) {
    const user = await this.UserDocumentModel.findOneAndDelete(payload);
    return user;
  }
}
