import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { BorrowedBook } from '../domain/models/borrowed-book.entity';
import { BorrowDto } from '../dto/borrow.dto';
import { MemberService } from '../../members/application/members.service';
import { BookService } from '../../books/application/books.service';
import { ReturnDto } from '../dto/return.dto';
import { PenaltiesService } from '../../penalties/application/penalties.service';

@Injectable()
export class BorrowService {
  constructor(
    @Inject('BORROW_REPOSITORY')
    private readonly borrowModel: typeof BorrowedBook,
    @Inject(forwardRef(() => MemberService))
    private readonly memberService: MemberService,
    private readonly bookService: BookService,
    private readonly penaltyService: PenaltiesService,
  ) {}

  async borrowBook(borrowDto: BorrowDto): Promise<BorrowedBook> {
    const { book_code: bookCode, member_code: memberCode } = borrowDto;

    const member = await this.memberService.findMemberByCode(memberCode);
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    const book = await this.bookService.findBookByCode(bookCode);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.stock <= 0) {
      throw new ConflictException('Book is not available for borrowing');
    }

    const activeBorrows = await this.getActiveBorrowsForMember(memberCode);
    if (activeBorrows && activeBorrows.length >= 2) {
      throw new ConflictException('Member has reached the maximum borrowing limit');
    }

    const hasPenalty = await this.penaltyService.checkPenalty(memberCode);
    if (hasPenalty) {
      throw new ForbiddenException('Action not allowed due to an active penalty');
    }

    book.stock -= 1;
    await book.save();

    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(borrowDate.getDate() + 7);

    return this.borrowModel.create({
      member_code: memberCode,
      book_code: bookCode,
      borrow_date: borrowDate,
      return_date: null,
      due_date: dueDate,
    });
  }

  async returnBook(returnDto: ReturnDto): Promise<BorrowedBook> {
    const borrowedBook = await this.borrowModel.findByPk(returnDto.borrow_code);
    if (!borrowedBook) {
      throw new NotFoundException('Book borrowing data not found');
    }

    const now = new Date();
    if (now > borrowedBook.due_date) {
      await this.penaltyService.createPenalty(borrowedBook.member_code);
    }

    const book = await this.bookService.findBookByCode(borrowedBook.book_code);
    book.stock += 1;
    await book.save();

    borrowedBook.return_date = now;
    return borrowedBook.save();
  }

  async countBorrowedBookMember(memberCode: string): Promise<number> {
    const activeBorrows = await this.getActiveBorrowsForMember(memberCode);
    if (!activeBorrows) {
      return 0;
    }
    return activeBorrows.length;
  }

  private async getActiveBorrowsForMember(memberCode: string): Promise<BorrowedBook[]> {
    return this.borrowModel.findAll({
      where: {
        member_code: memberCode,
        return_date: null,
      },
    });
  }
}
