# Angular für Fortgeschrittene - Aufgabe Architektur

- [Angular für Fortgeschrittene - Aufgabe Architektur](#Angular-für-fortgeschrittene---lab-1)
  - [1. Aufgabe](#anpassen-der-applikationsstruktur)
  - [2. Aufgabe](#2-aufsplitten-des-checkoutservice)
  - [3. Aufgabe](#3-anlegen-einer-maincomponent-page)

## 1. Anpassen der Applikationsstruktur

Aktuell hat unsere Applikation noch eine recht flache Struktur, ohne sinnvolle Auf- bzw. Unterteilungen.

Das soll geändert werden; führe die einzelnen Components, Services, Models, etc. in die aus der Schulung beschriebenen Form um:

- core/
  - Ordner mit zentralen Pages, Components und Routes
- feature/
  - Sammlung von Features, die wiederum featurebezogene Pages, Components, Services, Models, Routes, etc. beinhalten
- shared/
  - Ordner welcher applikationsweit genutzte Components, Services, Models, etc. bereitstellt und exponiert
- transloco/
  - Eigenes Ordner welcher die I18N-Library _Transloco_ zur Verfügung stellt

Sobald die Aufteilung klar ist, kannst du für "schönere" Import-Pfade die "paths"-Variable in der _tsconfig.json_ um sprechende Bezeichner ergänzen.<br>
Beispiel:

```bash
...
"paths": {
 "@core/*": ["src/app/core/*"]
},
...
```

## 2. Aufsplitten des _CheckoutService_

Aktuell beinhaltet der _CheckoutService_ sowohl Logik für die Haushaltung von Daten (den Warenkorb) sowie den _HttpClient_ um technisch mit dem Backend kommunizieren zu können.<br>

Erstell also einen neuen _CheckoutHttpService_, welcher ausschließlich Methoden anbietet um REST-Calls für den _CheckoutService_ vorzunehmen.<br>
Binde diesen anschließend in den _CheckoutService_ ein und entferne die Abhängigkeiten zum _HttpClient_.

## 3. Anlegen einer _MainComponent_ Page

Lege nun unter core/ einen Ordner für eine neue _MainComponent_ an.<br>
Gegenwärtig ist der Grundaufbau der Applikation so, dass die _AppComponent_ Elemente wie den Header, Footer, etc. bereitstellt.<br>
Allerdings sollen Pages wie _LoginComponent_ und _RegistrationComponent_ diese gar nicht beinhalten.<br>

Diese _MainComponent_ soll das aktuell in der _AppComponent_ befindliche Grundgerüst aufbauen.<br>
Die _AppComponent_ benötigt stattdessen in ihrem Template dann nur noch einen Aufruf des router-outlets.
