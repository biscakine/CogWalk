import { Observable, Frame } from '@nativescript/core';
import { SessionService }         from '../../services/session.service';
import { Session }                from '../../models/session.model';

export class CreateSessionViewModel extends Observable {
  private svc = SessionService.getInstance();
  public  name = '';

  constructor() {
    super();
  }

  public create(): void {
    const trimmed = this.name.trim();
    if (!trimmed) {
      return;
    }
    const session: Session = this.svc.createSession(trimmed);
    Frame.topmost().navigate({
      moduleName: 'views/session/session-detail-page',
      context:    { sessionId: session.id },
      transition: { name: 'slide', duration: 200 }
    });
  }
}
