import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  role: string[] = [];
}
