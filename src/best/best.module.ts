import { Module } from '@nestjs/common';
import { BestService } from './best.service';
import { BestController } from './best.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BestRepository } from './repositories/best.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BestRepository])],
  controllers: [BestController],
  providers: [BestService],
})
export class BestModule {}
