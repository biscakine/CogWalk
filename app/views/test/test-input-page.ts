import { EventData, Page } from '@nativescript/core';
import { TestInputViewModel } from './test-input-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new TestInputViewModel(context);
}