import { EventData, Page } from '@nativescript/core';
import { TestDisplayViewModel } from './test-display-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new TestDisplayViewModel(context);
}