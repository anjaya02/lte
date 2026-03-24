import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save } from 'lucide-angular';
import { LteApiService } from '../core/lte-api.service';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-modify-user',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './modify-user.component.html',
})
export class ModifyUserComponent {
  readonly SaveIcon = Save;

  sub = '';
  pkg = '';

  constructor(
    private lteApiService: LteApiService,
    private toastService: ToastService,
  ) {}

  handleUpdate() {
    if (!this.sub || !this.pkg) {
      this.toastService.show('error', 'Please provide both LTE SUB and LTE PKG.');
      return;
    }

    this.lteApiService
      .modifyUser({ LTE_SUB: this.sub, LTE_PKG: this.pkg })
      .subscribe({
        next: (data) => {
          if (data.result === 'success') {
            this.toastService.show('success', data.message);
            this.sub = '';
            this.pkg = '';
          } else {
            this.toastService.show('error', data.message);
          }
        },
        error: (e) => {
          console.error(e);
          this.toastService.show('error', 'Failed to update user package.');
        },
      });
  }
}
