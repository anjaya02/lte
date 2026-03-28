import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import {
  EventMessage,
  EventType,
  AuthenticationResult,
  InteractionStatus,
} from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly router = inject(Router);
  private readonly destroying$ = new Subject<void>();

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoggedIn = signal(false);
  protected readonly displayName = signal<string | null>(null);
  protected readonly currentYear = new Date().getFullYear();

  ngOnInit(): void {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS,
        ),
        takeUntil(this.destroying$),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        if (payload?.account) {
          this.msalService.instance.setActiveAccount(payload.account);
          this.updateLoginStatus();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(takeUntil(this.destroying$))
      .subscribe((status: InteractionStatus) => {
        this.isLoading.set(status !== InteractionStatus.None);
      });

    this.updateLoginStatus();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }

  private updateLoginStatus(): void {
    const accounts = this.msalService.instance.getAllAccounts();

    if (accounts.length > 0) {
      if (!this.msalService.instance.getActiveAccount()) {
        this.msalService.instance.setActiveAccount(accounts[0]);
      }

      const activeAccount = this.msalService.instance.getActiveAccount();
      this.isLoggedIn.set(true);
      this.displayName.set(activeAccount?.name || activeAccount?.username || 'User');
      this.router.navigate(['/']);
    } else {
      this.isLoggedIn.set(false);
      this.displayName.set(null);
    }
  }

  login(): void {
    this.errorMessage.set(null);
    this.isLoading.set(true);
    this.msalService.loginRedirect({ scopes: ['user.read'] });
  }

  logout(): void {
    const activeAccount = this.msalService.instance.getActiveAccount();
    this.msalService.logoutRedirect({ account: activeAccount });
  }
}
