import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { PhrasesService } from '../../services/phrases.service';
import { TestResult } from '../../models/test-result.model';

export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
}

export class TestInputViewModel extends Observable {
  private phrasesSvc = new PhrasesService();
  private testSvc    = TestService.getInstance();

  // Queue locale pour 6 phrases uniques
  private phraseQueue: string[] = [];

  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

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

  /** Shuffle Fisher–Yates initial de la queue */
  private resetPhraseQueue(): void {
    const list = this.phrasesSvc.getAllPhrases();
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    this.phraseQueue = list;
    console.log('[TestInput] Reset queue:', this.phraseQueue);
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

  /** Nouvel essai : tire une phrase sans doublon sur 6 puis reset si nécessaire */
  public newTry(): void {
    this.showResults = false;
    this.userInput = '';
    this.errorCount = 0;
    this.timeTaken = 0;
    this.notifyPropertyChange('showResults', this.showResults);
    this.notifyPropertyChange('userInput', this.userInput);
    this.notifyPropertyChange('errorCount', this.errorCount);
    this.notifyPropertyChange('timeTaken', this.timeTaken);

    if (this.phraseQueue.length === 0) {
      this.resetPhraseQueue();
    }

    this.originalText = this.phraseQueue.shift()!;
    console.log('[TestInput] Shuffled phrase:', this.originalText, '; Remaining:', this.phraseQueue);
    this.notifyPropertyChange('originalText', this.originalText);

    this.timer = '0';
    this.notifyPropertyChange('timer', this.timer);
    this.startTimer();
  }

  /** Valider la saisie ou revenir en arrière */
  public onFinishTest(): void {
    if (!this.showResults) {
      this.stopTimer();
      this.timeTaken = parseInt(this.timer, 10);
      this.notifyPropertyChange('timeTaken', this.timeTaken);

      this.errorCount = this.testSvc.calculateErrors(
        this.originalText,
        this.userInput
      );
      this.notifyPropertyChange('errorCount', this.errorCount);

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
      this.showResults = true;
      this.notifyPropertyChange('showResults', this.showResults);
    } else {
      Frame.topmost().goBack();
    }
  }

  public dispose(): void {
    this.stopTimer();
  }
}
