import { BorrowedBook } from "../domain/models/borrowed-book.entity";

export const borrowProviders = [
  {
    provide: 'BORROW_REPOSITORY',
    useValue: BorrowedBook,
  },
];
