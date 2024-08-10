import { Book } from '../domain/models/book.entity';

export const bookProviders = [
  {
    provide: 'BOOK_REPOSITORY',
    useValue: Book,
  },
];
