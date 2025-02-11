import { EventData, Page } from '@nativescript/core';
import { SessionsListViewModel } from './sessions-list-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new SessionsListViewModel();
}