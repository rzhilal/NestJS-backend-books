import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BookService } from "./books.service";
import { Book } from "../domain/models/book.entity";
import { CreateBookDto } from "../dto/create-book.dto";

@ApiTags('Books')
@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post()
    @ApiOperation({ summary: 'Add a new book' })
    @ApiResponse({ status: 201, description: 'Book added successfully.', type: Book })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    async addBook(@Body() createBookDto: CreateBookDto): Promise<Book> {
        return this.bookService.addBook(createBookDto);
    }

    @Get('/available')
    @ApiOperation({ summary: 'Get all available books' })
    @ApiResponse({ status: 200, description: 'Books found.', type: [Book] })
    async getAllAvailableBooks(): Promise<Book[]> {
        return this.bookService.getAllAvailableBooks();
    }

    @Get()
    @ApiOperation({ summary: 'Get all books' })
    @ApiResponse({ status: 200, description: 'Books found.', type: [Book] })
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.getAllBooks();
    }

    @Get(':code/availability')
    @ApiOperation({ summary: 'Check book availability' })
    @ApiResponse({ status: 200, description: 'Book availability checked.' })
    async checkBookAvailability(@Param('code') code: string): Promise<{ availability: boolean }> {
        const availability = await this.bookService.checkBookAvailability(code);
        return { availability };
    }
}
