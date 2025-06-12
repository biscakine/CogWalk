import { EventData, Page } from '@nativescript/core';
import { ParticipantResultsViewModel } from './participant-results-view-model';

export function navigatingTo(args: EventData) {
  const page = args.object as Page;
  const context = page.navigationContext; // devrait contenir `participant` objet
  page.bindingContext = new ParticipantResultsViewModel(context.participant);
}
