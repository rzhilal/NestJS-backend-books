import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Op } from 'sequelize';

// Mock data for books
const mockBooks = [
  { code: "JK-45", title: "Harry Potter", author: "J.K Rowling", stock: 1 },
  { code: "SHR-1", title: "A Study in Scarlet", author: "Arthur Conan Doyle", stock: 1 },
  { code: "TW-11", title: "Twilight", author: "Stephenie Meyer", stock: 1 },
  { code: "HOB-83", title: "The Hobbit, or There and Back Again", author: "J.R.R. Tolkien", stock: 1 },
  { code: "NRN-7", title: "The Lion, the Witch and the Wardrobe", author: "C.S. Lewis", stock: 1 },
];

describe('BookService', () => {
  let service: BookService;
  let bookModel: any; // Mocking the Book model

  beforeEach(async () => {
    bookModel = {
      create: jest.fn().mockResolvedValue(mockBooks[0]), // Return the first mock Book object
      findAll: jest.fn().mockResolvedValue(mockBooks), // Return the mock books array
      findByPk: jest.fn().mockImplementation((code: string) => 
        Promise.resolve(mockBooks.find(book => book.code === code) || null)
      ),
      findOne: jest.fn().mockImplementation(({ where: { code } }) => 
        Promise.resolve(mockBooks.find(book => book.code === code) || null)
      ),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: 'BOOK_REPOSITORY',
          useValue: bookModel, // Use the mock model
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add a new book', async () => {
    const createBookDto = new CreateBookDto();
    createBookDto.title = 'Test Book';
    createBookDto.author = 'Test Author';
    createBookDto.stock = 10;

    jest.spyOn(bookModel, 'create').mockResolvedValueOnce(
      { code: 'NEW-CODE', title: createBookDto.title, author: createBookDto.author, stock: createBookDto.stock }
    );

    const result = await service.addBook(createBookDto);
    expect(result).toEqual(expect.objectContaining({ code: 'NEW-CODE', title: 'Test Book', author: 'Test Author', stock: 10 }));
    expect(bookModel.create).toHaveBeenCalledTimes(1);
    expect(bookModel.create).toHaveBeenCalledWith(createBookDto);
  });

  it('should throw an InternalServerErrorException when adding a new book fails', async () => {
    jest.spyOn(bookModel, 'create').mockRejectedValueOnce(new Error('Mocked error'));

    await expect(service.addBook(new CreateBookDto())).rejects.toThrow(InternalServerErrorException);
  });

  it('should retrieve all books', async () => {
    const result = await service.getAllBooks();
    expect(result).toBeInstanceOf(Array);
    expect(result).toEqual(mockBooks);
    expect(bookModel.findAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an InternalServerErrorException when retrieving all books fails', async () => {
    jest.spyOn(bookModel, 'findAll').mockRejectedValueOnce(new Error('Mocked error'));

    await expect(service.getAllBooks()).rejects.toThrow(InternalServerErrorException);
  });

  it('should retrieve all available books', async () => {
    const result = await service.getAllAvailableBooks();
    expect(result).toBeInstanceOf(Array);
    expect(result).toEqual(mockBooks);
    expect(bookModel.findAll).toHaveBeenCalledTimes(1);
    expect(bookModel.findAll).toHaveBeenCalledWith({
      where: {
        stock: {
          [Op.gt]: 0,
        },
      },
    });
  });

  it('should throw an InternalServerErrorException when retrieving available books fails', async () => {
    jest.spyOn(bookModel, 'findAll').mockRejectedValueOnce(new Error('Mocked error'));

    await expect(service.getAllAvailableBooks()).rejects.toThrow(InternalServerErrorException);
  });

  it('should check book availability', async () => {
    const code = 'JK-45';
    jest.spyOn(bookModel, 'findByPk').mockResolvedValueOnce(mockBooks.find(book => book.code === code) || null);
    const result = await service.checkBookAvailability(code);
    expect(result).toBe(true);
    expect(bookModel.findByPk).toHaveBeenCalledTimes(1);
    expect(bookModel.findByPk).toHaveBeenCalledWith(code);
  });

  it('should throw a NotFoundException when the book is not found', async () => {
    jest.spyOn(bookModel, 'findByPk').mockResolvedValueOnce(null);

    await expect(service.checkBookAvailability('non-existent-code')).rejects.toThrow(NotFoundException);
  });

  it('should throw an InternalServerErrorException when checking book availability fails', async () => {
    jest.spyOn(bookModel, 'findByPk').mockRejectedValueOnce(new Error('Mocked error'));

    await expect(service.checkBookAvailability('test-code')).rejects.toThrow(InternalServerErrorException);
  });

  it('should find a book by code', async () => {
    const code = 'JK-45';
    jest.spyOn(bookModel, 'findOne').mockResolvedValueOnce(mockBooks.find(book => book.code === code) || null);
    const result = await service.findBookByCode(code);
    expect(result).toEqual(mockBooks.find(book => book.code === code));
    expect(bookModel.findOne).toHaveBeenCalledTimes(1);
    expect(bookModel.findOne).toHaveBeenCalledWith({ where: { code } });
  });

  it('should throw a NotFoundException when the book is not found', async () => {
    jest.spyOn(bookModel, 'findOne').mockResolvedValueOnce(null);

    await expect(service.findBookByCode('non-existent-code')).rejects.toThrow(NotFoundException);
  });

  it('should throw an InternalServerErrorException when finding a book by code fails', async () => {
    jest.spyOn(bookModel, 'findOne').mockRejectedValueOnce(new Error('Mocked error'));

    await expect(service.findBookByCode('test-code')).rejects.toThrow(InternalServerErrorException);
  });
});
