import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, Database, Save } from 'lucide-angular';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './add-user.component.html',
})
export class AddUserComponent {
  readonly DatabaseIcon = Database;
  readonly SaveIcon = Save;

  sub = '';
  newImsi = '';
  showDetails = false;
  
  userData = {
    lteImsi: '',
    lteIsdn: '',
    lteProfile: '',
    ltePkg: ''
  };
  
  status = { type: '', msg: '' };
  userFound = false;

  constructor(private http: HttpClient) {}

  handleGetDetails() {
    if (!this.sub) return;
    this.status = { type: '', msg: '' };
    this.showDetails = false;
    this.userFound = false;
    
    this.http.get<any>(`http://localhost:5000/api/users/search?lteSub=${this.sub}`).subscribe({
      next: (data) => {
        if (data.success) {
          this.userData = {
            lteImsi: data.data.lteImsi || '',
            lteIsdn: data.data.lteIsdn || '',
            lteProfile: data.data.lteProfile || '',
            ltePkg: data.data.ltePkg || ''
          };
          this.showDetails = true;
          this.userFound = true;
        } else {
          this.status = { type: 'error', msg: data.message };
          this.userData = { lteImsi: '', lteIsdn: '', lteProfile: '', ltePkg: '' };
          this.showDetails = false;
          this.userFound = false;
        }
      },
      error: (e) => {
        console.error(e);
        this.status = { type: 'error', msg: 'Failed to fetch details.' };
      }
    });
  }

  handleUpdate() {
    if (!this.sub) return;
    
    const payload: any = {
      lteSub: this.sub,
      lteIsdn: this.userData.lteIsdn,
      lteProfile: this.userData.lteProfile,
      ltePkg: this.userData.ltePkg
    };
    
    if (this.newImsi) {
      payload.newLteImsi = this.newImsi;
    } else {
      payload.lteImsi = this.userData.lteImsi;
    }
    
    this.http.post<any>('http://localhost:5000/api/users/add', payload).subscribe({
      next: (data) => {
        if (data.success) {
          this.status = { type: 'success', msg: data.message };
          if (this.newImsi) {
            this.userData.lteImsi = this.newImsi;
          }
          this.newImsi = '';
        } else {
          this.status = { type: 'error', msg: data.message };
        }
      },
      error: (e) => {
        console.error(e);
        this.status = { type: 'error', msg: 'Failed to update IMSI.' };
      }
    });
  }
}
