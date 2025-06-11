import { Observable, Frame } from '@nativescript/core';
import { PhrasesService }       from '../../services/phrases.service';

export interface TestDisplayContext {
  participantId?: string;
  sessionId?:     string;
}

export class TestDisplayViewModel extends Observable {
  public phrase = "";
  private svc   = new PhrasesService();
  private ctx: TestDisplayContext;

  constructor(context: TestDisplayContext) {
    super();
    this.ctx = context || {};
    // À CHAQUE navigation vers cette page, on prend la phrase suivante
    this.phrase = this.svc.getRandomPhrase();
    this.notifyPropertyChange('phrase', this.phrase);
  }

  public onPhraseMemorized(): void {
    Frame.topmost().navigate({
      moduleName: 'views/test/test-input-page',
      context: {
        participantId: this.ctx.participantId,
        sessionId:     this.ctx.sessionId,
        originalText:  this.phrase  // on l’envoie pour inference si besoin
      },
      transition: { name: 'slide', duration: 200 }
    });
  }
}
