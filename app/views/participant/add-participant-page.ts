import { EventData, Page } from '@nativescript/core';
import { AddParticipantViewModel } from './add-participant-view-model';

export function navigatingTo(args: EventData) {
  const page      = args.object as Page;
  const sessionId = page.navigationContext.sessionId as string;
  page.bindingContext = new AddParticipantViewModel(sessionId);
}
