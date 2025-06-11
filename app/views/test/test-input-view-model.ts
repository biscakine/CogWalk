import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { PhrasesService } from '../../services/phrases.service';
import { TestResult } from '../../models/test-result.model';

// Contexte optionnel passé via navigation
export interface TestInputContext {
  participantId?: string;
  sessionId?:     string;
}

export class TestInputViewModel extends Observable {
  // --- services ---
  private phrasesSvc = new PhrasesService();
  private testSvc    = TestService.getInstance();

  // --- queue d’instance ---
  private phraseQueue: string[] = [];

  // ---- Stopwatch ----
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // ---- Bindables ----
  public timer        = '0';
  public originalText = '';
  public userInput    = '';
  public showResults  = false;
  public timeTaken    = 0;
  public errorCount   = 0;

  constructor(private ctx: TestInputContext = {}) {
    super();
    this.resetPhraseQueue();
    this.newTry();
  }

  /** Initialise ou réinitialise la queue avec un shuffle Fisher–Yates */
  private resetPhraseQueue(): void {
    this.phraseQueue = this.phrasesSvc
      .getAllPhrases()
      .sort(() => Math.random() - 0.5);
  }

  private startTimer(): void {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.timer = elapsed.toString();
      this.notifyPropertyChange('timer', this.timer);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** Tirez la phrase suivante de la queue ; si la queue est vide, on la réinitialise. */
  public newTry(): void {
    // Reset UI
    this.showResults  = false;
    this.userInput    = '';
    this.errorCount   = 0;
    this.timeTaken    = 0;
    this.notifyPropertyChange('showResults', this.showResults);
    this.notifyPropertyChange('userInput', this.userInput);
    this.notifyPropertyChange('errorCount', this.errorCount);
    this.notifyPropertyChange('timeTaken', this.timeTaken);

    // Si on a épuisé les 6 phrases, on reshuffle
    if (this.phraseQueue.length === 0) {
      this.resetPhraseQueue();
    }

    // Tirage sans répétition dans ce bloc de 6
    this.originalText = this.phraseQueue.shift()!;
    this.notifyPropertyChange('originalText', this.originalText);

    // Reset du timer
    this.timer = '0';
    this.notifyPropertyChange('timer', this.timer);
    this.startTimer();
  }

  /** Gère le bouton “Terminé” et la navigation arrière au second clic */
  public onFinishTest(): void {
    if (!this.showResults) {
      // 1er clic : finir le test
      this.stopTimer();
      this.timeTaken = parseInt(this.timer, 10);
      this.notifyPropertyChange('timeTaken', this.timeTaken);

      this.errorCount = this.testSvc.calculateErrors(
        this.originalText,
        this.userInput
      );
      this.notifyPropertyChange('errorCount', this.errorCount);

      // Sauvegarde
      const result: TestResult = {
        id:            Date.now().toString(),
        participantId: this.ctx.participantId ?? '',
        sessionId:     this.ctx.sessionId ?? '',
        originalText:  this.originalText,
        userInput:     this.userInput,
        wordCount:     this.originalText.split(' ').filter(Boolean).length,
        timeTaken:     this.timeTaken,
        errorCount:    this.errorCount,
        timestamp:     Date.now(),
        date:          new Date(),
        score:         this.errorCount
      } as unknown as TestResult;
      this.testSvc.addResult(result);

      // Affiche la section résultats
      this.showResults = true;
      this.notifyPropertyChange('showResults', this.showResults);
    } else {
      // 2ᵉ clic : on retourne à la page précédente
      Frame.topmost().goBack();
    }
  }

  public dispose(): void {
    this.stopTimer();
  }
}
