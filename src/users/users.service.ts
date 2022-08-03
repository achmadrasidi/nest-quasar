import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-users.dto';
import * as argon2 from 'argon2';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private repository: UserRepository,
  ) {}

  async getById(id: string): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async get(): Promise<User[]> {
    const user = await this.repository.find();

    if (!user.length) {
      throw new NotFoundException(`User not found`);
    }
    return user;
  }

  async create(param: CreateUserDto): Promise<any> {
    param.email = param.email.toLowerCase();
    param.password = await this.hashPassword(param.password);
    const user = this.repository.create({ ...param });
    try {
      await this.repository.save(user);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        const msg = error.detail;
        throw new ConflictException(msg || 'Email/Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, param: UpdateUserDto): Promise<any> {
    //User
    const user = await this.getById(id);
    user.username = param.username;

    user.name = param.name;
    user.email = param.email.toLowerCase();
    user.role = param.role || [];

    if (param.password) {
      user.password = await this.hashPassword(param.password);
    } else {
      throw new BadRequestException('Password Cannot Be Null');
    }

    try {
      await this.repository.save(user);

      delete user.password;
      return user;
    } catch (error) {
      if (error.code === '23505') {
        const msg = error.detail;
        throw new ConflictException(msg || 'Email/Username already exists');
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async delete(id: string): Promise<any> {
    const result = await this.repository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return { message: 'User Successfully deleted' };
  }

  async validateUserPassword(
    authCredentialsDTO: AuthCredentialsDto,
  ): Promise<User> {
    const { username, password } = authCredentialsDTO;
    const user = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.password') //select: false in entity
      .where('user.username = :username', { username })
      .getOne();

    if (!user) return null;

    let isPasswordMatch = false;

    try {
      isPasswordMatch = await argon2.verify(user.password, password);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }

    if (user && isPasswordMatch) {
      return user;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
