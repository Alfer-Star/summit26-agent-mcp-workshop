import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { ProductService } from '../../../../shared/service/product/product.service';
import { AsyncPipe } from '@angular/common';
import { GalleryComponent } from '../../../../shared/component/gallery/gallery.component';
import { ProductGroupsComponent } from '@dashboard/component/product-groups/product-groups.component';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GalleryComponent, ProductGroupsComponent, AsyncPipe],
})
export class DashboardComponent {
  private readonly productService = inject(ProductService);
  readonly galleryUrls$ = this.productService.productGroupGalleryItems$.pipe(
    map((galleryItems) => galleryItems.map((galleryItem) => galleryItem.imageUrl)),
  );
}
