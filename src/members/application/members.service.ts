import { Injectable, Inject, NotFoundException, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { Member } from '../domain/models/member.entity';
import { CreateMemberDto } from '../dto/create-member.dto';
import { BorrowService } from '../../borrow/application/borrowed-book.service';

@Injectable()
export class MemberService {
  constructor(
    @Inject('MEMBER_REPOSITORY')
    private readonly memberModel: typeof Member,
    @Inject(forwardRef(() => BorrowService))
    private readonly borrowService: BorrowService,
  ) {}

  async addMember(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      const newCode = await this.generateNextCode();

      const member = await this.memberModel.create({
        name: createMemberDto.name,
        code: newCode,
      });

      return member;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add new member');
    }
  }

  async findMemberByCode(code: string): Promise<Member | null> {
    try {
      const member = await this.memberModel.findOne({ where: { code } });
      if (!member) {
        throw new NotFoundException('Member with the given code not found');
      }
      return member;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find member by code');
    }
  }

  async getAllMemberList(): Promise<any> {
    try {
      const members = await this.memberModel.findAll();

      return await Promise.all(
        members.map(async (member) => {
          const borrowedBookCount = await this.borrowService.countBorrowedBookMember(member.code);
          return {
            ...member.toJSON(),
            borrowedBookCount,
          };
        })
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve member list');
    }
  }

  private async generateNextCode(): Promise<string> {
    try {
      const lastMember = await this.memberModel.findOne({
        attributes: ['code'],
        order: [['code', 'DESC']],
      });

      const lastCode = lastMember?.code;
      if (!lastCode) return 'M001';

      const lastNumber = parseInt(lastCode.slice(1), 10);
      const nextNumber = lastNumber + 1;
      return `M${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate next code');
    }
  }
}
