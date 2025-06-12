import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { PhrasesService } from '../services/phrases.service';
import { TestService } from '../services/test.service';
import { TestResult } from '../models/test-result.model';
import { v4 as uuid } from 'uuid';
import { calculateErrors } from '../utils/error-calculator';

/**
 * Context attendu:
 * {
 *   sessionId: string;
 *   participantId: string;
 *   originalText: string;
 *   wordCount: number;
 *   startTime: number;
 * }
 */
export class TestInputViewModel extends Observable {
  public userInput: string = '';
  public displayTimer: string = '00:00';
  public isNewAttemptVisible: boolean = false;
  public isCompleteVisible: boolean = false;
  private startTime: number;
  private timerInterval: any;

  constructor(private ctx: any) {
  super();
  this.phrasesSvc = PhrasesService.getInstance();
  this.testSvc    = TestService.getInstance();
  this.startTime  = ctx.startTime;
  this.startClock();
}

  private startClock(): void {
    const update = () => {
      const now = Date.now();
      const diff = now - this.startTime;
      const minutes = Math.floor(diff / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      this.displayTimer = `${minutes}:${seconds}`;
      this.notifyPropertyChange('displayTimer', this.displayTimer);
    };
    update();
    this.timerInterval = setInterval(update, 1000);
  }

  /**
   * Enregistre l'essai et affiche les actions suivantes
   */
  public onFinishAttempt(): void {
    // Arrêt du chrono
    clearInterval(this.timerInterval);

    // Calcul du temps écoulé
    const endTime = Date.now();
    const timeTaken = endTime - this.startTime;

    // Calcul du nombre d'erreurs
    const errorCount = calculateErrors(
      this.navigationContext.originalText,
      this.userInput
    );

    // Construction du résultat
    const result: TestResult = {
      id: uuid(),
      sessionId: this.navigationContext.sessionId,
      participantId: this.navigationContext.participantId,
      originalText: this.navigationContext.originalText,
      userInput: this.userInput,
      timeTaken,
      errorCount,
      timestamp: new Date().toISOString(),
    };
    this.testSvc.addResult(result);

    // Affiche les boutons Nouvel essai / Terminer le test
    this.isNewAttemptVisible = true;
    this.isCompleteVisible = true;
    this.notifyPropertyChange('isNewAttemptVisible', true);
    this.notifyPropertyChange('isCompleteVisible', true);
  }

  /**
   * Lance un nouvel essai : retour à la page de mémorisation
   */
  public onNewAttempt(): void {
    Frame.topmost().navigate({
      moduleName: 'views/test/test-display-page',
      context: {
        sessionId: this.navigationContext.sessionId,
        participantId: this.navigationContext.participantId,
        wordCount: this.navigationContext.wordCount,
      },
    });
  }

  /**
   * Termine le test : retour au détail de la session
   */
  public onCompleteTest(): void {
    Frame.topmost().navigate({
      moduleName: 'views/sessions/session-detail-page',
      context: { sessionId: this.navigationContext.sessionId },
    });
  }
}
