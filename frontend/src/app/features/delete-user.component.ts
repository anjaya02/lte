import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Trash2, X, AlertTriangle } from 'lucide-angular';
import { LteApiService } from '../core/lte-api.service';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './delete-user.component.html',
})
export class DeleteUserComponent {
  readonly Trash2Icon = Trash2;
  readonly XIcon = X;
  readonly AlertTriangleIcon = AlertTriangle;

  sub = '';
  imsi = '';

  confirmModal = {
    show: false,
    deleteType: '',
    operation: '',
  };

  constructor(
    private lteApiService: LteApiService,
    private toastService: ToastService,
  ) {}

  handleDeleteClick(deleteType: string) {
    let operation = '';

    if (deleteType === 'SUB') {
      if (!this.sub) {
        this.toastService.show('error', 'Please provide LTE SUB.');
        return;
      }
      operation = 'DEL_SUB';
    } else if (deleteType === 'KI') {
      if (!this.imsi) {
        this.toastService.show('error', 'Please provide LTE IMSI.');
        return;
      }
      operation = 'DEL_KI';
    } else if (deleteType === 'ALL') {
      if (!this.sub || !this.imsi) {
        this.toastService.show('error', 'Please provide both LTE SUB and LTE IMSI to delete all.');
        return;
      }
      operation = 'DEL_ALL';
    }

    this.confirmModal = { show: true, deleteType, operation };
  }

  handleConfirmDelete() {
    const { operation } = this.confirmModal;
    this.confirmModal = { show: false, deleteType: '', operation: '' };

    const payload: any = { operation };

    if (operation === 'DEL_ALL') {
      payload.LTE_SUB = this.sub;
      payload.LTE_IMSI = this.imsi;
    } else if (operation === 'DEL_KI') {
      payload.LTE_IMSI = this.imsi;
    } else if (operation === 'DEL_SUB') {
      payload.LTE_SUB = this.sub;
    }

    this.lteApiService.deleteUser(payload).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.toastService.show('success', data.message);
          this.sub = '';
          this.imsi = '';
        } else {
          this.toastService.show('error', data.message);
        }
      },
      error: (e) => {
        console.error(e);
        this.toastService.show('error', 'Failed to delete user.');
      },
    });
  }
}
