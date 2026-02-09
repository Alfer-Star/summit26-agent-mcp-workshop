import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Product } from '@shared/model/product/product';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { MatButton } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'sn-products-item',
  templateUrl: './products-item.component.html',
  styleUrls: ['./products-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, RouterLink, MatButton, TranslocoDirective],
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
