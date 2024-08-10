import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { MemberService } from './members.service';
import { CreateMemberDto } from '../dto/create-member.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Member } from '../domain/models/member.entity';

@ApiTags('Members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new member' })
  @ApiResponse({
    status: 201,
    description: 'Member added successfully.',
    type: Member,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async addMember(@Body() createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberService.addMember(createMemberDto);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get member by code' })
  @ApiResponse({ status: 200, description: 'Member found.', type: Member })
  @ApiResponse({ status: 404, description: 'Member not found.' })
  async getMemberByCode(@Param('code') code: string): Promise<Member> {
    const member = await this.memberService.findMemberByCode(code);
    if (!member) {
      throw new NotFoundException('Member with the given code not found');
    }
    return member;
  }

  @Get()
  @ApiOperation({ summary: 'Get member list' })
  @ApiResponse({ status: 200, description: 'Members found.', type: [Member] })
  @ApiResponse({ status: 404, description: 'No members found.' })
  async getMemberList(): Promise<Member[]> {
    return this.memberService.getAllMemberList();
  }
}
