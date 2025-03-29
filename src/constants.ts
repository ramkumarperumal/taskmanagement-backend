export enum ResponseStatus {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}

export enum ResponseMessage {
  SUCCESS = 'SUCCESS',
  CREATED = 'CREATED',
  BAD_REQUEST = 'BAD REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT FOUND',
}

export enum DefaultMessage {
  EMAIL_ALREADY_EXISTS = 'Email Already Exists',
  NOT_EXISTS = 'Not Exists',
  INVALID_USER = 'Invalid Email or Password',
  TASK_NAME_ALREADY_EXISTS = 'Task Name Already Exists',
}

export enum RoleConstant {
  User = 'User',
  Admin = 'Admin',
}

export const responseStructure = (
  data: {},
  message: string,
  type = 'success',
) => ({
  type,
  message,
  data,
});
