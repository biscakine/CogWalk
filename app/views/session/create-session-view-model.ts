import { Frame, alert } from '@nativescript/core';
import { SessionService } from '../../services/session.service';
import { TestService }    from '../../services/test.service';
import { TestResult }     from '../../models/test-result.model';
import { BaseViewModel }  from '../base-view-model';

export class SessionDetailViewModel extends BaseViewModel {
  private sessionService = SessionService.getInstance();
  private testService    = TestService.getInstance();

  private _sessionResults: TestResult[] = [];

  constructor(private sessionId: string) {
    super();
    this.loadSession();
    this.loadResults();
  }

  // … tes getters pour session et formattedDate …

  /** Charge les résultats de cette session */
  loadResults(): void {
    if (!this.session) return;
    const allResults = this.testService.getResults();
    // Filtrer ceux qui appartiennent à cette session
    this._sessionResults = allResults.filter(r => r.sessionId === this.sessionId);
    this.notifyPropertyChange('sessionResults', this._sessionResults);
  }

  /** Getter utilisé par le binding */
  get sessionResults(): TestResult[] {
    return this._sessionResults;
  }

  // … tes méthodes onAddParticipant(), onParticipantTap(), onExportResults() …
}
