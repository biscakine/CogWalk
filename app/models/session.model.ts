export interface Session {
  id: string;
  name: string;
  date: Date;
  participants: Participant[];
}