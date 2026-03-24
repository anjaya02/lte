import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save } from 'lucide-angular';
import { LteApiService } from '../core/lte-api.service';

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
  status = { type: '', msg: '' };

  constructor(private lteApiService: LteApiService) {}

  handleUpdate() {
    if (!this.sub || !this.pkg) {
      this.status = { type: 'error', msg: 'Please provide both LTE SUB and LTE PKG.' };
      return;
    }

    this.lteApiService
      .modifyUser({ LTE_SUB: this.sub, LTE_PKG: this.pkg })
      .subscribe({
        next: (data) => {
          if (data.result === 'success') {
            this.status = { type: 'success', msg: data.message };
            this.sub = '';
            this.pkg = '';
          } else {
            this.status = { type: 'error', msg: data.message };
          }
        },
        error: (e) => {
          console.error(e);
          this.status = { type: 'error', msg: 'Failed to update user package.' };
        },
      });
  }
}
