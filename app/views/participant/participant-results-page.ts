import { EventData, Page } from '@nativescript/core';
import { ParticipantResultsViewModel } from './participant-results-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new ParticipantResultsViewModel(context.participant);
}