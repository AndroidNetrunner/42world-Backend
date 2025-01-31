import { UserModule } from '@user/user.module';
import { UserService } from '@user/user.service';
import { Module } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { FtAuthController } from './ft-auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FtAuth } from './entities/ft-auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FtAuth]), UserModule],
  controllers: [FtAuthController],
  providers: [FtAuthService],
})
export class FtAuthModule {}
