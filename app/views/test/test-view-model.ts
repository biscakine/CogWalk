import { Frame } from '@nativescript/core';
import { PhrasesService } from '../../services/phrases.service';
import { TestService } from '../../services/test.service';
import { BaseViewModel } from '../base-view-model';

export class TestViewModel extends BaseViewModel {
    private participant: any;
    private phrasesService: PhrasesService;
    private testService: TestService;

    constructor(context: { participant: any }) {
        super();
        this.participant = context.participant;
        this.phrasesService = new PhrasesService();
        this.testService = TestService.getInstance();
    }

    onStartTest() {
        try {
            Frame.topmost().navigate({
                moduleName: 'views/test/test-display-page',
                context: {
                    participant: this.participant
                },
                clearHistory: false,
                transition: {
                    name: 'slide',
                    duration: 200
                }
            });
        } catch (error) {
            console.error('Navigation error:', error);
        }
    }
}
