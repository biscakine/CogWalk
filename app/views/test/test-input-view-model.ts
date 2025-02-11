import { Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { SessionService } from '../../services/session.service';
import { BaseViewModel } from '../base-view-model';
import { TestResult } from '../../models/test-result.model';

export class TestInputViewModel extends BaseViewModel {
    private testService: TestService;
    private sessionService: SessionService;
    private _userInput: string = '';
    private _timer: string = '0';
    private _timeTaken: number = 0;
    private _errorCount: number = 0;
    private _showResults: boolean = false;
    private timerInterval: number;
    private startTime: number;
    private originalPhrase: string;
    private participant: any;

    constructor(context: { phrase: string, participant: any }) {
        super();
        this.testService = TestService.getInstance();
        this.sessionService = SessionService.getInstance();
        this.originalPhrase = context.phrase;
        this.participant = context.participant;
        this.startTimer();
    }

    get userInput(): string { return this._userInput; }
    get timer(): string { return this._timer; }
    get timeTaken(): number { return this._timeTaken; }
    get errorCount(): number { return this._errorCount; }
    get showResults(): boolean { return this._showResults; }

    set userInput(value: string) {
        if (this._userInput !== value) {
            this._userInput = value;
            this.notifyPropertyChange('userInput', value);
        }
    }

    onFinishTest() {
        this.stopTimer();
        this._errorCount = this.testService.calculateErrors(this.originalPhrase, this._userInput);
        this._showResults = true;

        const result: TestResult = {
            id: Date.now().toString(),
            participantId: `${this.participant.firstName}_${this.participant.lastName}`,
            originalText: this.originalPhrase,
            userInput: this._userInput,
            wordCount: this.originalPhrase.split(' ').length,
            timeTaken: this._timeTaken,
            errorCount: this._errorCount,
            timestamp: new Date()
        };

        this.testService.addResult(result);
        this.notifyPropertyChanges();
    }

    onNewTry() {
        Frame.topmost().navigate({
            moduleName: 'views/test/test-page',
            context: { participant: this.participant },
            clearHistory: false,
            transition: {
                name: 'slide',
                duration: 200
            }
        });
    }

    onFinishSession() {
        Frame.topmost().navigate({
            moduleName: 'views/participant/participant-results-page',
            context: { participant: this.participant },
            clearHistory: true,
            transition: {
                name: 'slide',
                duration: 200
            }
        });
    }

    private startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this._timer = elapsed.toString();
            this.notifyPropertyChange('timer', this._timer);
        }, 1000);
    }

    private stopTimer() {
        clearInterval(this.timerInterval);
        this._timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    }

    private notifyPropertyChanges() {
        this.notifyPropertyChange('showResults', this._showResults);
        this.notifyPropertyChange('timeTaken', this._timeTaken);
        this.notifyPropertyChange('errorCount', this._errorCount);
    }
}