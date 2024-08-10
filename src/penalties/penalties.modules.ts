import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Penalty } from './domain/models/penalty.entity';
import { PenaltiesController } from './application/penalties.controller';
import { PenaltiesService } from './application/penalties.service';
import { penaltiesProviders } from './infrastructure/penalties.provider';

@Module({
  imports: [SequelizeModule.forFeature([Penalty])],
  controllers: [PenaltiesController],
  providers: [
    PenaltiesService,
    ...penaltiesProviders,
  ],
  exports: [PenaltiesService],
})
export class PenaltiesModule {}
