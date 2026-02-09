import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RelativeAppRoutes } from '../../app-routes.enum';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: 'sn-dashboard-anchor',
  templateUrl: './dashboard-anchor.component.html',
  styleUrls: ['./dashboard-anchor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, TranslocoDirective],
})
export class DashboardAnchorComponent {
  RelativeAppRoutes = RelativeAppRoutes;
}
