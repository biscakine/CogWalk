import { Observable, Frame } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Participant }    from '../../models/participant.model';

export class AddParticipantViewModel extends Observable {
  private sessionService = SessionService.getInstance();
  private sessionId: string;

  public firstName = '';
  public lastName  = '';

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
    // Initial property notifications
    this.notifyPropertyChange('firstName', this.firstName);
    this.notifyPropertyChange('lastName', this.lastName);
  }

  /** Validation : prénom et nom non vides */
  get isValid(): boolean {
    return this.firstName.trim().length > 0 && this.lastName.trim().length > 0;
  }

  /** Appelé par le bouton "Ajouter" */
  public onAddParticipant(): void {
    const participant: Participant = {
      id:        Date.now().toString(),
      firstName: this.firstName.trim(),
      lastName:  this.lastName.trim()
    };
    // Ajout du participant dans la session
    this.sessionService.addParticipantToSession(this.sessionId, participant);

    // Navigation retour vers la page de détail de session
    Frame.topmost().navigate({
      moduleName: 'views/session/session-detail-page',
      context:    { sessionId: this.sessionId },
      clearHistory: false,
      transition: { name: 'slide', duration: 200 }
    });
  }
}
