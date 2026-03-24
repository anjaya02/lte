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
    url: ''
  };

  constructor(private http: HttpClient) {}

  handleDeleteClick(deleteType: string) {
    let url = '';

    if (deleteType === 'SUB') {
      if (!this.sub) {
        this.status = { type: 'error', msg: 'Please provide LTE SUB.' };
        return;
      }
      url = `http://localhost:5000/api/users/sub/${encodeURIComponent(this.sub)}`;
    } else if (deleteType === 'KI') {
      if (!this.imsi) {
        this.status = { type: 'error', msg: 'Please provide LTE IMSI.' };
        return;
      }
      url = `http://localhost:5000/api/users/imsi/${encodeURIComponent(this.imsi)}`;
    } else if (deleteType === 'ALL') {
      if (!this.sub || !this.imsi) {
        this.status = {
          type: 'error',
          msg: 'Please provide both LTE SUB and LTE IMSI to delete all.'
        };
        return;
      }
      url = `http://localhost:5000/api/users/all?sub=${encodeURIComponent(this.sub)}&imsi=${encodeURIComponent(this.imsi)}`;
    }

    this.confirmModal = { show: true, deleteType, url };
  }

  handleConfirmDelete() {
    const { url } = this.confirmModal;
    this.confirmModal = { show: false, deleteType: '', url: '' };

    this.http.delete<any>(url).subscribe({
      next: (data) => {
        if (data.success) {
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
      }
    });
  }
}
