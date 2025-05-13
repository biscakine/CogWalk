//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel aligné avec TestResult — score = nombre d’erreurs brut
//------------------------------------------------------------

import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { TestResult } from '../../models/test-result.model';

// Contexte transmis à la page via navigation
export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
  /** Phrase que le participant devait mémoriser */
  originalPhrase?: string;
}

export class TestInputViewModel extends Observable {
  // ───────────── CHRONOMÈTRE ─────────────
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private _timer = '0';            // bindé dans la vue

  // ───────────── ÉTAT DU FORMULAIRE / RÉSULTATS ─────────────
  public userInput = '';
  public showResults = false;
  public timeTaken = 0;
  public errorCount = 0;

  constructor(private ctx: TestInputContext = {}) {
    super();
    this.startTimer();   // Lancement immédiat à l’arrivée sur la page
  }

  // ───────────── PROPRIÉTÉ BINDABLE ─────────────
  get timer(): string {
    return this._timer;
  }

  // ───────────── GESTION DU CHRONO ─────────────
  private tick = () => {
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    this._timer = elapsed.toString();
    this.notifyPropertyChange('timer', this._timer);
  };

  private startTimer(): void {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerInterval = setInterval(this.tick, 1_000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public dispose(): void {
    this.stopTimer();
  }

  private getElapsedSeconds(): number {
    return parseInt(this._timer, 10);
  }

  // ───────────── HANDLERS DÉCLARÉS DANS LE XML ─────────────
  /** Clic sur « Terminé » */
  public onFinishTest(): void {
    // 1) Arrêt du chrono & calculs
    this.stopTimer();
    this.timeTaken = this.getElapsedSeconds();

    const original = this.ctx.originalPhrase ?? '';
    this.errorCount = TestService.getInstance().calculateErrors(original, this.userInput);

    // 2) Construction du résultat complet conforme à TestResult
    const wordCount = original.split(' ').filter(Boolean).length;
    const now = new Date();

    // Le score est le **nombre brut d’erreurs**
    const score = this.errorCount;

    const result: TestResult = {
      id: Date.now().toString(),
      participantId: this.ctx.participantId ?? '',
      originalText: original,
      userInput: this.userInput,
      wordCount,
      timeTaken: this.timeTaken,
      errorCount: this.errorCount,
      timestamp: now,
      date: now,
      score
    };

    TestService.getInstance().addResult(result);

    // 3) Mise à jour de l’UI pour afficher la section Résultats
    this.showResults = true;
    this.notifyPropertyChange('showResults', this.showResults);
    this.notifyPropertyChange('timeTaken', this.timeTaken);
    this.notifyPropertyChange('errorCount', this.errorCount);
  }

  /** Clic sur « Nouvel essai » */
  public onNewTry(): void {
    this.userInput = '';
    this.notifyPropertyChange('userInput', this.userInput);

    this._timer = '0';
    this.notifyPropertyChange('timer', this._timer);

    this.errorCount = 0;
    this.timeTaken = 0;
    this.notifyPropertyChange('errorCount', this.errorCount);
    this.notifyPropertyChange('timeTaken', this.timeTaken);

    this.showResults = false;
    this.notifyPropertyChange('showResults', this.showResults);

    this.startTimer();
  }

  /** Clic sur « Terminer le test » */
  public onFinishSession(): void {
    Frame.topmost().navigate({
      moduleName: 'views/home/home-page',
      clearHistory: true,
      transition: { name: 'fade', duration: 200 }
    });
  }
}
