import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Search, UserPlus, UserMinus, UserCog, User } from 'lucide-angular';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
  readonly Search = Search;
  readonly UserPlus = UserPlus;
  readonly UserMinus = UserMinus;
  readonly UserCog = UserCog;
  readonly User = User;
}
