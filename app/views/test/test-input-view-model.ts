// app/views/test/test-input-view-model.ts
export class TestInputViewModel extends Observable {
  private startTime = 0;
  private timerInterval: ReturnType<typeof setInterval>; // ← correct

  private startTimer() {
    this.startTime = Date.now();

    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this._timer = elapsed.toString();
      this.notifyPropertyChange('timer', this._timer);
    }, 1000);
  }

  private stopTimer() {
    clearInterval(this.timerInterval);
  }
}
