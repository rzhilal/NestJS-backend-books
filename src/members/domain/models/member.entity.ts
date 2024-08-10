import { Table, Column, Model, PrimaryKey, Unique, DataType } from 'sequelize-typescript';

@Table({ tableName: 'members', timestamps: false })
export class Member extends Model<Member> {

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
  name: string;
}
