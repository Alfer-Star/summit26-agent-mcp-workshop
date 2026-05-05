# Angular für Fortgeschrittene - Aufgabe Styling

- [Angular für Fortgeschrittene - Aufgabe Styling](#Angular-für-fortgeschrittene---lab-1)
    - [1. Aufgabe](#1-anpassen-der-styles-in-appcomponentscss)
    - [2. Aufgabe](#2-überschreiben-der-styles-in-languagemenuscss)

<details>
<summary>Lösung anzeigen</summary>
<p>
</details>

## 1. Anpassen der Styles in _AppComponent.scss_

Das Layout für die _.main_ Class muss angepasst werden.<br>
Erstelle eine CSS Regel, anhand derer die die _.main_ Class ein vertikales Flex Layout erhält.<br>
Die _.main-content_ Class sollte den gesamten mittleren Raum zwischen Header und Footer füllen.<br>
Optional können auch paddings, Hintergrundfarben, etc. gesetzt werden.

<details>
<summary>Lösung anzeigen</summary>
<p>

```bash
...
.main {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &-content {
    flex: auto;
    overflow: auto;
    padding: map.get(variables.$paddings, 'default');
  }
}
...
```

</details>

## 2. Überschreiben der Styles in _header.component.scss_

Einige Texte und Borders der Elemente bei uns im Header passen nicht ganz zum dunklen Design.
Passe die Elemente unter anderem mithilfe von `::ng-deep` an, so dass der Kontrast stärker ist.

<details>
<summary>Lösung anzeigen</summary>
<p>

```bash
header.component.scss
...
.:host {
  ...
  ::ng-deep * {
    color: var(--mat-sys-on-primary) !important;
    border-color: var(--mat-sys-on-primary) !important;
    caret-color: var(--mat-sys-on-primary) !important;
  }
}
...
```

</details>
