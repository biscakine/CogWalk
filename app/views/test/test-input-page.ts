import { EventData, Page } from '@nativescript/core';
import { TestInputViewModel } from './test-input-view-model';

export function navigatingTo(args: EventData) {
  const page = args.object as Page;
  const ctx  = page.navigationContext;        // { participantId, sessionId, … }
  page.bindingContext = new TestInputViewModel(ctx);
}

export function navigatingFrom(args: EventData) {
  const page = args.object as Page;
  (page.bindingContext as TestInputViewModel).dispose();
}
