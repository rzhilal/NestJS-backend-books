import { Penalty } from "../domain/models/penalty.entity";

export const penaltiesProviders = [
  {
    provide: 'PENALTIES_REPOSITORY',
    useValue: Penalty,
  },
];
