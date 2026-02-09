import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProductService } from '../../service/product/product.service';
import { ProductGroupsItemComponent } from '../product-groups-item/product-groups-item.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'sn-product-groups',
  templateUrl: './product-groups.component.html',
  styleUrls: ['./product-groups.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ProductGroupsItemComponent, AsyncPipe],
})
export class ProductGroupsComponent {
  private readonly service = inject(ProductService);
  readonly productGroups$ = this.service.productGroups$;
}
