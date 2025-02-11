import { Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';
import { TestResult } from '../../models/test-result.model';
import { Participant } from '../../models/participant.model';
import { BaseViewModel } from '../base-view-model';
import { formatFrenchDateTime } from '../../utils/date-formatter';

interface ResultViewModel extends TestResult {
    formattedDate: string;
    tryNumber: number;
}

export class ParticipantResultsViewModel extends BaseViewModel {
    private testService: TestService;
    private _results: ResultViewModel[] = [];
    private _participantName: string = '';
    private participant: Participant;

    constructor(participant: Participant) {
        super();
        this.testService = TestService.getInstance();
        this.participant = participant;
        this._participantName = `${participant.firstName} ${participant.lastName}`;
        this.loadResults();
    }

    get results(): ResultViewModel[] {
        return this._results;
    }

    get participantName(): string {
        return this._participantName;
    }

    private loadResults() {
        const participantId = `${this.participant.firstName}_${this.participant.lastName}`;
        const allResults = this.testService.getResults();
        
        // Filter and sort results by timestamp in descending order
        const sortedResults = allResults
            .filter(result => result.participantId === participantId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        // Add try number to each result
        this._results = sortedResults.map((result, index) => ({
            ...result,
            formattedDate: formatFrenchDateTime(new Date(result.timestamp)),
            tryNumber: sortedResults.length - index // Reverse the index to start from the highest number
        }));

        this.notifyPropertyChange('results', this._results);
    }

    onNewTest() {
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

    onGoHome() {
        Frame.topmost().navigate({
            moduleName: 'views/home/home-page',
            clearHistory: true,
            transition: {
                name: 'fade',
                duration: 200
            }
        });
    }
}