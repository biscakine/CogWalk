//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel complet ALIGNÉ avec test-input-page.xml
//------------------------------------------------------------

import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';

// Contexte transmis via navigation (participant, session, phrase à mémoriser…)
export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
  /** Phrase d’origine que l’utilisateur devait retenir */
  originalPhrase?: string;
}

// Modèle minimal qu’on stocke via TestService
export interface TestResult {
  participantId?: string;
  sessionId?: string;
  originalPhrase?: string;
  userInput: string;
  duration: number;     // secondes
  errorCount: number;
}

export class TestInputViewModel extends Observable {
  // ───────────── CHRONO ─────────────
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private _timer = '0';            // bindé dans la vue

  // ───────────── DONNÉES DE FORMULAIRE / RÉSULTATS ─────────────
  public userInput = '';
  public showResults = false;
  public timeTaken = 0;
  public errorCount = 0;

  constructor(private ctx: TestInputContext = {}) {
    super();
    this.startTimer();   // on démarre dès l’arrivée sur la page
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

  public startTimer(): void {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerInterval = setInterval(this.tick, 1_000);
  }

  public stopTimer(): void {
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

  // ───────────── HANDLERS DECLARÉS DANS LE XML ─────────────
  /** Clic sur « Terminé » */
  public onFinishTest(): void {
    // 1) Arrêt du chrono & métriques
    this.stopTimer();
    this.timeTaken = this.getElapsedSeconds();

    const original = this.ctx.originalPhrase ?? '';
    this.errorCount = TestService.getInstance().calculateErrors(original, this.userInput);

    // 2) Persistance
    const result: TestResult = {
      participantId: this.ctx.participantId,
      sessionId: this.ctx.sessionId,
      originalPhrase: original,
      userInput: this.userInput,
      duration: this.timeTaken,
      errorCount: this.errorCount
    };
    TestService.getInstance().addResult(result);

    // 3) Afficher la section Résultats
    this.showResults = true;
    this.notifyPropertyChange('showResults', this.showResults);
    this.notifyPropertyChange('timeTaken', this.timeTaken);
    this.notifyPropertyChange('errorCount', this.errorCount);
  }

  /** Clic sur « Nouvel essai » */
  public onNewTry(): void {
    // Réinitialise l’état pour un nouveau test
    this.userInput = '';
    this.notifyPropertyChange('userInput', this.userInput);

    this._timer = '0';
    this.notifyPropertyChange('timer', this._timer);

    this.showResults = false;
    this.notifyPropertyChange('showResults', this.showResults);

    this.startTimer();
  }

  /** Clic sur « Terminer le test » */
  public onFinishSession(): void {
    // Retour (ou navigation) à l’écran d’accueil
    Frame.topmost().navigate({
      moduleName: 'views/home/home-page',
      clearHistory: true,
      transition: { name: 'fade', duration: 200 }
    });
  }
}
