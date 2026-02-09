import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { User } from '@shared/model/user/user';

@Component({
  selector: 'sn-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TranslocoDirective],
})
export class DeliveryAddressComponent {
  readonly user = input.required<User>();
}
