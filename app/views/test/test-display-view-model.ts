import { Frame } from '@nativescript/core';
import { PhrasesService } from '../../services/phrases.service';
import { BaseViewModel } from '../base-view-model';

export class TestDisplayViewModel extends BaseViewModel {
    private phrasesService: PhrasesService;
    private _phrase: string = '';
    private participant: any;

    constructor(context: { wordCount: number, participant: any }) {
        super();
        this.phrasesService = new PhrasesService();
        this.participant = context.participant;
        
        try {
            this._phrase = this.phrasesService.getRandomPhrase(context.wordCount);
            this.notifyPropertyChange('phrase', this._phrase);
        } catch (error) {
            console.error('Error getting random phrase:', error);
            this._phrase = 'Error loading phrase';
            this.notifyPropertyChange('phrase', this._phrase);
        }
    }

    get phrase(): string {
        return this._phrase;
    }

    onPhraseMemorized() {
        Frame.topmost().navigate({
            moduleName: 'views/test/test-input-page',
            context: {
                phrase: this._phrase,
                participant: this.participant
            },
            clearHistory: false,
            transition: {
                name: 'slide',
                duration: 200
            }
        });
    }
}