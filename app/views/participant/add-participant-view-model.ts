import { Frame } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { BaseViewModel } from '../base-view-model';

export class AddParticipantViewModel extends BaseViewModel {
    private _firstName: string = '';
    private _lastName: string = '';
    private sessionService: SessionService;
    private sessionId: string;

    constructor(sessionId: string) {
        super();
        this.sessionService = SessionService.getInstance();
        this.sessionId = sessionId;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        if (this._firstName !== value) {
            this._firstName = value;
            this.notifyPropertyChange('firstName', value);
            this.notifyPropertyChange('isValid', this.isValid);
        }
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        if (this._lastName !== value) {
            this._lastName = value;
            this.notifyPropertyChange('lastName', value);
            this.notifyPropertyChange('isValid', this.isValid);
        }
    }

    get isValid(): boolean {
        return this._firstName.length > 0 && this._lastName.length > 0;
    }

    onAddParticipant() {
        if (this.isValid) {
            const participant = {
                id: Date.now().toString(),
                firstName: this._firstName,
                lastName: this._lastName,
                createdAt: new Date()
            };
            
            this.sessionService.addParticipantToSession(this.sessionId, participant);
            
            Frame.topmost().navigate({
                moduleName: 'views/test/test-page',
                context: { participant: participant },
                clearHistory: false,
                transition: {
                    name: 'slide',
                    duration: 200
                }
            });
        }
    }

    onGoBack() {
        Frame.topmost().goBack();
    }
}