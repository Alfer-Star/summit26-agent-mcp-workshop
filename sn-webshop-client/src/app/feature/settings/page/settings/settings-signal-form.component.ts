import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { AbsoluteAppRoutes } from '@core/app.routes.enum';
import { Address } from '@shared/model/address/address';
import { AuthHttpService } from '@shared/service/auth/auth-http.service';
import { UserService } from '@shared/service/user/user.service';
import { TranslocoDirective } from '@jsverse/transloco';
import { MatCard, MatCardActions, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { applyEach, FieldTree, form, FormField, required } from '@angular/forms/signals';
import {
  addressSchema,
  AddressSignalFormComponent,
  initAddress,
} from '@shared/component/address-form/address-signal-form.component';
import { ErrorMessagePipe } from '@shared/pipe/error-message/error-message.pipe';

@Component({
  selector: 'sn-settings-signal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatError,
    MatLabel,
    MatInput,
    MatIcon,
    MatCardActions,
    MatButton,
    MatMiniFabButton,
    FormField,
    AddressSignalFormComponent,
    ErrorMessagePipe,
  ],
  templateUrl: './settings-signal-form.component.html',
  styleUrl: './settings-signal-form.component.scss',
})
export class SettingsSignalFormComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthHttpService);
  private readonly userService = inject(UserService);

  settingsModel?: WritableSignal<SettingsUser>;

  settingsForm?: FieldTree<SettingsUser>;

  constructor() {
    const userService = this.userService;

    const user = userService.user;
    if (user) {
      this.settingsModel = signal({
        id: user.id,
        name: user.name,
        addresses: user.addresses,
      });
      this.settingsForm = form(this.settingsModel, (schemaPath) => {
        required(schemaPath.name);
        applyEach(schemaPath.addresses, addressSchema);
      });
    } else {
      this.router.navigate([AbsoluteAppRoutes.login]);
    }
  }

  addAddress(): void {
    this.settingsForm?.addresses().value.update((addresses) => [...addresses, { ...initAddress }]);
  }

  delete(index: number): void {
    this.settingsForm?.addresses().value.update((addresses) => {
      addresses.splice(index, 1);
      return [...addresses];
    });
  }

  saveSettings(): void {
    if (this.settingsForm) {
      this.authService.patch(this.settingsForm().value()).subscribe((user) => (this.userService.user = user));
    }
  }
}

interface SettingsUser {
  id: number;
  name: string;
  addresses: Address[];
}
