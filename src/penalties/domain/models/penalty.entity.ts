import { Table, Column, Model, PrimaryKey, ForeignKey, DataType, Default } from 'sequelize-typescript';
import { Member } from 'src/members/domain/models/member.entity';
import { v4 as uuidv4 } from 'uuid';

@Table({ tableName: 'penalties', timestamps: false })
export class Penalty extends Model<Penalty> {
  @PrimaryKey
  @Default(uuidv4)
  @Column({
    type: DataType.STRING(36),
    allowNull: false
  })
  code: string;

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
  penalty_start_date: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  penalty_end_date: Date;
}
