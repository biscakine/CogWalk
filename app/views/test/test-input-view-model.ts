//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel final – tire 6 phrases sans répétition via un Set
//------------------------------------------------------------
import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { PhrasesService } from '../../services/phrases.service';
import { TestResult } from '../../models/test-result.model';

export interface TestInputContext {
  participantId?: string;
  sessionId?:     string;
  originalText?:  string;
}

export class TestInputViewModel extends Observable {
  private phrasesSvc   = new PhrasesService();
  private testSvc      = TestService.getInstance();
  private allPhrases   = this.phrasesSvc.getAllPhrases();
  private usedPhrases  = new Set<string>();

  // Stopwatch
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  // Bindables
  public timer        = '0';
  public originalText = '';
  public userInput    = '';
  public showResults  = false;
  public timeTaken    = 0;
  public errorCount   = 0;

  private ctx: TestInputContext;

  constructor(context: TestInputContext = {}) {
    super();
    this.ctx = context;
    // Si on reçoit une phrase en contexte, on l'utilise
    if (this.ctx.originalText) {
      this.usedPhrases.add(this.ctx.originalText);
      this.originalText = this.ctx.originalText;
      this.notifyPropertyChange('originalText', this.originalText);
    }
    this.newTry();
  }

  private startTimer(): void {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const secs = Math.floor((Date.now() - this.startTime) / 1000);
      this.timer = secs.toString();
      this.notifyPropertyChange('timer', this.timer);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** Lance un nouvel essai : choisit une phrase unique dans le cycle de 6 */
  public newTry(): void {
    // Réinitialiser l'affichage
    this.showResults = false;
    this.notifyPropertyChange('showResults', this.showResults);
    this.userInput   = '';
    this.notifyPropertyChange('userInput', this.userInput);
    this.errorCount  = 0;
    this.notifyPropertyChange('errorCount', this.errorCount);
    this.timeTaken   = 0;
    this.notifyPropertyChange('timeTaken', this.timeTaken);

    // Si toutes les phrases ont été utilisées, réinitialiser le Set
    if (this.usedPhrases.size === this.allPhrases.length) {
      this.usedPhrases.clear();
    }

    // Tirer aléatoirement une phrase non encore utilisée
    let phrase: string;
    do {
      const idx = Math.floor(Math.random() * this.allPhrases.length);
      phrase = this.allPhrases[idx];
    } while (this.usedPhrases.has(phrase));

    // Marquer comme utilisée et afficher
    this.usedPhrases.add(phrase);
    this.originalText = phrase;
    this.notifyPropertyChange('originalText', this.originalText);

    // Démarrer le chrono
    this.timer = '0';
    this.notifyPropertyChange('timer', this.timer);
    this.startTimer();
  }

  /** Valide la saisie ou navigue vers la mémorisation si déjà en résultats */
  public onFinishTest(): void {
    if (!this.showResults) {
      // Premier clic : arrêter le timer et calculer
      this.stopTimer();
      this.timeTaken = parseInt(this.timer, 10);
      this.notifyPropertyChange('timeTaken', this.timeTaken);

      this.errorCount = this.testSvc.calculateErrors(
        this.originalText,
        this.userInput
      );
      this.notifyPropertyChange('errorCount', this.errorCount);

      // Sauvegarder le résultat
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

      // Afficher résultats
      this.showResults = true;
      this.notifyPropertyChange('showResults', this.showResults);
    } else {
      // Deuxième clic : revenir à mémoire (nouvel essai) via navigation
      Frame.topmost().navigate({
        moduleName: 'views/test/test-display-page',
        context: {
          participantId: this.ctx.participantId,
          sessionId:     this.ctx.sessionId
        },
        clearHistory: false,
        transition: { name: 'slide', duration: 200 }
      });
    }
  }

  /** Nettoyage à la navigation away */
  public dispose(): void {
    this.stopTimer();
  }
}
