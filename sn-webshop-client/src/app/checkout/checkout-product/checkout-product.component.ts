import { DetailedProduct } from '../../model/product/detailed-product';
import { ChangeDetectionStrategy, Component, Input, input, output } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { CurrencyPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'sn-checkout-product',
  templateUrl: './checkout-product.component.html',
  styleUrls: ['./checkout-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, CurrencyPipe],
})
export class CheckoutProductComponent {
  private _quantity!: number;

  readonly product = input.required<DetailedProduct>();
  @Input() set quantity(quantity: number) {
    this._quantity = quantity;
    this.quantityOptions = [0];
    for (let i = 0; i < this.product().availableQuantity; i++) {
      this.quantityOptions.push(i + 1);
    }
  }

  get quantity(): number {
    return this._quantity;
  }

  readonly quantityChange = output<number>();

  quantityOptions: number[] = [];

  onQuantitySelect(newQuantity: number): void {
    this.quantityChange.emit(this.quantity - newQuantity);
  }
}
