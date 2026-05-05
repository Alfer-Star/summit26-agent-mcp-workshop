import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'sn-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError],
})
export class AddressFormComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);

  addressForm?: FormGroup;

  ngOnInit(): void {
    this.addressForm = this.controlContainer.control as FormGroup;
  }
}
