// src/app.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MembersModule } from './members/members.module';
import { databaseConfig } from './config/database.config';
import { BooksModule } from './books/books.module';
import { BorrowsModule } from './borrow/borrowed-books.modules';
import { PenaltiesModule } from './penalties/penalties.modules';

@Module({
  imports: [
    SequelizeModule.forRoot(databaseConfig),
    MembersModule,
    BooksModule,
    BorrowsModule,
    PenaltiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
