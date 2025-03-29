import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

enum RoleEnum {
  Admin = 'Admin',
  User = 'User',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  first_name: String;

  @IsNotEmpty()
  @IsString()
  last_name: String;

  @IsNotEmpty()
  @IsEmail()
  email: String;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: String;

  @IsNotEmpty()
  @IsString()
  phone_number: String;

  @IsNotEmpty()
  @IsString()
  address: String;

  @IsNotEmpty()
  @IsString()
  country: String;

  @IsNotEmpty()
  @IsString()
  state: String;

  @IsNotEmpty()
  @IsString()
  city: String;

  @IsNotEmpty()
  @IsNumber()
  zip_code: Number;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
