import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BorrowedBook } from './domain/models/borrowed-book.entity';
import { BorrowController } from './application/borrowed-book.controller';
import { BorrowService } from './application/borrowed-book.service';
import { borrowProviders } from './infrastructure/borrowed-book.provider';
import { MembersModule } from 'src/members/members.module';
import { BooksModule } from 'src/books/books.module';
import { PenaltiesModule } from 'src/penalties/penalties.modules';

@Module({
  imports: [
    SequelizeModule.forFeature([BorrowedBook]),
    forwardRef(() => MembersModule),
    BooksModule,
    PenaltiesModule,
  ],
  controllers: [BorrowController],
  providers: [
    BorrowService,
    ...borrowProviders,
],
  exports: [BorrowService],
})
export class BorrowsModule {}
