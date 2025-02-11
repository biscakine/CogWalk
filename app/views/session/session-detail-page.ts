import { EventData, Page } from '@nativescript/core';
import { SessionDetailViewModel } from './session-detail-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new SessionDetailViewModel(context.sessionId);
}