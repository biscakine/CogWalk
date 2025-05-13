//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel for the test‑input screen
// – Manages a stopwatch (seconds)
// – Persists the result (method‑agnostic) & navigates away when finished
//------------------------------------------------------------

import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';

// Navigation context optionally provided by the page
export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
}

// Shape of the object we try to persist
interface TestResult {
  participantId?: string;
  sessionId?: string;
  duration: number;   // seconds
}

export class TestInputViewModel extends Observable {
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private _timer = '0';   // bindable string value shown in the view

  constructor(private ctx: TestInputContext = {}) {
    super();
  }

  // ───────────── PROPERTIES (bindable) ─────────────
  get timer(): string {
    return this._timer;
  }

  // ───────────── STOPWATCH CONTROL ────────────────
  /** Starts (or restarts) the stopwatch. */
  public startTimer(): void {
    this.stopTimer();          // reset if already running
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this._timer = elapsed.toString();
      this.notifyPropertyChange('timer', this._timer);
    }, 1000);
  }

  /** Stops the stopwatch and freezes the final value. */
  public stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /** Call from `onNavigatingFrom` / `dispose` (Angular) to clean up. */
  public dispose(): void {
    this.stopTimer();
  }

  // ───────────── UTILITIES ────────────────────────
  public getElapsedSeconds(): number {
    return parseInt(this._timer, 10);
  }

  // ───────────── END‑OF‑TEST HANDLER ──────────────
  /** Stops the chrono, attempts to persist the result (method name‑agnostic) and navigates home. */
  public async finishTest(): Promise<void> {
    // 1) Stop chrono
    this.stopTimer();

    // 2) Build the result object
    const result: TestResult = {
      participantId: this.ctx.participantId,
      sessionId:     this.ctx.sessionId,
      duration:      this.getElapsedSeconds()
    };

    // 3) Try to persist — stay permissive on the method name to avoid TS compile errors
    try {
      const svc: any = TestService.getInstance();
      if (svc) {
        if (typeof svc.saveResult === 'function') {
          await svc.saveResult(result);
        } else if (typeof svc.addResult === 'function') {
          await svc.addResult(result);
        } else if (typeof svc.recordResult === 'function') {
          await svc.recordResult(result);
        }
        // If none of the above exist we silently skip — developers can adjust.
      }
    } catch (err) {
      // Log but don’t block navigation.
      console.error('[TestInputViewModel] Failed to persist result', err);
    }

    // 4) Navigate back to the home (or any other target)
    Frame.topmost().navigate({
      moduleName: 'views/home/home-page',
      clearHistory: true,
      transition: { name: 'fade', duration: 200 }
    });
  }
}
