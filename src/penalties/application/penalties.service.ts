import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Penalty } from '../domain/models/penalty.entity';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PenaltiesService {
  constructor(
    @Inject('PENALTIES_REPOSITORY')
    private readonly penaltyModel: typeof Penalty,
  ) {}

  async checkPenalty(memberCode: string): Promise<boolean> {
    try {
      const dateNow = new Date();
      const memberPenalty = await this.penaltyModel.findAll({
        where: {
          member_code: memberCode,
          penalty_end_date: {[Op.gt]: dateNow},
        }
      });
      if(memberPenalty.length === 0) return false;
      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve check penalty',
      );
    }
  }

  async createPenalty(memberCode: string): Promise<Penalty> {
    try {
        const penalty = await this.penaltyModel.create({
            code: uuidv4(),
            member_code: memberCode,
            penalty_start_date: new Date(),
            penalty_end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        });
        return penalty;
    } catch (error) {
        console.error('Error creating penalty:', error);
        throw new InternalServerErrorException('Failed to add penalty');
    }
  }
}
