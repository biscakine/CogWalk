import { Observable } from '@nativescript/core';
import { PhrasesService } from '../../services/phrases.service';
import { TestService } from '../../services/test.service';
import { TestResult } from '../../models/test-result.model';

export interface TestDisplayContext {
  participantId?: string;
  sessionId?: string;
}

export class TestDisplayViewModel extends Observable {
  private phrasesService = PhrasesService.getInstance();
  private testService   = TestService.getInstance();

  public phrase     = '';
  public userInput  = '';
  public timeTaken  = 0;
  public errorCount = 0;

  constructor(private ctx: TestDisplayContext) {
    super();

    // Récupérer les données passées en navigation
    if (ctx) {
      this.phrase    = ctx['originalText'] || this.phrasesService.getRandomPhrase();
      this.userInput = ctx['userInput'] || '';
      this.timeTaken = ctx['timeTaken'] || 0;
      this.errorCount= ctx['errorCount'] || 0;

      this.notifyPropertyChange('phrase', this.phrase);
      this.notifyPropertyChange('userInput', this.userInput);
      this.notifyPropertyChange('timeTaken', this.timeTaken);
      this.notifyPropertyChange('errorCount', this.errorCount);
    }
  }
}
