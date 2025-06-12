export class ParticipantService {
  private static instance: ParticipantService;
  private participants = new Map<string, Participant>();
  private constructor(){}

  static getInstance(): ParticipantService {
    if (!ParticipantService.instance) {
      ParticipantService.instance = new ParticipantService();
    }
    return ParticipantService.instance;
  }

  getParticipantById(id: string): Participant {
    return this.participants.get(id);
  }
