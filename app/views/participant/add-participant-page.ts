import { EventData, Page } from '@nativescript/core';
import { AddParticipantViewModel } from './add-participant-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new AddParticipantViewModel(context.sessionId);
}