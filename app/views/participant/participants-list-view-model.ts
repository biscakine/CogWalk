import { Frame } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Participant } from '../../models/participant.model';
import { BaseViewModel } from '../base-view-model';

export class ParticipantsListViewModel extends BaseViewModel {
    private sessionService: SessionService;
    private _participants: Participant[] = [];
    private _sessionName: string = '';
    private sessionId: string;

    constructor(sessionId: string) {
        super();
        this.sessionService = SessionService.getInstance();
        this.sessionId = sessionId;
        this.loadSessionData();
    }

    get participants(): Participant[] {
        return this._participants;
    }

    get sessionName(): string {
        return this._sessionName;
    }

    private loadSessionData() {
        const session = this.sessionService.getSession(this.sessionId);
        if (session) {
            this._sessionName = session.name;
            this._participants = session.participants;
            this.notifyPropertyChange('sessionName', this._sessionName);
            this.notifyPropertyChange('participants', this._participants);
        }
    }

    onParticipantTap(args: any) {
        const participant = this._participants[args.index];
        if (participant) {
            Frame.topmost().navigate({
                moduleName: 'views/participant/participant-results-page',
                context: { participant },
                clearHistory: false,
                transition: {
                    name: 'slide',
                    duration: 200
                }
            });
        }
    }

    onAddParticipant() {
        Frame.topmost().navigate({
            moduleName: 'views/participant/add-participant-page',
            context: { sessionId: this.sessionId },
            clearHistory: false,
            transition: {
                name: 'slide',
                duration: 200
            }
        });
    }
}