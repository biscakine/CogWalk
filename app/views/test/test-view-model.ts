import { Observable, Frame } from '@nativescript/core';
import { PhrasesService } from '../../services/phrases.service';
import { TestService } from '../../services/test.service';
import { TestResult } from '../../models/test-result.model';

export interface TestContext {
  participantId?: string;
  sessionId?: string;
}

export class TestViewModel extends Observable {
  private phrasesService = PhrasesService.getInstance();
  private testService    = TestService.getInstance();

  public currentPhrase = '';
  public userInput     = '';

  constructor(private ctx: TestContext = {}) {
    super();
    this.loadNewPhrase();
  }

  private loadNewPhrase(): void {
    this.currentPhrase = this.phrasesService.getRandomPhrase();
    this.notifyPropertyChange('currentPhrase', this.currentPhrase);
    this.userInput = '';
    this.notifyPropertyChange('userInput', this.userInput);
  }

  public onValidate(): void {
    // Arrêter le timer éventuel dans ce ViewModel
    // ...

    const errors = this.testService.calculateErrors(
      this.currentPhrase,
      this.userInput
    );
    const timeSec = /* calcul ou passage en contexte */ 0;

    const result: TestResult = {
      id:           Date.now().toString(),
      participantId:this.ctx.participantId ?? '',
      sessionId:    this.ctx.sessionId ?? '',
      originalText: this.currentPhrase,
      userInput:    this.userInput,
      wordCount:    this.currentPhrase.split(' ').length,
      timeTaken:    timeSec,
      errorCount:   errors,
      timestamp:    Date.now(),
      date:         new Date(),
      score:        errors
    } as unknown as TestResult;

    this.testService.addResult(result);

    // Naviguer vers la page de résultats
    Frame.topmost().navigate({
      moduleName: 'views/test/test-display-page',
      context:    result,
      clearHistory: false,
      transition: { name: 'slide', duration: 200 }
    });
  }
}
