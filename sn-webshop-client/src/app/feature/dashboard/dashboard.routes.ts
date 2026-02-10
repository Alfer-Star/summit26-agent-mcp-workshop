import { Routes } from '@angular/router';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { dashboardResolver } from './resolver/dashboard.resolver';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      galleryUrls: dashboardResolver,
    },
  },
];
