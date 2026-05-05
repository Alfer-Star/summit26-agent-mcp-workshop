import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Router } from '@angular/router';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { TranslocoDirective } from '@jsverse/transloco';
import { Address } from '@shared/model/address/address';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { UserService } from '@shared/service/user/user.service';
import { MatFormField, MatLabel, MatError, MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { AddressFormComponent } from "@shared/component/address-form/address-form.component";

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    MatCard,
    ReactiveFormsModule,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatIcon,
    MatCardActions,
    MatButton,
    MatIconButton,
    AddressFormComponent
],
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthHttpService);
  private readonly userService = inject(UserService);
  settingsForm!: FormGroup;
  addressFormArray?: FormArray;

  constructor() {
    const user = this.userService.user;
    if (user) {
      this.settingsForm = this.fb.group({
        id: [user.id],
        name: [user.name, Validators.required],
        addresses: this.fb.array(user.addresses.map((address) => this.getAddressFormGroup(address))),
      });
      this.addressFormArray = this.settingsForm.get('addresses') as FormArray;
    } else {
      this.router.navigate([AbsoluteAppRoutes.login]);
    }
  }

  addAddress(): void {
    this.addressFormArray?.push(this.getAddressFormGroup());
  }

  getAddressFormGroup(address?: Address): FormGroup {
    return this.fb.group(
      address
        ? {
            streetNr: [address.streetNr],
            zip: [address.zip],
            city: [address.city],
          }
        : {
            streetNr: [''],
            zip: [''],
            city: [''],
          },
    );
  }

  delete(index: number): void {
    this.addressFormArray?.removeAt(index);
  }

  saveSettings(): void {
    this.authService.patch(this.settingsForm?.value).subscribe((user) => (this.userService.user = user));
  }
}
