import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SearchComponent } from './search/search.component';
import { DashboardAnchorComponent } from './dashboard-anchor/dashboard-anchor.component';
import { LanguageSelectComponent } from './language-select/language-select.component';

@Component({
  selector: 'sn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DashboardAnchorComponent, SearchComponent, UserMenuComponent, LanguageSelectComponent],
})
export class HeaderComponent {}
