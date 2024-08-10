import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './books.controller';
import { BookService } from './books.service';
import { Book } from '../domain/models/book.entity';
import { NotFoundException } from '@nestjs/common';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  const mockBooks = [
    {
        code: "JK-45",
        title: "Harry Potter",
        author: "J.K Rowling",
        stock: 1
    },
    {
        code: "SHR-1",
        title: "A Study in Scarlet",
        author: "Arthur Conan Doyle",
        stock: 1
    },
    {
        code: "TW-11",
        title: "Twilight",
        author: "Stephenie Meyer",
        stock: 1
    },
    {
        code: "HOB-83",
        title: "The Hobbit, or There and Back Again",
        author: "J.R.R. Tolkien",
        stock: 1
    },
    {
        code: "NRN-7",
        title: "The Lion, the Witch and the Wardrobe",
        author: "C.S. Lewis",
        stock: 1
    },
  ];

  const mockBookService = {
    addBook: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    getAllBooks: jest.fn(() => {
      return mockBooks;
    }),
    getAllAvailableBooks: jest.fn(() => {
      return mockBooks.filter((book) => book.stock > 0);
    }),
    checkBookAvailability: jest.fn((code: string) => {
      const book = mockBooks.find((book) => book.code === code);
      if (!book) {
        throw new NotFoundException('Book with the given code not found');
      }
      return book.stock > 0;
    }),
    findBookByCode: jest.fn((code: string) => {
      const book = mockBooks.find((book) => book.code === code);
      if (!book) {
        throw new NotFoundException('Book with the given code not found');
      }
      return book;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('addBook', () => {
    it('should add a new book', async () => {
      const dto = { code: "TEST-123", title: "Test Book", author: "Test Author", stock: 1 };
      expect(await controller.addBook(dto)).toEqual({
        id: expect.any(Number),
        ...dto,
      });
      expect(mockBookService.addBook).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAllBooks', () => {
    it('should return an array of books', async () => {
      expect(await controller.getAllBooks()).toEqual(mockBooks);
    });
  });

  describe('getAllAvailableBooks', () => {
    it('should return an array of available books', async () => {
      expect(await controller.getAllAvailableBooks()).toEqual(
        mockBooks.filter((book) => book.stock > 0),
      );
    });
  });

  describe('checkBookAvailability', () => {
    it('should return true if the book is available', async () => {
      expect(await controller.checkBookAvailability('JK-45')).toEqual({ availability: true });
    });

    it('should throw a NotFoundException if the book does not exist', async () => {
      await expect(controller.checkBookAvailability('INVALID-CODE')).rejects.toThrow(NotFoundException);
    });
  });
});
