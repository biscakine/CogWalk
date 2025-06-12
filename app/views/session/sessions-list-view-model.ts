import { Frame, alert } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';
import { BaseViewModel } from '../base-view-model';
import { TestService } from '../../services/test.service';
import { EmailService } from '../../services/email.service';

export class SessionsListViewModel extends BaseViewModel {
  private sessionService: SessionService;
  private testService: TestService;
  private emailService: EmailService;
  private _sessions: Session[] = [];

  constructor() {
    super();
    this.sessionService = SessionService.getInstance();
    this.testService = TestService.getInstance();
    this.emailService = EmailService.getInstance();
    this.loadSessions();
  }

  get sessions(): Session[] {
    const sessions = this._sessions.map(session => ({
      ...session,
      onExportTap: () => this.onExportSession(session)
    }));
    return sessions;
  }

  private loadSessions() {
    this._sessions = this.sessionService.getSessions();
    this.notifyPropertyChange('sessions', this.sessions);
  }

  onSessionTap(args: any) {
    if (!args || typeof args.index !== 'number') {
      console.error('Invalid session tap args:', args);
      return;
    }

    const session = this._sessions[args.index];
    if (!session) {
      console.error('Session not found at index:', args.index);
      return;
    }

    Frame.topmost().navigate({
      moduleName: 'views/session/session-detail-page',
      context: { sessionId: session.id },
      clearHistory: false,
      transition: {
        name: 'slide',
        duration: 200
      }
    });
  }

  async onExportSession(session: Session) {
    try {
      if (!session) {
        throw new Error("Session invalide");
      }

      if (!session.participants?.length) {
        throw new Error("Aucun participant dans cette session");
      }

      const results = this.testService.getResults();
      if (!results?.length) {
        throw new Error("Aucun résultat disponible");
      }

      const sessionResults = results.filter(result => {
        if (!result?.participantId) return false;
        return session.participants.some(p => 
          `${p.firstName}_${p.lastName}` === result.participantId
        );
      });

      if (!sessionResults.length) {
        throw new Error("Aucun résultat à exporter pour cette session");
      }

      await this.emailService.sendSessionResults(session.id);
      
      await alert({
        title: "Succès",
        message: "L'email a été préparé avec succès",
        okButtonText: "OK"
      });
    } catch (error) {
      console.error('Error exporting results:', error);
      await alert({
        title: "Erreur",
        message: error.message || "Impossible d'exporter les résultats. Veuillez réessayer.",
        okButtonText: "OK"
      });
    }
  }
}
