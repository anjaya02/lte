import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search } from 'lucide-angular';
import { LteApiService } from '../core/lte-api.service';

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
  imsiSearchStatus: string | null = null;

  subSearch = '';
  imsiResult = '';
  subSearchStatus: string | null = null;

  constructor(private lteApiService: LteApiService) {}

  handleSearchByImsi() {
    if (!this.imsiSearch) return;
    this.lteApiService.listUser({ LTE_SUB: '', LTE_IMSI: this.imsiSearch }).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.subResult = data.message;
          this.imsiSearchStatus = null;
        } else {
          this.subResult = '';
          this.imsiSearchStatus = data.message;
        }
      },
      error: (e) => {
        console.error(e);
        this.imsiSearchStatus = 'Failed to fetch data';
      },
    });
  }

  handleSearchBySub() {
    if (!this.subSearch) return;
    this.lteApiService.listUser({ LTE_SUB: this.subSearch, LTE_IMSI: '' }).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.imsiResult = data.message;
          this.subSearchStatus = null;
        } else {
          this.imsiResult = '';
          this.subSearchStatus = data.message;
        }
      },
      error: (e) => {
        console.error(e);
        this.subSearchStatus = 'Failed to fetch data';
      },
    });
  }
}
