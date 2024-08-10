import { Test, TestingModule } from '@nestjs/testing';
import { BorrowService } from './borrowed-book.service';
import { MemberService } from '../../members/application/members.service';
import { BookService } from '../../books/application/books.service';
import { PenaltiesService } from '../../penalties/application/penalties.service';
import { BorrowedBook } from '../domain/models/borrowed-book.entity';
import { BorrowDto } from '../dto/borrow.dto';
import { ReturnDto } from '../dto/return.dto';
import { NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';

const mockBorrowedBooks = [
  { member_code: 'M001', book_code: 'JK-45', borrow_date: new Date(), return_date: null, due_date: new Date(), id: 'borrow-1' },
  { member_code: 'M001', book_code: 'SHR-1', borrow_date: new Date(), return_date: null, due_date: new Date(), id: 'borrow-2' },
];

const mockMembers = [
  { code: 'M001', name: 'John Doe' },
  { code: 'M002', name: 'Jane Doe' },
];

const mockBooks = [
  { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 },
  { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 },
];

describe('BorrowService', () => {
  let service: BorrowService;
  let borrowModel: any;
  let memberService: any;
  let bookService: any;
  let penaltyService: any;

  beforeEach(async () => {
    borrowModel = {
      create: jest.fn(),
      findByPk: jest.fn(),
    };

    memberService = {
      findMemberByCode: jest.fn(),
    };

    bookService = {
      findBookByCode: jest.fn(),
    };

    penaltyService = {
      checkPenalty: jest.fn(),
      createPenalty: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowService,
        {
          provide: 'BORROW_REPOSITORY',
          useValue: borrowModel,
        },
        {
          provide: MemberService,
          useValue: memberService,
        },
        {
          provide: BookService,
          useValue: bookService,
        },
        {
          provide: PenaltiesService,
          useValue: penaltyService,
        },
      ],
    }).compile();

    service = module.get<BorrowService>(BorrowService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('returnBook', () => {
    it('should successfully return a book', async () => {
      const returnDto: ReturnDto = { borrow_code: 'borrow-1' };

      // Mocked borrowedBook object
      const mockBorrowedBook = {
        ...mockBorrowedBooks[0],
        save: jest.fn().mockResolvedValue({
          ...mockBorrowedBooks[0],
          return_date: new Date(),
        }),
      };

      // Mocked book object
      const mockBook = {
        ...mockBooks[0],
        stock: 1,
        save: jest.fn().mockResolvedValue({
          ...mockBooks[0],
          stock: 2,
        }),
      };

      borrowModel.findByPk.mockResolvedValue(mockBorrowedBook);
      bookService.findBookByCode.mockResolvedValue(mockBook);

      const result = await service.returnBook(returnDto);

      expect(result).toBeDefined();
      expect(result.return_date).toBeInstanceOf(Date);
      expect(borrowModel.findByPk).toHaveBeenCalledWith('borrow-1');
      expect(bookService.findBookByCode).toHaveBeenCalledWith('JK-45');
      expect(mockBook.save).toHaveBeenCalled();
      expect(mockBorrowedBook.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if borrowing record not found', async () => {
      const returnDto: ReturnDto = { borrow_code: 'borrow-1' };
      borrowModel.findByPk.mockResolvedValue(null);

      await expect(service.returnBook(returnDto)).rejects.toThrow(NotFoundException);
    });

    it('should create a penalty if book is returned late', async () => {
      const returnDto: ReturnDto = { borrow_code: 'borrow-1' };
      const now = new Date();
      borrowModel.findByPk.mockResolvedValue({
        ...mockBorrowedBooks[0],
        due_date: new Date(now.getTime() - 10000),
        save: jest.fn().mockResolvedValue({
          ...mockBorrowedBooks[0],
          return_date: now,
        }),
      });
      bookService.findBookByCode.mockResolvedValue({ ...mockBooks[0], stock: 1, save: jest.fn() });

      await service.returnBook(returnDto);
      expect(penaltyService.createPenalty).toHaveBeenCalledWith('M001');
    });
  });
});

