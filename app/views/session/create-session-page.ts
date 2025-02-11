import { EventData, Page } from '@nativescript/core';
import { CreateSessionViewModel } from './create-session-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new CreateSessionViewModel();
}