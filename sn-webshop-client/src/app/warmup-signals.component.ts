import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sn-warmup-signals',
  templateUrl: 'warmup-signals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class WarmupSignalsComponent {
  readonly cities = signal(['Hamburg', 'Berlin', 'Paderborn', 'München']);
  readonly city = signal('');

  hinzufuegen() {}
}
