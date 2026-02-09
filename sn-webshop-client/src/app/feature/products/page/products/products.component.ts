import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProductsItemComponent } from '@products/component/products-item/products-item.component';
import { ProductService } from '@shared/service/product/product.service';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ProductsItemComponent, AsyncPipe, TranslocoDirective],
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  readonly products$ = this.productService.products$;
}
