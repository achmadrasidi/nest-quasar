import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  UsePipes,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-users.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  get() {
    return this.userService.get();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @Post()
  register(@Body(new ValidationPipe()) param: CreateUserDto): Promise<User> {
    return this.userService.create(param);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  updateUser(
    @Param('id') id: string,
    @Body() param: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, param);
  }

  @Post('login')
  login(@Body(ValidationPipe) param: AuthCredentialsDto): Promise<any> {
    return this.authService.login(param);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.userService.delete(id);
  }
}
