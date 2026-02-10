import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
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
  readonly filteredCities = computed(() => {
    const cities = this.cities();
    return cities.filter((city) => city !== 'Hamburg');
  });

  constructor() {
    effect(() => {
      console.log(this.cities());
    });
  }

  hinzufuegen() {
    this.cities.update((cities) => {
      return [...cities, this.city()];
    });
    this.city.set('');
  }
}
