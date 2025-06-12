import { Observable, Frame, alert } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Participant }    from '../../models/participant.model';

/** ViewModel pour la page "Ajouter un participant" */
export class AddParticipantViewModel extends Observable {
  private sessionId: string;
  public firstName = '';
  public lastName  = '';

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
  }

  /** Active le bouton seulement si les deux champs sont remplis */
  get isValid(): boolean {
    return this.firstName.trim().length > 0 && this.lastName.trim().length > 0;
  }

  /** Méthode appelée par le bouton "Ajouter" */
  public async onAddParticipant(): Promise<void> {
    // Debug: montre une alert pour confirmer l'appel
    await alert({
      title: 'Debug',
      message: `onAddParticipant appelé pour session ${this.sessionId}\nPrénom: ${this.firstName}\nNom: ${this.lastName}`,
      okButtonText: 'OK'
    });

    const trimmedFirst = this.firstName.trim();
    const trimmedLast  = this.lastName.trim();
    const participant: Participant = {
      id:        Date.now().toString(),
      firstName: trimmedFirst,
      lastName:  trimmedLast
    };

    // Ajoute le participant dans la session
    SessionService.getInstance().addParticipantToSession(this.sessionId, participant);

    // Retour à la page de détail de session
    Frame.topmost().navigate({
      moduleName:   'views/session/session-detail-page',
      context:      { sessionId: this.sessionId },
      clearHistory: false,
      transition:   { name: 'slide', duration: 200 }
    });
  }
}
