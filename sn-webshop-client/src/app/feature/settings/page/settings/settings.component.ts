import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslocoDirective } from "@jsverse/transloco";

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, MatButtonModule, TranslocoDirective],
})
export class SettingsComponent {
  settingsForm!: FormGroup;
  addressFormArray?: FormArray;

  saveSettings(): void {
    //TODO Implementieren!
  }
}
