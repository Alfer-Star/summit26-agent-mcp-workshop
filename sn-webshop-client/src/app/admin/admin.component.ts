import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthHttpService } from '../service/auth/auth-http.service';
import { User } from '../model/user/user';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'sn-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatTableModule, TranslocoDirective],
})
export class AdminComponent {
  private readonly authService = inject(AuthHttpService);

  readonly displayedColumns = ['name', 'email'];
  userList: User[] = [];

  constructor() {
    this.authService.getRegisteredUsers().subscribe((userList: User[]) => (this.userList = userList));
  }
}
