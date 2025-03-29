import { SetMetadata } from '@nestjs/common';
import { RoleConstant } from 'src/constants';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleConstant[]) =>
  SetMetadata(ROLES_KEY, roles);
