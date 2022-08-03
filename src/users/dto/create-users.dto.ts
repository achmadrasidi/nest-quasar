import { IsNotEmpty, IsEmail, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  role: string[] = [];
}
