import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Trash2, X, AlertTriangle } from 'lucide-angular';

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
  status = { type: '', msg: '' };

  confirmModal = {
    show: false,
    deleteType: '',
    operation: '',
  };

  private readonly API_URL = 'http://localhost:5000/api/users/delete';

  constructor(private http: HttpClient) {}

  handleDeleteClick(deleteType: string) {
    let operation = '';

    if (deleteType === 'SUB') {
      if (!this.sub) {
        this.status = { type: 'error', msg: 'Please provide LTE SUB.' };
        return;
      }
      operation = 'DEL_SUB';
    } else if (deleteType === 'KI') {
      if (!this.imsi) {
        this.status = { type: 'error', msg: 'Please provide LTE IMSI.' };
        return;
      }
      operation = 'DEL_KI';
    } else if (deleteType === 'ALL') {
      if (!this.sub || !this.imsi) {
        this.status = {
          type: 'error',
          msg: 'Please provide both LTE SUB and LTE IMSI to delete all.',
        };
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

    this.http.post<any>(this.API_URL, payload).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.status = { type: 'success', msg: data.message };
          this.sub = '';
          this.imsi = '';
        } else {
          this.status = { type: 'error', msg: data.message };
        }
      },
      error: (e) => {
        console.error(e);
        this.status = { type: 'error', msg: 'Failed to delete user.' };
      },
    });
  }
}
