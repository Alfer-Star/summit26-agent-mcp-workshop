import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AbsoluteAppRoutes } from '../app-routes.enum';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink],
})
export class NotFoundComponent {
  absoluteAppRoutes = AbsoluteAppRoutes;
}
