import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ description: 'Name of the member' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
