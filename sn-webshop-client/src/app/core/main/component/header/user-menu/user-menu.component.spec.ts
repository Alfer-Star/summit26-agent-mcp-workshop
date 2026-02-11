import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { UserService } from '@shared/service/user/user.service';
import { By } from '@angular/platform-browser';
import { dataTestid } from '@shared/directive/test-id.directive';
import { createUser, Role, User } from '@shared/model/user/user';
import { provideI18NTesting } from '@transloco/provide-i18n';
import { provideRouter } from '@angular/router';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let userService: UserService;

  const queryLoginButton = () => {
    return fixture.debugElement.query(By.css(`[${dataTestid}=login-button]`));
  };
  const queryLogoutButton = () => {
    return fixture.debugElement.query(By.css(`[ ${dataTestid}=logout-button]`));
  };
  const queryRegisterButton = () => {
    return fixture.debugElement.query(By.css(`[${dataTestid}=register-button]`));
  };
  const queryMenuTriggerButton = () => {
    return fixture.debugElement.query(By.css(`[${dataTestid}=menu-trigger-button]`));
  };
  const queryAdminButton = () => {
    return fixture.debugElement.query(By.css(`[${dataTestid}=admin-button]`));
  };
  const querySettingsButton = () => {
    return fixture.debugElement.query(By.css(`[${dataTestid}=settings-button]`));
  };

  const setup = async (user?: User) => {
    await TestBed.configureTestingModule({
      providers: [provideI18NTesting(), provideRouter([])],
    }).compileComponents();

    userService = TestBed.inject(UserService);
    userService.user = user;
    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should show login and register button if user is not logged in', async () => {
    await setup(undefined);

    queryMenuTriggerButton().nativeElement.click();

    expect(queryLoginButton()).toBeDefined();
    expect(queryRegisterButton()).toBeDefined();
  });

  it('should show logout button if user is logged in', async () => {
    await setup(createUser());

    queryMenuTriggerButton().nativeElement.click();

    expect(queryLogoutButton()).toBeDefined();
  });

  it('should show settings button if user has role "User"', async () => {
    await setup(createUser({ roles: [Role.User] }));

    queryMenuTriggerButton().nativeElement.click();

    expect(querySettingsButton()).toBeDefined();
  });

  it('should show admin button if user has role "Admin"', async () => {
    await setup(createUser({ roles: [Role.Admin] }));

    queryMenuTriggerButton().nativeElement.click();

    expect(queryAdminButton()).toBeDefined();
  });

  it('should call the logout method', async () => {
    await setup(createUser({}));
    const logoutSpy = vi.spyOn(userService, 'logout');

    queryMenuTriggerButton().nativeElement.click();
    queryLogoutButton().nativeElement.click();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
