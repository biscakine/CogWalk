import { Observable, Frame } from '@nativescript/core';

export class TestSetupViewModel extends Observable {
    private _wordCount: number = 3;
    private participant: any;

    constructor(context: { participant: any }) {
        super();
        this.participant = context.participant;
    }

    get wordCount(): number {
        return this._wordCount;
    }

    selectWordCount(args: any) {
        const button = args.object;
        this._wordCount = parseInt(button.text, 10);
        this.notifyPropertyChange('wordCount', this._wordCount);
    }

    onStartTest() {
        Frame.topmost().navigate({
            moduleName: 'views/test/test-display-page',
            context: {
                wordCount: this._wordCount,
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
