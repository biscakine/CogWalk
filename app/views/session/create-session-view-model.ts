import { Frame } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { BaseViewModel } from '../base-view-model';

export class CreateSessionViewModel extends BaseViewModel {
  private _sessionName: string = '';
  private sessionService: SessionService;

  constructor() {
    super();
    this.sessionService = new SessionService();
  }

  get sessionName(): string {
    return this._sessionName;
  }

  set sessionName(value: string) {
    if (this._sessionName !== value) {
      this._sessionName = value;
      this.notifyPropertyChange('sessionName', value);
    }
  }

  onCreateSession() {
    if (this._sessionName.length > 0) {
      const session = this.sessionService.createSession(this._sessionName);
      Frame.topmost().navigate({
        moduleName: 'views/participant/add-participant-page',
        context: { sessionId: session.id },
        clearHistory: false,
        transition: {
          name: 'slide',
          duration: 200
        }
      });
    }
  }
}