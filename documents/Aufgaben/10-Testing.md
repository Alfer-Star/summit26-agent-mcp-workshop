# Angular für Fortgeschrittene - Aufgabe Testing

- [Angular für Fortgeschrittene - Aufgabe Jest Unit Testing](#Angular-für-fortgeschrittene---lab-1)
  - [1. Aufgabe](#1-anlegen-tests-für-einen-einfachen-service)
  - [2. Aufgabe](#2-anlegen-tests-für-einen-komplexeren-service)
  - [3. Aufgabe](#3-testen-von-pipes)
  - [4. Aufgabe](#4-testen-von-components)

## 1. Anlegen von Tests für einen einfachen Service

Der Service _StorageService_ hat aktuell noch eine leere Testsuite.<br>
Lege einen Testfall an, der

- einen Token und User im Storage speichert
- nur einen Token speichert
- den Storage leert

Prüfen, ob die Ergebnisse gespeichert wurden, kannst du über die "getToken", "getRefreshToken" und "getUser" Methoden des Service.

Hinweis: Hier sind keine asynchronen Operationen zu berücksichtigen.

<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt**

Setzt die Testsuite auf

```bash
describe('StorageService', () => {
  let service: StorageService;
  const accessToken = 'ACCESS_TOKEN';
  const refreshToken = 'REFRESH_TOKEN';
  const user = createUser();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    service.clearStorage();
  });
});
```

Wichtig: Da wir in den Tests access- und refreshToken sowie user mehrfach nutzen werden, ergibt es Sinn diese in der ganzen Suite bekannt zu machen.<br>
Da der Storage nicht automatisch am Ende eines Testruns geleert wird, benötigen wir die afterEach() Methode.

**2. Schritt**

Die ersten Testfälle anlegen.
Dabei darauf achten, dass die Zustände vorher und nacher geprüft werden, damit gehen wir auf Nummer Sicher, dass die Attribute korrekt geändert worden sind.

```bash
it('should save token and user', () => {
  expect(service.getToken()).toBe(null);
  expect(service.getRefreshToken()).toBe(null);
  expect(service.getUser()).toBe(undefined);

  service.saveTokenAndUser({
    accessToken,
    refreshToken,
    user,
  });

  expect(service.getToken()).toEqual(accessToken);
  expect(service.getRefreshToken()).toEqual(refreshToken);
  expect(service.getUser()).toEqual(user);
});
```

```bash
it('should save token', () => {
  expect(service.getToken()).toBe(null);
  service.saveToken(accessToken);
  expect(service.getToken()).toEqual(accessToken);
});
```

```bash
it('should clear storage', () => {
  service.saveTokenAndUser({
    accessToken,
    refreshToken,
    user,
  });

  service.clearStorage();
  expect(service.getToken()).toBe(null);
  expect(service.getRefreshToken()).toBe(null);
  expect(service.getUser()).toBe(undefined);
});
```

</details>

## 2. Anlegen von Tests für einen komplexeren Service 

Der Service _CheckoutService_ hat aktuell noch eine leere Testsuite.<br>
Lege für alle öffentlichen Methoden in dem Service einen Testfall an.<br>

Hinweise:

- Verwende das async Keyword für Testfälle, die mit Observables zu tun haben.
  - Dafür musst du die Observables umwandeln in Promises - mithilfe des "firstValueFrom"-Operators.
  - Mit einem Spy kannst du prüfen ob der CheckoutHttpService an der jeweiligen Methode aufgerufen wird
- Für die "removeFromBasket"-Methode bieten sich parametrisierte Tests an

<details>
<summary>Lösung anzeigen</summary>
<p>

```typescript

describe('CheckoutService', () => {
  let service: CheckoutService;
  let checkoutHttp: CheckoutHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting()],
    });
    service = TestBed.inject(CheckoutService);
    checkoutHttp = TestBed.inject(CheckoutHttpService);
  });

  it('should add new product to basket', () => {
    const product = createDetailedProduct();

    service.addToBasket(product, 1);

    expect(service.productsInBasket()).toHaveLength(1);
    expect(service.productsInBasket()[0]).toEqual({
      product,
      quantity: 1,
    });
  });

  it('should add existing product to basket', () => {
    const product = createDetailedProduct();

    service.addToBasket(product, 1);
    service.addToBasket(product, 1);

    expect(service.productsInBasket()).toHaveLength(1);
    expect(service.productsInBasket()[0]).toEqual({
      product,
      quantity: 2,
    });
  });

  it.each([
    { product: createDetailedProduct(), quantity: 1, quantityToRemove: 1, expectedLength: 0 },
    { product: createDetailedProduct(), quantity: 2, quantityToRemove: 1, expectedLength: 1 },
  ])(
          'should remove a product by object reference, expected remaining products: $expectedLength',
          ({ product, quantity, quantityToRemove, expectedLength }) => {
            service.addToBasket(product, quantity);

            service.removeFromBasket(product, quantityToRemove);

            expect(service.productsInBasket()).toHaveLength(expectedLength);
          },
  );

  it.each([
    { id: 'test', quantity: 1, quantityToRemove: 1, expectedLength: 0 },
    { id: 'test', quantity: 2, quantityToRemove: 1, expectedLength: 1 },
  ])(
          'should remove a product by id, expected remaining products: $expectedLength',
          ({ id, quantity, quantityToRemove, expectedLength }) => {
            service.addToBasket(createDetailedProduct({ id }), quantity);

            service.removeFromBasket(id, quantityToRemove);

            expect(service.productsInBasket()).toHaveLength(expectedLength);
          },
  );

  it('should call checkout from http service', async () => {
    const product = createDetailedProduct();
    const quantity = 2;
    const checkoutProduct = createCheckoutProduct({
      product,
      quantity,
    });
    service.addToBasket(product, quantity);
    const spy = vi.spyOn(checkoutHttp, 'checkout').mockReturnValue(of({}));

    await firstValueFrom(service.checkout());

    expect(spy).toHaveBeenCalledWith([checkoutProduct]);
  });

  it('should clear the basket', () => {
    service.addToBasket(createDetailedProduct(), 1);
    service.addToBasket(createDetailedProduct(), 1);

    service.clearBasket();

    expect(service.productsInBasket()).toHaveLength(0);
  });
});

```
</details>

## 3. Testen von Pipes

Die _ObscureStringPipe_ benötigt noch Testfälle.
Lege einen Testfall an, der

- den direkten transform Aufruf ohne Konfiguration testet ("Happy-Path")
- einen Wert mit weniger Zeichen testet als erwartet
- die eine andere Länge übergibt bis eine Zeichenkette geändert wird
- das Zeichen das zur Veränderung genutzt wird ändert

Hinweis: Pipes zu testen ist sehr einfach, da hier fast immer nur der direkte Methodenaufruf und der daraus resultierende Wert getestet wird.

<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt**

Wie oben erwähnt: hier können die Testfälle aus einfachen Methodenaufrufen bestehen, in denen Eingabe- und Ausgabewerte verglichen werden.

```bash
describe('ObscureStringPipe', () => {
  let pipe: ObscureStringPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObscureStringPipe],
    });
    
    pipe = TestBed.inject(ObscureStringPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should obscure a value', () => {
    expect(pipe.transform('1234567890')).toEqual('******7890');
  });

  it('should return value if length less than not obscured characters', () => {
    expect(pipe.transform('123')).toEqual('123');
  });

  it('should obscure a value with different length', () => {
    expect(pipe.transform('123', 2)).toEqual('*23');
  });

  it('should obscure a value with different symbol', () => {
    expect(pipe.transform('123', 2, '#')).toEqual('#23');
  });
});
```

Wichtig: Da wir in den Tests access- und refreshToken sowie user mehrfach nutzen werden, ergibt es Sinn diese in der ganzen Suite bekannt zu machen.<br>
Da der Storage nicht automatisch am Ende eines Testruns geleert wird, benötigen wir die afterEach() Methode.

</details>

## 4. Testen von Components

Die _UserMenuComponent_ schaltet je nach Zustand verschiedene Childcomponents um.
Lege einen Testfall an, der

- prüft welche Buttons sichtbar sind, wenn ein User angemeldet ist
- prüft welche Buttons sichtbar sind, wenn ein User nicht angemeldet ist
- prüft welche Buttons sichtbar sind, wenn ein User mit der Rolle User angemeldet ist
- prüft welche Buttons sichtbar sind, wenn ein User mit der Rolle Admin angemeldet ist
- prüft ob der Logout Button die "logout" Methode des UserService aufruft

Hinweis: Um die Lesbarkeit zu erhalten, sollten wir Hilfsmethoden anlegen, die die data-testid's auslesen.<br>
Das ist über das ComponentFixture möglich, dieses bietet über ein sog. "debugElement" eine query-Methode an.<br>
Diese nimmt unter anderem über die Utility-Class "By" einen CSS-Selektor an.<br>
Beispiel:

```typescript
fixture.debugElement.query(By.css('[data-testid=meine-test-id]'));
```

Außerdem sollte die Initialisierungslogik für die Component nicht in einem beforeEach() stattfinden.<br>
Das liegt daran, dass das Auslesen der User-Daten im Constructor einmalig (nicht reaktiv) erfolgt; <br>
wir müssen also je Testfall die Bedingungen für einen Testuser mit in die Initialisierung geben.<br>
Das lässt sich bewerkstelligen in dem eine "setup"-Methode erstellt wird:

```typescript

const setup = async (...diverseParams) => {
  await TestBed.configureTestingModule(...)
  ...
}

```

<details>
<summary>Lösung anzeigen</summary>
<p>

```bash
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
```


</details>
