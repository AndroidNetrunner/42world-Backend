import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GetUser } from '@root/auth/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getOne(@GetUser() user: User): User {
    return user;
  }

  @Get(':id')
  getOneById(@Param('id') id: number): Promise<User> {
    return this.userService.getOne(id);
  }

  @Put()
  update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(user, updateUserDto);
  }

  @Delete()
  remove(@GetUser('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
