import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BorrowDto {
    @ApiProperty({ description: 'Code of book' })
    @IsString()
    @IsNotEmpty()
    book_code: string;

    @ApiProperty({ description: 'Code of the member' })
    @IsString()
    @IsNotEmpty()
    member_code: string;
}
