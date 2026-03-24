import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  private nextId = 1;

  show(type: ToastType, text: string, durationMs = 3000): void {
    const id = this.nextId++;
    this.toasts.update((existing) => [...existing, { id, type, text }]);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((existing) => existing.filter((toast) => toast.id !== id));
  }
}
