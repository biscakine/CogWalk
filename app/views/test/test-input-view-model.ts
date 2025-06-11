import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { TestResult }  from '../../models/test-result.model';

export interface TestInputContext {
  participantId?: string;
  sessionId?:     string;
  originalText?:  string;
}

export class TestInputViewModel extends Observable {
  public phrase     = "";
  public userInput  = "";
  public showResults= false;
  public timeTaken  = 0;
  public errorCount = 0;
  private startTime = 0;
  private timerInt: ReturnType<typeof setInterval> | null = null;

  private ctx: TestInputContext;
  private svc = TestService.getInstance();

  constructor(context: TestInputContext = {}) {
    super();
    this.ctx    = context;
    this.phrase = context.originalText || "";
    this.notifyPropertyChange('phrase', this.phrase);
    this.startTimer();
  }

  private startTimer() {
    this.stopTimer();
    this.startTime = Date.now();
    this.timerInt = setInterval(() => {
      const secs = Math.floor((Date.now() - this.startTime) / 1000);
      this.notifyPropertyChange('timeTaken', secs);
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInt) {
      clearInterval(this.timerInt);
      this.timerInt = null;
    }
  }

  public onFinishTest(): void {
    if (!this.showResults) {
      this.stopTimer();
      const errors = this.svc.calculateErrors(this.phrase, this.userInput);
      this.errorCount = errors;
      this.showResults = true;
      this.notifyPropertyChange('errorCount', errors);
      this.notifyPropertyChange('showResults', true);

      const result: TestResult = {
        id:            Date.now().toString(),
        participantId: this.ctx.participantId  || "",
        sessionId:     this.ctx.sessionId      || "",
        originalText:  this.phrase,
        userInput:     this.userInput,
        wordCount:     this.phrase.split(" ").length,
        timeTaken:     this.timeTaken,
        errorCount:    errors,
        timestamp:     Date.now(),
        date:          new Date(),
        score:         errors
      } as unknown as TestResult;
      this.svc.addResult(result);
    } else {
      // Deuxième clic = retour à la page de mémorisation
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
}
