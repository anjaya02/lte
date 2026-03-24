import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';
import { LteApiService } from '../core/lte-api.service';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-search-user',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './search-user.component.html',
})
export class SearchUserComponent {
  readonly SearchIcon = Search;

  imsiSearch = '';
  subResult = '';

  subSearch = '';
  imsiResult = '';

  constructor(
    private lteApiService: LteApiService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  handleSearchByImsi() {
    if (!this.imsiSearch) return;
    this.lteApiService.listUser({ LTE_SUB: '', LTE_IMSI: this.imsiSearch }).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.subResult = data.message;
          this.cdr.detectChanges();
          this.toastService.show('success', 'Search completed successfully.');
        } else {
          this.subResult = '';
          this.toastService.show('error', data.message);
        }
      },
      error: (e) => {
        console.error(e);
        this.toastService.show('error', 'Failed to fetch data');
      },
    });
  }

  handleSearchBySub() {
    if (!this.subSearch) return;
    this.lteApiService.listUser({ LTE_SUB: this.subSearch, LTE_IMSI: '' }).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.imsiResult = data.message;
          this.cdr.detectChanges();
          this.toastService.show('success', 'Search completed successfully.');
        } else {
          this.imsiResult = '';
          this.toastService.show('error', data.message);
        }
      },
      error: (e) => {
        console.error(e);
        this.toastService.show('error', 'Failed to fetch data');
      },
    });
  }
}
