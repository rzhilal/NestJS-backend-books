import { Table, Column, Model, PrimaryKey, ForeignKey, DataType, Default } from 'sequelize-typescript';
import { Book } from '../../../books/domain/models/book.entity';
import { Member } from '../../../members/domain/models/member.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'borrowed_books', timestamps: false })
export class BorrowedBook extends Model<BorrowedBook> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.STRING(36),
    allowNull: false
  })
  code: string;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.STRING(10),
    allowNull: false
  })
  book_code: string;

  @ForeignKey(() => Member)
  @Column({
    type: DataType.STRING(10),
    allowNull: false
  })
  member_code: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  borrow_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  return_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  due_date: Date;
}
