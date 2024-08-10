import { Test, TestingModule } from '@nestjs/testing';
import { BorrowController } from './borrowed-book.controller';
import { BorrowService } from './borrowed-book.service';
import { BorrowDto } from '../dto/borrow.dto';
import { ReturnDto } from '../dto/return.dto';
import { BorrowedBook } from '../domain/models/borrowed-book.entity';

jest.mock('../domain/models/borrowed-book.entity'); // Mock the BorrowedBook model

describe('BorrowController', () => {
  let borrowController: BorrowController;
  let borrowService: BorrowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
      providers: [
        {
          provide: BorrowService,
          useValue: {
            borrowBook: jest.fn(),
            returnBook: jest.fn(),
            countBorrowedBookMember: jest.fn(),
          },
        },
      ],
    }).compile();

    borrowController = module.get<BorrowController>(BorrowController);
    borrowService = module.get<BorrowService>(BorrowService);
  });

  describe('borrowBook', () => {
    it('should borrow a book successfully', async () => {
      const borrowDto: BorrowDto = { book_code: 'JK-45', member_code: 'M001' };
      const borrowedBook = new BorrowedBook(); // This is now a mocked instance
      jest.spyOn(borrowService, 'borrowBook').mockResolvedValue(borrowedBook);

      expect(await borrowController.borrowBook(borrowDto)).toBe(borrowedBook);
      expect(borrowService.borrowBook).toHaveBeenCalledWith(borrowDto);
    });
  });

  describe('returnBook', () => {
    it('should return a book successfully', async () => {
      const returnDto: ReturnDto = { borrow_code: 'BR-001' };
      const returnedBook = new BorrowedBook(); // This is now a mocked instance
      jest.spyOn(borrowService, 'returnBook').mockResolvedValue(returnedBook);

      expect(await borrowController.returnBook(returnDto)).toBe(returnedBook);
      expect(borrowService.returnBook).toHaveBeenCalledWith(returnDto);
    });
  });

  describe('countBorrowedBooksByMemberCode', () => {
    it('should count borrowed books for a member code', async () => {
      const memberCode = 'M001';
      const count = 2;
      jest.spyOn(borrowService, 'countBorrowedBookMember').mockResolvedValue(count);

      expect(await borrowController.countBorrowedBooksByMemberCode(memberCode)).toEqual({ amount: count });
      expect(borrowService.countBorrowedBookMember).toHaveBeenCalledWith(memberCode);
    });
  });
});
