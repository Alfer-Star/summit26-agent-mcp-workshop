import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from '@jsverse/transloco';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { User } from '@shared/model/user/user';

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
