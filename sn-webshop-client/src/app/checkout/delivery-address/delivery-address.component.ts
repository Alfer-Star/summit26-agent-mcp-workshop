import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { User } from '../../model/user/user';

@Component({
  selector: 'sn-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DeliveryAddressComponent {
  readonly user = input.required<User>();
}
