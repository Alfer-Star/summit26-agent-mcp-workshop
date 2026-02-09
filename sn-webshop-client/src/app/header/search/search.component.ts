import { AbsoluteAppRoutes } from '../../app-routes.enum';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  selector: 'sn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, TranslocoDirective],
})
export class SearchComponent {
  private readonly router = inject(Router);

  readonly control = new FormControl();

  search(): void {
    this.router.navigate([AbsoluteAppRoutes.productsSearch]);
  }

  searchClick(mouseEvent: MouseEvent): void {
    this.haltEvent(mouseEvent);
    this.search();
  }

  private haltEvent(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
