import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReturnDto {
    @ApiProperty({ description: 'Code of book' })
    @IsString()
    @IsNotEmpty()
    borrow_code: string;
}
