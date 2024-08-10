import { Test, TestingModule } from '@nestjs/testing';
import { BorrowService } from '../../borrow/application/borrowed-book.service';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MemberService } from '../../members/application/members.service';
import { Member } from '../../members/domain/models/member.entity';

describe('MemberService', () => {
  let service: MemberService;

  const mockBorrowService = {
    countBorrowedBookMember: jest.fn().mockResolvedValue(0),
  };

  const mockMemberModel = {
    create: jest.fn().mockResolvedValue({
      code: 'M001',
      name: 'Test Member',
    }),
    findOne: jest.fn().mockResolvedValue({
      code: 'M001',
      name: 'Test Member',
    }),
    findAll: jest.fn().mockResolvedValue([
      { code: 'M001', name: 'Test Member', toJSON: jest.fn().mockReturnValue({ code: 'M001', name: 'Test Member' }) },
      { code: 'M002', name: 'Another Member', toJSON: jest.fn().mockReturnValue({ code: 'M002', name: 'Another Member' }) },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: 'MEMBER_REPOSITORY',
          useValue: mockMemberModel,
        },
        {
          provide: BorrowService,
          useValue: mockBorrowService,
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addMember', () => {
    it('should add a new member', async () => {
      const createMemberDto = { name: 'New Member' };
      mockMemberModel.create.mockResolvedValue({
        code: 'M002',
        name: createMemberDto.name,
      });

      const result = await service.addMember(createMemberDto);
      expect(result).toEqual({
        code: 'M002',
        name: createMemberDto.name,
      });
      expect(mockMemberModel.create).toHaveBeenCalledWith({
        name: createMemberDto.name,
        code: expect.any(String),
      });
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockMemberModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.addMember({ name: 'New Member' }))
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });

  describe('findMemberByCode', () => {
    it('should find a member by code', async () => {
      const result = await service.findMemberByCode('M001');
      expect(result).toEqual({
        code: 'M001',
        name: 'Test Member',
      });
      expect(mockMemberModel.findOne).toHaveBeenCalledWith({ where: { code: 'M001' } });
    });

    it('should throw a NotFoundException if member not found', async () => {
      mockMemberModel.findOne.mockResolvedValue(null);

      await expect(service.findMemberByCode('M999'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('getAllMemberList', () => {
    it('should return a list of members with borrowed book count', async () => {
      mockBorrowService.countBorrowedBookMember.mockResolvedValue(2);

      const result = await service.getAllMemberList();
      expect(result).toEqual([
        { code: 'M001', name: 'Test Member', borrowedBookCount: 2 },
        { code: 'M002', name: 'Another Member', borrowedBookCount: 2 },
      ]);
      expect(mockMemberModel.findAll).toHaveBeenCalled();
      expect(mockBorrowService.countBorrowedBookMember).toHaveBeenCalledWith('M001');
      expect(mockBorrowService.countBorrowedBookMember).toHaveBeenCalledWith('M002');
    });

    it('should throw an InternalServerErrorException on failure', async () => {
      mockMemberModel.findAll.mockRejectedValue(new Error('Database error'));

      await expect(service.getAllMemberList())
        .rejects
        .toThrow(InternalServerErrorException);
    });
  });
});
