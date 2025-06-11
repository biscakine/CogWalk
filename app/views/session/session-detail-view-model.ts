import { Observable, Frame, alert } from '@nativescript/core';
import { SessionService }             from '../../services/session.service';
import { TestService }                from '../../services/test.service';
import { TestResult }                 from '../../models/test-result.model';
import { Session }                    from '../../models/session.model';
import { formatFrenchDateTime }       from '../../utils/date-formatter';

export class SessionDetailViewModel extends Observable {
  private sessionService = SessionService.getInstance();
  private testService    = TestService.getInstance();

  private sessionId: string;
  private _session?:   Session;
  private _sessionResults: TestResult[] = [];

  public formattedDate = '';

  constructor(sessionId: string) {
    super();
    this.sessionId = sessionId;
    this.loadSession();
    this.loadResults();
  }

  private loadSession(): void {
    this._session = this.sessionService.getSession(this.sessionId);
    if (this._session) {
      this.formattedDate = formatFrenchDateTime(this._session.date);
      this.notifyPropertyChange('session', this._session);
      this.notifyPropertyChange('formattedDate', this.formattedDate);
    }
  }

  get session(): Session | undefined {
    return this._session;
  }

  /** Charge les résultats liés à cette session */
  public loadResults(): void {
    const allResults = this.testService.getResults();
    // Il faut que TestResult.interface comprenne `sessionId: string`
    this._sessionResults = allResults.filter(r => r.sessionId === this.sessionId);
    this.notifyPropertyChange('sessionResults', this._sessionResults);
  }

  get sessionResults(): TestResult[] {
    return this._sessionResults;
  }

  // … tes autres méthodes : onAddParticipant, onParticipantTap, onExportResults …
}
