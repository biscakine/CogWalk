// app/views/session/create-session-view-model.ts
import { Observable, Frame } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';

export class CreateSessionViewModel extends Observable {
  private sessionSvc = SessionService.getInstance();
  public sessionName = '';

  constructor() {
    super();
    this.notifyPropertyChange('sessionName', this.sessionName);
  }

  /** Méthode appelée par le bouton "Créer" */
  public onCreateSession(): void {
    const name = this.sessionName.trim();
    if (!name) return;
    const session: Session = this.sessionSvc.createSession(name);
    Frame.topmost().navigate({
      moduleName: 'views/session/session-detail-page',
      context: { sessionId: session.id },
      transition: { name: 'slide', duration: 200 }
    });
  }
}
