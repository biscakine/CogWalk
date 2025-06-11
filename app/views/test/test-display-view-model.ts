import { Observable, Frame } from '@nativescript/core';

export interface TestDisplayContext {
  originalText?: string;
  participantId?: string;
  sessionId?: string;
  wordCount?: number;
}

export class TestDisplayViewModel extends Observable {
  public phrase: string = '';

  private ctx: TestDisplayContext;

  constructor(context: TestDisplayContext) {
    super();
    this.ctx = context || {};
    // Récupère la phrase à mémoriser depuis le contexte
    this.phrase = this.ctx.originalText || '';
    this.notifyPropertyChange('phrase', this.phrase);
  }

  /** Appelé quand l’utilisateur clique sur “J’ai mémorisé” */
  public onPhraseMemorized(): void {
    Frame.topmost().navigate({
      moduleName: 'views/test/test-input-page',
      context: {
        participantId: this.ctx.participantId,
        sessionId:     this.ctx.sessionId,
        wordCount:     this.ctx.wordCount
      },
      clearHistory: false,
      transition: {
        name: 'slide',
        duration: 200
      }
    });
  }
}
