import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../service/product/product.service';
import { ProductsItemComponent } from './products-item/products-item.component';
import { AsyncPipe } from '@angular/common';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ProductsItemComponent, AsyncPipe],
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  readonly products$ = this.productService.products$;
}
