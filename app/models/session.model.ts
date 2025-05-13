import { Participant } from './participant.model';

export interface Session {
  id: string;
  name: string;
  date: Date;
  participants: Participant[];
}
