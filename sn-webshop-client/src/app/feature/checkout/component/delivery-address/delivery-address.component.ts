import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { User } from '@shared/model/user/user';
import { TestIdDirective } from "@shared/directive/test-id.directive";

@Component({
  selector: 'sn-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoDirective, TestIdDirective],
})
export class DeliveryAddressComponent {
  readonly user = input.required<User>();
}
