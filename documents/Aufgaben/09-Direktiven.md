# Angular für Fortgeschrittene - Aufgabe Direktiven

- [Angular für Fortgeschrittene - Aufgabe Direktiven](#Angular-für-fortgeschrittene---lab-1)
  - [Aufgabe](#anlegen-einer-direktive-um-test-ids-anlegen-zu-können)

## Anlegen einer Direktive um Test-IDs anlegen zu können

Damit wir einfacher Test-IDs an Componenten, HTML-Elemente, etc. anhängen können benötigen wir eine Direktive.<br>
Diese soll:

- Die einzutragende ID als Input entgegen nehmen können

Um diese ID anfügen zu können, muss über Dependency Injection eine Referenz auf das Host ElementRef sowie den Renderer2 erfolgen. <br>

<details>
<summary>Lösung anzeigen</summary>
<p>

**1. Schritt**

Erstelle die Input Attribute.

```TypeScript
export const dataTestid = 'data-testid'; // Konvention für Test-Id's

@Directive({
  selector: '[snTestId]',
})
export class DataTestIdDirective {
  snTestId = input.required<string>();
}
```

**2. Schritt**

Zieh die notwendigen Injectables über die Dependency Injection in die Direktive.

```TypeScript
export const dataTestid = 'data-testid'; // Konvention für Test-Id's

@Directive({
  selector: '[snTestId]',
})
export class DataTestIdDirective {
  snTestId = input.required<string>();

  private readonly host = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
}
```

**3. Schritt**

Füge das neue Attribut mit der ID an das Host Element an.

```TypeScript
export const dataTestid = 'data-testid'; // Konvention für Test-Id's

@Directive({
  selector: '[snTestId]',
})
export class DataTestIdDirective implements OnInit {
  snTestId = input.required<string>();

  private readonly host = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      this.renderer.setAttribute(this.host.nativeElement, dataTestid, this.snTestId());
    });
  }
}
```
