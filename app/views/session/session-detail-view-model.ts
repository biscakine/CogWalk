import { Frame, alert } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { Session } from '../../models/session.model';
import { BaseViewModel } from '../base-view-model';
import { TestService } from '../../services/test.service';
import { EmailService } from '../../services/email.service';
import { formatFrenchDateTime } from '../../utils/date-formatter';

export class SessionDetailViewModel extends BaseViewModel {
    private sessionService: SessionService;
    private testService: TestService;
    private emailService: EmailService;
    private _session: Session | undefined;
    private _formattedDate: string = '';
    private sessionId: string;

    constructor(sessionId: string) {
        super();
        this.sessionService = SessionService.getInstance();
        this.testService = TestService.getInstance();
        this.emailService = EmailService.getInstance();
        this.sessionId = sessionId;
        this.loadSession();
    }

    private loadSession() {
        if (!this.sessionId) return;
        
        this._session = this.sessionService.getSession(this.sessionId);
        if (this._session) {
            this._formattedDate = formatFrenchDateTime(this._session.date);
            this.notifyPropertyChange('session', this._session);
            this.notifyPropertyChange('formattedDate', this._formattedDate);
        }
    }

    get session(): Session | undefined {
        return this._session;
    }

    get formattedDate(): string {
        return this._formattedDate;
    }

    onAddParticipant() {
        if (!this._session) return;
        
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

    onParticipantTap(args: any) {
        if (!this._session || !args || !this._session.participants) return;
        
        const participant = this._session.participants[args.index];
        if (participant) {
            Frame.topmost().navigate({
                moduleName: 'views/test/test-page',
                context: { participant },
                clearHistory: false,
                transition: {
                    name: 'slide',
                    duration: 200
                }
            });
        }
    }

    async onExportResults() {
        try {
            if (!this._session) {
                throw new Error("Session non trouvée");
            }

            if (!this._session.participants || this._session.participants.length === 0) {
                throw new Error("Aucun participant dans cette session");
            }

            const results = this.testService.getResults();
            if (!results || results.length === 0) {
                throw new Error("Aucun résultat disponible");
            }

            const sessionResults = results.filter(result => {
                if (!result || !result.participantId) return false;
                return this._session?.participants.some(p => 
                    p && p.firstName && p.lastName && 
                    `${p.firstName}_${p.lastName}` === result.participantId
                );
            });

            if (sessionResults.length === 0) {
                throw new Error("Aucun résultat à exporter pour cette session");
            }

            await this.emailService.sendSessionResults(this._session, sessionResults);
            
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