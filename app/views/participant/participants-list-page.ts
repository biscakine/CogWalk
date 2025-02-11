import { EventData, Page } from '@nativescript/core';
import { ParticipantsListViewModel } from './participants-list-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new ParticipantsListViewModel(context.sessionId);
}