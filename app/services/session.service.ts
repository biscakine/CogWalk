import { Observable } from '@nativescript/core';
import { Session } from '../models/session.model';
import { Participant } from '../models/participant.model';

export class SessionService extends Observable {
  private static instance: SessionService;
  private sessions: Session[] = [];

  constructor() {
    super();
    if (SessionService.instance) {
      return SessionService.instance;
    }
    SessionService.instance = this;
  }

  static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  createSession(name: string): Session {
    const session: Session = {
      id: Date.now().toString(),
      name,
      date: new Date(),
      participants: []
    };
    this.sessions.push(session);
    return session;
  }

  getSessions(): Session[] {
    return this.sessions;
  }

  getSession(id: string): Session | undefined {
    return this.sessions.find(session => session.id === id);
  }

  addParticipantToSession(sessionId: string, participant: Participant): void {
    const session = this.getSession(sessionId);
    if (session) {
      if (!session.participants) {
        session.participants = [];
      }
      session.participants.push(participant);
      this.notifyPropertyChange('sessions', this.sessions);
    }
  }
}