import { Test, TestingModule } from '@nestjs/testing';
import { PenaltiesService } from './penalties.service';
import { Penalty } from '../domain/models/penalty.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

describe('PenaltiesService', () => {
  let service: PenaltiesService;
  let penaltyModel: typeof Penalty;

  beforeEach(async () => {
    penaltyModel = {
      findAll: jest.fn(),
      create: jest.fn(),
    } as unknown as typeof Penalty;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PenaltiesService,
        {
          provide: 'PENALTIES_REPOSITORY',
          useValue: penaltyModel,
        },
      ],
    }).compile();

    service = module.get<PenaltiesService>(PenaltiesService);
  });

  describe('checkPenalty', () => {
    it('should return true if there are active penalties', async () => {
      const memberCode = 'member123';
      const mockPenalties = [{}];
      jest.spyOn(penaltyModel, 'findAll').mockResolvedValue(mockPenalties as any);

      const result = await service.checkPenalty(memberCode);

      expect(penaltyModel.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          member_code: memberCode,
          penalty_end_date: expect.any(Object),
        }),
      }));
      expect(result).toBe(true);
    });

    it('should return false if there are no active penalties', async () => {
      const memberCode = 'member123';
      jest.spyOn(penaltyModel, 'findAll').mockResolvedValue([]);

      const result = await service.checkPenalty(memberCode);

      expect(penaltyModel.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          member_code: memberCode,
          penalty_end_date: expect.any(Object),
        }),
      }));
      expect(result).toBe(false);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const memberCode = 'member123';
      jest.spyOn(penaltyModel, 'findAll').mockRejectedValue(new Error('Database error'));

      await expect(service.checkPenalty(memberCode)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('createPenalty', () => {
    it('should create a penalty and return it', async () => {
      const memberCode = 'member123';
      const mockPenalty = {
        code: uuidv4(),
        member_code: memberCode,
        penalty_start_date: new Date(),
        penalty_end_date: new Date(new Date().setDate(new Date().getDate() + 7)),
      };
      jest.spyOn(penaltyModel, 'create').mockResolvedValue(mockPenalty as any);

      const result = await service.createPenalty(memberCode);

      expect(penaltyModel.create).toHaveBeenCalledWith(expect.objectContaining({
        code: expect.any(String),
        member_code: memberCode,
        penalty_start_date: expect.any(Date),
        penalty_end_date: expect.any(Date),
      }));
      expect(result).toEqual(mockPenalty);
    });

    it('should throw an InternalServerErrorException if an error occurs', async () => {
      const memberCode = 'member123';
      jest.spyOn(penaltyModel, 'create').mockRejectedValue(new Error('Database error'));

      await expect(service.createPenalty(memberCode)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
