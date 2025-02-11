import { Observable, Frame } from '@nativescript/core';
import { SessionService } from '../../services/session.service';

export class HomeViewModel extends Observable {
  private sessionService: SessionService;

  constructor() {
    super();
    this.sessionService = new SessionService();
  }

  onCreateSession() {
    Frame.topmost().navigate({
      moduleName: 'views/session/create-session-page',
      clearHistory: false
    });
  }

  onViewSessions() {
    Frame.topmost().navigate({
      moduleName: 'views/session/sessions-list-page',
      clearHistory: false
    });
  }
}