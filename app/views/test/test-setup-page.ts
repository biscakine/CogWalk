import { EventData, Page } from '@nativescript/core';
import { TestSetupViewModel } from './test-setup-view-model';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    const context = page.navigationContext;
    page.bindingContext = new TestSetupViewModel(context);
}