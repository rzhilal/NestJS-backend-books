import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { BorrowService } from './borrowed-book.service';
import { BorrowDto } from '../dto/borrow.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { BorrowedBook } from '../domain/models/borrowed-book.entity';
import { ReturnDto } from '../dto/return.dto';
import { Member } from '../../members/domain/models/member.entity';

@ApiTags('Borrows')
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Post()
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiResponse({ status: 201, description: 'Book borrowed successfully.', type: BorrowedBook })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async borrowBook(@Body() borrowDto: BorrowDto): Promise<BorrowedBook> {
    return this.borrowService.borrowBook(borrowDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Return a book' })
  @ApiResponse({ status: 201, description: 'Book returned successfully.', type: BorrowedBook })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async returnBook(@Body() returnDto: ReturnDto): Promise<BorrowedBook> {
    return this.borrowService.returnBook(returnDto);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Count borrowed books by member code' })
  @ApiResponse({ status: 200, description: 'Member found.', type: Member })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async countBorrowedBooksByMemberCode(@Param('code') code: string): Promise<{ amount: number }> {
    const amount = await this.borrowService.countBorrowedBookMember(code);
    return { amount };
  }
}
