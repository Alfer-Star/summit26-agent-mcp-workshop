import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'sn-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
})
export class LanguageSelectComponent {
  private readonly transloco = inject(TranslocoService);

  protected readonly activeLanguage = signal('');
  protected readonly languages = signal<string[]>([]);

  constructor() {
    this.activeLanguage.set(this.transloco.getActiveLang());
    this.languages.set(this.transloco.getAvailableLangs() as string[]);
  }

  changeLanguage(language: string, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.transloco.setActiveLang(language);
    this.activeLanguage.set(language);
  }
}
