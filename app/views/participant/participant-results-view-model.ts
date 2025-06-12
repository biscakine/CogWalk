import { Observable } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { TestResult } from '../../models/test-result.model';
import { Participant } from '../../models/participant.model';
import { formatFrenchDateTime } from '../../utils/date-formatter';

// ViewModel pour afficher les résultats d'un participant
export class ParticipantResultsViewModel extends Observable {
  private testService = TestService.getInstance();
  private _results: Array<TestResult & { formattedDate: string; tryNumber: number }> = [];
  private participant: Participant;

  constructor(participant: Participant) {
    super();
    this.participant = participant;
    this.loadResults();
  }

  // Charge et notifie les résultats pour ce participant
  private loadResults(): void {
    const pid = `${this.participant.firstName}_${this.participant.lastName}`;
    const all = this.testService.getResults();
    const filtered = all.filter(r => r.participantId === pid);
    // Trier par timestamp décroissant
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    // Ajouter formattedDate et tryNumber
    this._results = filtered.map((r, i, arr) => ({
      ...r,
      formattedDate: formatFrenchDateTime(new Date(r.timestamp)),
      tryNumber: arr.length - i
    }));
    this.notifyPropertyChange('results', this._results);
  }

  // Getter pour binding
  get results(): Array<TestResult & { formattedDate: string; tryNumber: number }> {
    return this._results;
  }
}
