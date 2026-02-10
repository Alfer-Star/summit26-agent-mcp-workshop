import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, mergeMap, shareReplay } from 'rxjs';
import { ProductHttpService } from './product-http.service';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productHttp = inject(ProductHttpService);
  private readonly transloco = inject(TranslocoService);
  private readonly _fetchProductGroups$ = new BehaviorSubject<void>(undefined);
  private readonly _fetchProductGroupGalleryItems$ = new BehaviorSubject<void>(undefined);
  private readonly _fetchProducts$ = new BehaviorSubject<
    { searchQuery?: string; productGroupId?: string } | undefined
  >(undefined);
  private readonly _fetchProduct$ = new BehaviorSubject<string | undefined>(undefined);

  readonly productGroups$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProductGroups$,
  ]).pipe(
    mergeMap(() => this.productHttp.fetchProductGroups()),
    shareReplay(1)
  );

  readonly productGroupGalleryItems$ = combineLatest([
    this._fetchProductGroupGalleryItems$,
  ]).pipe(
    mergeMap(() => this.productHttp.fetchProductGroupGalleryItems()),
    shareReplay(1)
  );

  readonly products$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProducts$,
  ]).pipe(
    mergeMap(([, fetchParams]) => {
      const { productGroupId, searchQuery } = fetchParams ?? {};
      return this.productHttp.fetchProducts(productGroupId, searchQuery);
    }),
    shareReplay(1)
  );

  readonly product$ = combineLatest([
    this.transloco.langChanges$,
    this._fetchProduct$,
  ]).pipe(
    mergeMap(([, id]) => (id ? this.productHttp.fetchProduct(id) : EMPTY)),
    shareReplay(1)
  );

  fetchProductGroups(): void {
    this._fetchProductGroups$.next();
  }

  fetchProductGroupGalleryItems(): void {
    this._fetchProductGroupGalleryItems$.next();
  }

  fetchProducts(productGroupId?: string, searchQuery?: string): void {
    this._fetchProducts$.next({ productGroupId, searchQuery });
  }

  fetchProduct(productId: string): void {
    this._fetchProduct$.next(productId);
  }
}
