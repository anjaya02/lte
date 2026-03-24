import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast-item"
        [ngClass]="toast.type === 'error' ? 'toast-error' : 'toast-success'"
      >
        <span>{{ toast.text }}</span>
        <button class="toast-close" (click)="toastService.dismiss(toast.id)">×</button>
      </div>
    </div>
  `,
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
