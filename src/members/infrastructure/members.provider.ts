import { Member } from '../domain/models/member.entity';

export const memberProviders = [
  {
    provide: 'MEMBER_REPOSITORY',
    useValue: Member,
  },
];
