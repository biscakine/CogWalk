
//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel final – génère la phrase via PhrasesService
//------------------------------------------------------------

import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { PhrasesService } from '../../services/phrases.service';
import { TestResult } from '../../models/test-result.model';

// Contexte optionnel passé via navigation
type TestInputContext = {
  participantId?: string;
  sessionId?: string;
};

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
    this.notifyPropertyChange('showResults', this.showResults);
    this.userInput = '';
    this.notifyPropertyChange('userInput', this.userInput);
    this.errorCount = 0;
    this.notifyPropertyChange('errorCount', this.errorCount);
    this.timeTaken = 0;
    this.notifyPropertyChange('timeTaken', this.timeTaken);

    // Tirer une phrase depuis le service unique
    this.originalText = this.phrasesSvc.getRandomPhrase();
    this.notifyPropertyChange('originalText', this.originalText);

    this.timer = '0';
    this.notifyPropertyChange('timer', this.timer);

    this.startTimer();
  }

  /** Appelé quand l’utilisateur valide la saisie (tap « Terminé »). */
  onFinishTest(): void {
    if (!this.showResults) {
      // Première validation : arrêter le timer et calculer le résultat
      this.stopTimer();
      this.timeTaken = parseInt(this.timer, 10);
      this.notifyPropertyChange('timeTaken', this.timeTaken);

      // Calcul des erreurs via TestService utilitaire
      this.errorCount = TestService.getInstance().calculateErrors(
        this.originalText,
        this.userInput
      );
      this.notifyPropertyChange('errorCount', this.errorCount);

      // Construction du résultat
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
        score: this.errorCount
      } as unknown as TestResult;

      // Sauvegarde du résultat
      TestService.getInstance().addResult(result);

      // Afficher les résultats
      this.showResults = true;
      this.notifyPropertyChange('showResults', this.showResults);
    } else {
      // Deuxième tap : revenir à la page précédente
      Frame.topmost().goBack();
    }
  }

  dispose(): void {
    this.stopTimer();
  }
}
