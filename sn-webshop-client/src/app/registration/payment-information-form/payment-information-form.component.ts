import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoDirective } from "@jsverse/transloco";


@Component({
  selector: 'sn-payment-information-form',
  templateUrl: './payment-information-form.component.html',
  styleUrls: ['./payment-information-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, TranslocoDirective],
})
export class PaymentInformationFormComponent implements OnInit {
  private readonly controlContainer = inject(ControlContainer);

  paymentInformationForm?: FormGroup;

  ngOnInit(): void {
    this.paymentInformationForm = this.controlContainer.control as FormGroup;
  }
}
