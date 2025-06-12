import { Observable, Frame, alert } from '@nativescript/core';
import { SessionService }           from '../../services/session.service';
import { Participant }              from '../../models/participant.model';

export class AddParticipantViewModel extends Observable {
  private sessionId: string;
  public firstName = '';
  public lastName  = '';

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
  }

  get isValid(): boolean {
    return this.firstName.trim().length > 0 &&
           this.lastName.trim().length  > 0;
  }

  public async onAddParticipant(): Promise<void> {
    // 🔥 Debug alert
    await alert({
      title: 'DEBUG',
      message: `Ajouter appelé :\n${this.firstName} ${this.lastName}`,
      okButtonText: 'OK'
    });

    // Si on veut empêcher quand les champs sont vides
    if (!this.isValid) {
      await alert({ title: 'Erreur', message: 'Prénom et nom requis', okButtonText: 'OK' });
      return;
    }

    const participant: Participant = {
      id:        Date.now().toString(),
      firstName: this.firstName.trim(),
      lastName:  this.lastName.trim()
    };
    SessionService.getInstance().addParticipantToSession(this.sessionId, participant);

    // Navigue de retour
    Frame.topmost().navigate({
      moduleName:   'views/session/session-detail-page',
      context:      { sessionId: this.sessionId },
      clearHistory: false,
      transition:   { name: 'slide', duration: 200 }
    });
  }
}
