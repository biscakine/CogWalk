import { Observable, Frame } from '@nativescript/core';
import { SessionService }    from '../../services/session.service';
import { Participant }       from '../../models/participant.model';

export class AddParticipantViewModel extends Observable {
  // Conserve l’ID de session pour l’ajout
  private sessionId: string;

  // Bindables pour le deux-way binding sur les TextField
  public firstName = '';
  public lastName  = '';

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
  }

  /** Active le bouton seulement si les deux champs sont remplis */
  get isValid(): boolean {
    return this.firstName.trim().length > 0 &&
           this.lastName.trim().length  > 0;
  }

  /** Appelé par le tap="{{ onAddParticipant }}" */
  public onAddParticipant(): void {
    // Crée le participant
    const participant: Participant = {
      id:        Date.now().toString(),
      firstName: this.firstName.trim(),
      lastName:  this.lastName.trim()
    };

    // Ajoute à la session
    SessionService.getInstance()
      .addParticipantToSession(this.sessionId, participant);

    // Retourne à la page de détails de session
    Frame.topmost().navigate({
      moduleName:   'views/session/session-detail-page',
      context:      { sessionId: this.sessionId },
      clearHistory: false,
      transition:   { name: 'slide', duration: 200 }
    });
  }
}
