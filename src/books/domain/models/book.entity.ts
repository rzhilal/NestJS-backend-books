import { Table, Column, Model, PrimaryKey, Unique, DataType } from 'sequelize-typescript';

@Table({ tableName: 'books', timestamps: false })
export class Book extends Model<Book> {

  @PrimaryKey
  @Unique
  @Column({
    type: DataType.STRING(10),
    allowNull: false
  })
  code: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false
  })
  author: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  stock: number;
}
