import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Book } from './domain/models/book.entity';
import { bookProviders } from './infrastructure/books.provider';
import { BookService } from './application/books.service';
import { BookController } from './application/books.controller';

@Module({
  imports: [SequelizeModule.forFeature([Book])],
  controllers: [BookController],
  providers: [
    BookService,
    ...bookProviders,
  ],
  exports: [BookService],
})
export class BooksModule {}
