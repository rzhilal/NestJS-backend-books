import { Test, TestingModule } from '@nestjs/testing';
import { PenaltiesController } from './penalties.controller';
import { PenaltiesService } from './penalties.service';
import { Penalty } from '../domain/models/penalty.entity';

describe('PenaltiesController', () => {
  let controller: PenaltiesController;
  let service: PenaltiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PenaltiesController],
      providers: [
        {
          provide: PenaltiesService,
          useValue: {
            checkPenalty: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PenaltiesController>(PenaltiesController);
    service = module.get<PenaltiesService>(PenaltiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('checkPenalty', () => {
    it('should return an object with penalty true if the member is penalized', async () => {
      const memberCode = 'member123';
      jest.spyOn(service, 'checkPenalty').mockResolvedValue(true);

      const result = await controller.checkPenalty(memberCode);

      expect(service.checkPenalty).toHaveBeenCalledWith(memberCode);
      expect(result).toEqual({ penalty: true });
    });

    it('should return an object with penalty false if the member is not penalized', async () => {
      const memberCode = 'member123';
      jest.spyOn(service, 'checkPenalty').mockResolvedValue(false);

      const result = await controller.checkPenalty(memberCode);

      expect(service.checkPenalty).toHaveBeenCalledWith(memberCode);
      expect(result).toEqual({ penalty: false });
    });
  });
});
