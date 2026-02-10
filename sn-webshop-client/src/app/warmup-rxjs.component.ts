import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'sn-warmup-rxjs',
  templateUrl: 'warmup-rxjs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class WarmupRxJsComponent {
  readonly citiesList$ = of(['Hamburg', 'Berlin', 'Paderborn', 'München']);
  readonly citiesStream$ = of('Hamburg', 'Berlin', 'Paderborn', 'München');
}
