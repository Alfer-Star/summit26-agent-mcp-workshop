import { AbsoluteAppRoutes } from '../../app-routes.enum';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../model/product/product';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'sn-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, RouterLink],
})
export class ProductsItemComponent {
  private _product!: Product;
  private _productUrl!: string;

  get productUrl(): string {
    return this._productUrl;
  }

  get product(): Product {
    return this._product;
  }

  @Input() set product(product: Product) {
    this._product = product;
    this._productUrl = `/${AbsoluteAppRoutes.productId}/${product.id}`;
  }
}
