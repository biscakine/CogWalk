//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel final – génère la phrase via PhrasesService
//------------------------------------------------------------

import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { PhrasesService } from '../../services/phrases.service';
import { TestResult } from '../../models/test-result.model';

// Contexte optionnel passé via navigation
export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
}

export class TestInputViewModel extends Observable {
  private phrasesSvc = new PhrasesService();

  // ---- Stopwatch ----
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // ---- Bindables ----
  public timer = '0';
  public originalText = '';
  public userInput = '';
  public showResults = false;
  public timeTaken = 0;
  public errorCount = 0;

  constructor(private ctx: TestInputContext = {}) {
    super();
    this.newTry();
  }

  // ───────── Timer control ─────────
  startTimer(): void {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timer = elapsed.toString();
      this.notifyPropertyChange('timer', this.timer);
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // ───────── Game flow ─────────
  /** Commence un nouvel essai avec une nouvelle phrase aléatoire. */
  newTry(): void {
    this.showResults = false;
    this.userInput = '';
    this.errorCount = 0;
    this.timeTaken = 0;

    // Tirer une phrase depuis le service unique
    this.originalText = this.phrasesSvc.getRandomPhrase();
    this.notifyPropertyChange('originalText', this.originalText);

    this.timer = '0';
    this.notifyPropertyChange('timer', this.timer);

    this.startTimer();
  }

  /** Appelé quand l’utilisateur valide la saisie (tap « Terminer »). */
  onFinishTest(): void {
    this.stopTimer();
    this.timeTaken = parseInt(this.timer, 10);

    // Calcul des erreurs via TestService utilitaire
    this.errorCount = TestService.getInstance().calculateErrors(
      this.originalText,
      this.userInput
    );

    // score = nombre d’erreurs brut
    const score = this.errorCount;

    const result: TestResult = {
      id: Date.now().toString(),
      participantId: this.ctx.participantId ?? '',
      sessionId: this.ctx.sessionId ?? '',
      originalText: this.originalText,
      userInput: this.userInput,
      wordCount: this.originalText.split(' ').filter(Boolean).length,
      timeTaken: this.timeTaken,
      errorCount: this.errorCount,
      timestamp: Date.now(),
      date: new Date(),
      score
    } as unknown as TestResult;

    TestService.getInstance().addResult(result);

    this.showResults = true;
    this.notifyPropertyChange('showResults', this.showResults);
  }

  dispose(): void {
    this.stopTimer();
  }
}
