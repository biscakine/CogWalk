import { Observable, Frame } from '@nativescript/core';
import { PhrasesService } from '../../services/phrases.service';

export interface TestDisplayContext {
  originalText?: string;
  participantId?: string;
  sessionId?:   string;
  wordCount?:   number;
}

export class TestDisplayViewModel extends Observable {
  private phrasesSvc = new PhrasesService();
  public phrase = '';

  private ctx: TestDisplayContext;

  constructor(context: TestDisplayContext) {
    super();
    this.ctx = context || {};

    if (this.ctx.originalText) {
      // Si on reçoit déjà une phrase en contexte, on l'affiche
      this.phrase = this.ctx.originalText;
    } else {
      // Sinon on prend la première d'une liste mélangée
      const all = this.phrasesSvc.getAllPhrases();
      const shuffled = all.sort(() => Math.random() - 0.5);
      this.phrase = shuffled[0];
    }
    this.notifyPropertyChange('phrase', this.phrase);
  }

  /** Quand l’utilisateur a mémorisé, on passe à la saisie */
  public onPhraseMemorized(): void {
    Frame.topmost().navigate({
      moduleName: 'views/test/test-input-page',
      context: {
        participantId: this.ctx.participantId,
        sessionId:     this.ctx.sessionId,
        // on ré-expédie la même phrase pour le premier tour si besoin :
        originalText:  this.phrase
      },
      clearHistory: false,
      transition: { name: 'slide', duration: 200 }
    });
  }
}
