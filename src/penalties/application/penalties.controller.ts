import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PenaltiesService } from './penalties.service';
import { Penalty } from '../domain/models/penalty.entity';

@ApiTags('Penalties')
@Controller('penalty')
export class PenaltiesController {
  constructor(private readonly penaltyService: PenaltiesService) {}
  
  @Get(':member_code/penalized')
  @ApiOperation({ summary: 'Check member penalized' })
  @ApiResponse({ status: 200, description: 'Book found.', type: Penalty })
  async checkPenalty(@Param('member_code') code: string): Promise<any> {
    return { penalty: await this.penaltyService.checkPenalty(code) };
  }
}
