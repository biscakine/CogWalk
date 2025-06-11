import { Observable, Frame } from '@nativescript/core';

export class TestSetupViewModel extends Observable {
  private _wordCount = 3;
  private participant: any;

  constructor(context: { participant: any }) {
    super();
    this.participant = context.participant;
  }

  get wordCount(): number {
    return this._wordCount;
  }

  selectWordCount(args: any): void {
    const button = args.object as any;
    this._wordCount = parseInt(button.text, 10);
    this.notifyPropertyChange('wordCount', this._wordCount);
  }

  onStartTest(): void {
    Frame.topmost().navigate({
      // on cible directement la page de saisie
      moduleName: 'views/test/test-input-page',
      context: {
        participantId: this.participant.id,
        wordCount:     this._wordCount
      },
      clearHistory: false,
      transition: {
        name: 'slide',
        duration: 200
      }
    });
  }
}
