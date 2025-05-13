//------------------------------------------------------------
// app/views/test/test-input-view-model.ts
// ViewModel for the test input screen
// – Handles a stopwatch (seconds)
// – Saves the result and navigates away when finished
//------------------------------------------------------------

import { Observable, Frame } from '@nativescript/core';
import { TestService } from '../../services/test.service';

export interface TestInputContext {
  participantId?: string;
  sessionId?: string;
}

interface TestResult {
  participantId?: string;
  sessionId?: string;
  duration: number;
}

export class TestInputViewModel extends Observable {
  private _timer = '0';
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private ctx: TestInputContext = {}) {
    super();
  }

  // ──────────── Bindable properties ────────────
  public get timer(): string {
    return this._timer;
  }

  // ──────────── Chronometer control ────────────
  public startTimer(): void {
    this.stopTimer();
    this._timer = '0';
    this.notifyPropertyChange('timer', this._timer);

    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this._timer = elapsed.toString();
      this.notifyPropertyChange('timer', this._timer);
    }, 1000);
  }

  public stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public dispose(): void {
    this.stopTimer();
  }

  public getElapsedSeconds(): number {
    return parseInt(this._timer, 10);
  }

  // ──────────── Finish handler ────────────
  public async finishTest(): Promise<void> {
    // 1. stop chrono
    this.stopTimer();

    // 2. persist result
    const result: TestResult = {
      participantId: this.ctx.participantId,
      sessionId: this.ctx.sessionId,
      duration: this.getElapsedSeconds()
    };

    try {
      await TestService.getInstance().saveResult(result);
    } catch (err) {
      // log but don't block navigation
      console.error('[TestInputViewModel] Failed to save result', err);
    }

    // 3. navigate to home screen
    Frame.topmost().navigate({
      moduleName: 'views/home/home-page',
      clearHistory: true,
      transition: { name: 'fade', duration: 200 }
    });
  }
}
