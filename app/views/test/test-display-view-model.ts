import { Observable, Frame } from '@nativescript/core';
import { PhrasesService } from '../../services/phrases.service';

export interface TestDisplayContext {
  participantId?: string;
  sessionId?:     string;
}

export class TestDisplayViewModel extends Observable {
  private svc    = new PhrasesService();
  public  phrase = '';
  private ctx: TestDisplayContext;

  constructor(context: TestDisplayContext) {
    super();
    this.ctx    = context || {};
    // À chaque entrée sur cette page, on prend la phrase suivante
    this.phrase = this.svc.getRandomPhrase();
    this.notifyPropertyChange('phrase', this.phrase);
  }

  /** Quand l’utilisateur a mémorisé, on navigue vers la saisie */
  public onPhraseMemorized(): void {
    Frame.topmost().navigate({
      moduleName: 'views/test/test-input-page',
      context: {
        participantId: this.ctx.participantId,
        sessionId:     this.ctx.sessionId,
        originalText:  this.phrase
      },
      clearHistory: false,
      transition: { name: 'slide', duration: 200 }
    });
  }
}
