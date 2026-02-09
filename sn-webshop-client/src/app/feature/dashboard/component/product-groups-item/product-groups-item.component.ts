import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from "@jsverse/transloco";
import { ProductGroup } from '@shared/model/product/product-group';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'sn-product-groups-item',
  templateUrl: './product-groups-item.component.html',
  styleUrls: ['./product-groups-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, RouterLink, TranslocoDirective, MatButton],
})
export class ProductGroupsItemComponent {
  private _productGroupUrl!: string;
  private _productGroup!: ProductGroup;

  get productGroupUrl(): string {
    return this._productGroupUrl;
  }

  get productGroup(): ProductGroup {
    return this._productGroup;
  }

  @Input() set productGroup(productGroup: ProductGroup) {
    this._productGroup = productGroup;
    this._productGroupUrl = `/${AbsoluteAppRoutes.productsId}/${productGroup.id}`;
  }
}
