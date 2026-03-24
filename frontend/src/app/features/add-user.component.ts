import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Database, Save } from 'lucide-angular';
import { LteApiService } from '../core/lte-api.service';

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
  showDetails = false;

  userData = {
    LTE_IMSI: '',
    LTE_ISDN: '',
    LTE_PROFILE: '',
    LTE_PKG: '',
  };

  serviceOrder = {
    CIRT_TYPE: '',
    VOICE_SO: '',
    BB_SO: '',
    AB_SO: '',
  };

  status = { type: '', msg: '' };
  userFound = false;

  constructor(private lteApiService: LteApiService) {}

  handleGetDetails() {
    if (!this.sub) return;
    this.status = { type: '', msg: '' };
    this.showDetails = false;
    this.userFound = false;

    this.lteApiService.getUserDetails({ LTE_SUB: this.sub, LTE_IMSI: '' }).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            const workOrders = data.workOrders;
            this.userData = {
              LTE_IMSI: workOrders?.LTE_IMSI || '',
              LTE_ISDN: workOrders?.LTE_ISDN || '',
              LTE_PROFILE: workOrders?.LTE_PROFILE || '',
              LTE_PKG: workOrders?.LTE_PKG || '',
            };
            if (data.serviceOrders && data.serviceOrders.length > 0) {
              this.serviceOrder = {
                CIRT_TYPE: data.serviceOrders[0].CIRT_TYPE || '',
                VOICE_SO: data.serviceOrders[0].VOICE_SO || '',
                BB_SO: data.serviceOrders[0].BB_SO || '',
                AB_SO: data.serviceOrders[0].AB_SO || '',
              };
            }
            this.showDetails = true;
            this.userFound = true;
          } else {
            this.status = { type: 'error', msg: data.message || 'User not found' };
            this.userData = { LTE_IMSI: '', LTE_ISDN: '', LTE_PROFILE: '', LTE_PKG: '' };
            this.serviceOrder = { CIRT_TYPE: '', VOICE_SO: '', BB_SO: '', AB_SO: '' };
            this.showDetails = false;
            this.userFound = false;
          }
        },
        error: (e) => {
          console.error(e);
          this.status = { type: 'error', msg: 'Failed to fetch details.' };
        },
      });
  }

  handleCreate() {
    if (!this.sub || !this.userData.LTE_IMSI) {
      this.status = { type: 'error', msg: 'Please provide LTE SUB and LTE IMSI.' };
      return;
    }

    if (this.serviceOrder.CIRT_TYPE !== 'S' && this.serviceOrder.CIRT_TYPE !== 'N') {
      this.status = {
        type: 'error',
        msg: 'Please set CIRT TYPE as S (ADD_SERVICE_ALL) or N (ADD_SOD_ALL).',
      };
      return;
    }

    // Determine operation based on CIRT_TYPE: S -> ADD_SERVICE_ALL, N -> ADD_SOD_ALL
    const operation = this.serviceOrder.CIRT_TYPE === 'S' ? 'ADD_SERVICE_ALL' : 'ADD_SOD_ALL';

    const payload: any = {
      operation,
      LTE_IMSI: this.userData.LTE_IMSI,
      LTE_SUB: this.sub,
      LTE_PROFILE: this.userData.LTE_PROFILE,
      LTE_PKG: this.userData.LTE_PKG,
    };

    if (operation === 'ADD_SERVICE_ALL') {
      payload.SID_VOICE = this.serviceOrder.VOICE_SO;
      payload.SID_BB = this.serviceOrder.BB_SO;
      payload.SID_AB = this.serviceOrder.AB_SO;
    } else {
      payload.SO_ID_VOICE = this.serviceOrder.VOICE_SO;
      payload.SO_ID_BB = this.serviceOrder.BB_SO;
      payload.SO_ID_AB = this.serviceOrder.AB_SO;
    }

    this.lteApiService.createUser(payload).subscribe({
      next: (data) => {
        if (data.result === 'success') {
          this.status = { type: 'success', msg: data.message };
        } else {
          this.status = { type: 'error', msg: data.message };
        }
      },
      error: (e) => {
        console.error(e);
        this.status = { type: 'error', msg: 'Failed to create user.' };
      },
    });
  }
}
