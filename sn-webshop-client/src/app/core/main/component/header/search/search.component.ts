import { AbsoluteAppRoutes } from '../../../../app.routes.enum';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '@shared/service/product/product.service';

@Component({
  selector: 'sn-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule, TranslocoDirective],
})
export class SearchComponent {
  static readonly SEARCH_DEBOUNCE_MS = 500;
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly control = new FormControl();

  constructor() {
    this.control.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(SearchComponent.SEARCH_DEBOUNCE_MS), takeUntilDestroyed())
      .subscribe(this.search.bind(this));
  }

  search(): void {
    this.productService.fetchProducts(undefined, this.control.value);
    this.router.navigate([AbsoluteAppRoutes.productsSearch]);
  }
}
