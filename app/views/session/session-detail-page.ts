import { EventData, Frame, Page } from '@nativescript/core';
import { SessionDetailViewModel } from './session-detail-view-model';

/**
 * Initialise le bindingContext avec SessionDetailViewModel
 */
export function navigatingTo(args: EventData) {
  const page = args.object as Page;
  const sessionId = page.navigationContext.sessionId as string;
  page.bindingContext = new SessionDetailViewModel(sessionId);
}

/**
 * Ajoute un participant à la session
 */
export function onAddParticipantTap(args: EventData) {
  const page = (args.object as any).page as Page;
  const viewModel = page.bindingContext as SessionDetailViewModel;
  Frame.topmost().navigate({
    moduleName: 'views/participants/add-participant-page',
    context: { sessionId: viewModel.sessionId }
  });
}

/**
 * Exporte les résultats de la session au format CSV par mail
 */
export function onExportCsvTap(args: EventData) {
  const page = (args.object as any).page as Page;
  const viewModel = page.bindingContext as SessionDetailViewModel;
  viewModel.sendSessionResults();
}

/**
 * Retour à l'écran précédent
 */
export function onNavBackTap(args: EventData) {
  Frame.topmost().goBack();
}
