import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast-item"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-exiting]="toast.exiting"
        role="alert"
        (mouseenter)="toastService.pauseTimer(toast.id)"
        (mouseleave)="toastService.resumeTimer(toast.id)"
      >
        <span class="toast-icon" aria-hidden="true">{{ toast.type === 'success' ? '✔' : '✘' }}</span>
        <span>{{ toast.text }}</span>
        <button
          class="toast-close"
          (click)="toastService.dismiss(toast.id)"
          aria-label="Dismiss notification"
        >×</button>
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
