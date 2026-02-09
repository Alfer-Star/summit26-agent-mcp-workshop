import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sn-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectComponent {
}
