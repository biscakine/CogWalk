import { Observable } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { TestResult }  from '../../models/test-result.model';

export class SessionDetailViewModel extends Observable {
  // … tes imports et propriétés existantes

  constructor(sessionId: string) {
    super();
    // … ton loadSession()
    this.loadResults();
  }

  /** Charge et notifie les résultats pour cette session */
  public loadResults(): void {
    const all = TestService.getInstance().getResults();
    const filtered = all.filter(r => r.sessionId === this.sessionId);
    this.notifyPropertyChange('sessionResults', filtered);
  }

  /** Getter utilisé pour le binding */
  get sessionResults(): TestResult[] {
    // stocke en interne après loadResults
    return (this as any)._sessionResults || [];
  }

  set sessionResults(v: TestResult[]) {
    (this as any)._sessionResults = v;
  }
}
