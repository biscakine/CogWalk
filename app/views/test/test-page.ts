import { EventData, Page } from '@nativescript/core';
import { TestViewModel } from './test-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new TestViewModel(context);
}