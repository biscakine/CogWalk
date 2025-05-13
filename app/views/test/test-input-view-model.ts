// app/views/test/test-input-view-model.ts
//------------------------------------------------------------
// ViewModel pour l’écran de saisie de test
// – Gestion d’un chronomètre (en secondes)
// – Notification NativeScript (Observable)
//------------------------------------------------------------
import { Observable } from '@nativescript/core';

// Contexte facultatif passé par la page (navigationContext)
export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
}

export class TestInputViewModel extends Observable {
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private _timer = '0';            // valeur affichée liée à la vue

  constructor(private ctx: TestInputContext = {}) {
    super();
  }

  // ──────────── PROPRIÉTÉS BINDABLES ────────────
  get timer(): string {
    return this._timer;
  }

  // ──────────── CONTRÔLE DU CHRONO ─────────────
  /** Démarre (ou redémarre) le chronomètre. */
  public startTimer(): void {
    this.stopTimer();              // reset éventuel
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this._timer = elapsed.toString();
      this.notifyPropertyChange('timer', this._timer);
    }, 1000);
  }

  /** Arrête le chronomètre et fixe la valeur finale. */
  public stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** À appeler dans `onNavigatingFrom` ou `ngOnDestroy`. */
  public dispose(): void {
    this.stopTimer();
  }

  // ──────────── AUTRES MÉTHODES UTILITAIRES ─────
  public getElapsedSeconds(): number {
    return parseInt(this._timer, 10);
  }
}
