import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Search } from 'lucide-angular';

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

  private readonly API_URL = 'http://localhost:5000/api/users/search';

  constructor(private http: HttpClient) {}

  handleSearchByImsi() {
    if (!this.imsiSearch) return;
    this.http.get<any>(`${this.API_URL}?lteImsi=${this.imsiSearch}`).subscribe({
      next: (data) => {
        if (data.success) {
          this.subResult = data.data.lteSub;
          this.imsiSearchStatus = null;
        } else {
          this.subResult = '';
          this.imsiSearchStatus = data.message;
        }
      },
      error: (e) => {
        console.error(e);
        this.imsiSearchStatus = 'Failed to fetch data';
      }
    });
  }

  handleSearchBySub() {
    if (!this.subSearch) return;
    this.http.get<any>(`${this.API_URL}?lteSub=${this.subSearch}`).subscribe({
      next: (data) => {
        if (data.success) {
          this.imsiResult = data.data.lteImsi;
          this.subSearchStatus = null;
        } else {
          this.imsiResult = '';
          this.subSearchStatus = data.message;
        }
      },
      error: (e) => {
        console.error(e);
        this.subSearchStatus = 'Failed to fetch data';
      }
    });
  }
}
