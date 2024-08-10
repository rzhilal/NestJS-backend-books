import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Member } from './domain/models/member.entity';
import { memberProviders } from './infrastructure/members.provider';
import { MemberService } from './application/members.service';
import { MemberController } from './application/members.controller';
import { BorrowsModule } from 'src/borrow/borrowed-books.modules';

@Module({
  imports: [
    SequelizeModule.forFeature([Member]),
    forwardRef(() => BorrowsModule)
  ],
  controllers: [MemberController],
  providers: [
    MemberService,
    ...memberProviders,
  ],
  exports: [MemberService],
})
export class MembersModule {}
