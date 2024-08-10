import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './members.controller';
import { MemberService } from './members.service';
import { Member } from '../domain/models/member.entity';
import { NotFoundException } from '@nestjs/common';

describe('MemberController', () => {
  let controller: MemberController;
  let service: MemberService;

  const mockMemberService = {
    addMember: jest.fn(),
    findMemberByCode: jest.fn(),
    getAllMemberList: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: mockMemberService,
        },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addMember', () => {
    it('should add a new member', async () => {
      const createMemberDto = { name: 'New Member' };
      const result = { code: 'M002', name: 'New Member' };
      mockMemberService.addMember.mockResolvedValue(result);

      expect(await controller.addMember(createMemberDto)).toEqual(result);
    });
  });

  describe('getMemberByCode', () => {
    it('should return a member by code', async () => {
      const code = 'M001';
      const result = { code, name: 'Test Member' };
      mockMemberService.findMemberByCode.mockResolvedValue(result);

      expect(await controller.getMemberByCode(code)).toEqual(result);
    });

    it('should throw NotFoundException if member not found', async () => {
      const code = 'M999';
      mockMemberService.findMemberByCode.mockResolvedValue(null);

      await expect(controller.getMemberByCode(code)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMemberList', () => {
    it('should return a list of members', async () => {
      const result = [
        { code: 'M001', name: 'Test Member' },
        { code: 'M002', name: 'Another Member' },
      ];
      mockMemberService.getAllMemberList.mockResolvedValue(result);

      expect(await controller.getMemberList()).toEqual(result);
    });
  });
});
