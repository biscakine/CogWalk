import { Observable } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';

export class CreateSessionViewModel extends Observable {
  private svc = SessionService.getInstance();
  public name = '';

  constructor() {
    super();
  }

  public create(): void {
    if (!this.name.trim()) return;
    const session: Session = this.svc.createSession(this.name.trim());
    // Navigue vers le détail de la session créée
    Frame.topmost().navigate({
      moduleName: 'views/session/session-detail-page',
      context: { sessionId: session.id },
      transition: { name: 'slide', duration: 200 }
    });
  }
}
