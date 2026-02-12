import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'sn-address-signal-form',
  templateUrl: './address-signal-form.component.html',
  styleUrls: ['./address-signal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError],
})
export class AddressSignalFormComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);

  addressForm?: FormGroup;

  ngOnInit(): void {
    this.addressForm = this.controlContainer.control as FormGroup;
  }
}
