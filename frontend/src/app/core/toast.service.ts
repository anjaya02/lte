import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
  exiting?: boolean;
}

interface ToastTimer {
  timeoutId: ReturnType<typeof setTimeout>;
  remaining: number;
  startTime: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private static readonly MAX_TOASTS = 5;
  private static readonly EXIT_ANIMATION_MS = 300;

  readonly toasts = signal<ToastMessage[]>([]);

  private nextId = 1;
  private timers = new Map<number, ToastTimer>();

  show(type: ToastType, text: string, durationMs = 5000): void {
    const id = this.nextId++;

    // Enforce max toast limit - remove oldest if at limit
    this.toasts.update((existing) => {
      let updated = [...existing, { id, type, text }];
      while (updated.filter(t => !t.exiting).length > ToastService.MAX_TOASTS) {
        const oldest = updated.find(t => !t.exiting);
        if (oldest) {
          this.clearTimer(oldest.id);
          updated = updated.filter(t => t.id !== oldest.id);
        }
      }
      return updated;
    });

    this.startTimer(id, durationMs);
  }

  dismiss(id: number): void {
    this.clearTimer(id);

    // Mark as exiting for animation
    this.toasts.update((existing) =>
      existing.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );

    // Remove after animation completes
    setTimeout(() => {
      this.toasts.update((existing) => existing.filter((t) => t.id !== id));
    }, ToastService.EXIT_ANIMATION_MS);
  }

  pauseTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.timeoutId);
      timer.remaining -= Date.now() - timer.startTime;
    }
  }

  resumeTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer && timer.remaining > 0) {
      timer.startTime = Date.now();
      timer.timeoutId = setTimeout(() => this.dismiss(id), timer.remaining);
    }
  }

  private startTimer(id: number, durationMs: number): void {
    const timeoutId = setTimeout(() => this.dismiss(id), durationMs);
    this.timers.set(id, {
      timeoutId,
      remaining: durationMs,
      startTime: Date.now(),
    });
  }

  private clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.timeoutId);
      this.timers.delete(id);
    }
  }
}
