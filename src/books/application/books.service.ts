import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Book } from '../domain/models/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { Op } from 'sequelize';

@Injectable()
export class BookService {
  constructor(
    @Inject('BOOK_REPOSITORY')
    private readonly bookModel: typeof Book,
  ) {}

  async addBook(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const book = await this.bookModel.create(createBookDto);
      return book;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add new book');
    }
  }

  async getAllBooks(): Promise<Book[]> {
    try {
      return await this.bookModel.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve all books');
    }
  }

  async getAllAvailableBooks(): Promise<Book[]> {
    try {
      return await this.bookModel.findAll({
        where: {
          stock: {
            [Op.gt]: 0, // Buku dengan stock lebih dari 0
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve available books');
    }
  }

  async checkBookAvailability(code: string): Promise<boolean> {
    try {
      const book = await this.bookModel.findByPk(code);
      if (!book) {
        throw new NotFoundException('Book with the given code not found');
      }
      return book.stock > 0;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to check book availability');
    }
  }

  async findBookByCode(code: string): Promise<Book> {
    try {
      const book = await this.bookModel.findOne({ where: { code } });
      if (!book) {
        throw new NotFoundException('Book with the given code not found');
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to find book by code');
    }
  }
}
