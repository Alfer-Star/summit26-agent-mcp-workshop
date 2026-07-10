# Summit 2026 – Agent & MCP Workshop

In diesem Workshop baust du Schritt für Schritt einen KI-Agenten, der über das Model Context Protocol (MCP) mit einem echten Webshop kommuniziert.

---

## Einstieg

### 1. Repository klonen

```bash
git clone https://github.com/Alfer-Star/summit26-agent-mcp-workshop
cd summit26-agent-mcp-workshop
```

### 2. Auf Branch `session_0` wechseln

```bash
git checkout session_0
```

Jeder Session-Branch enthält den Startpunkt für die jeweilige Session sowie eine README mit den konkreten Aufgaben.

---

## Sessions im Überblick

| Branch      | Inhalt                                                                |
| ----------- | --------------------------------------------------------------------- |
| `session_0` | Vorbereitung zu Hause: Repo einrichten, Shop starten, Umgebung prüfen |
| `session_1` | KI-Agenten bauen: Claude anbinden, Gesprächsgedächtnis, erstes Tool   |
| `session_2` | Lösung zu Session 1 + MCP-Anbindung: Agent mit Webshop verbinden      |
| `session_3` | Erweiterung: weitere Tools, Optimierungen                             |

Die README im jeweiligen Branch `(typescript-ai-agent|spring-ai-agent|python-ai-agent)/README.md` beschreibt die Aufgaben der Session.

---

## Webshop starten

Der Webshop (Backend + Frontend) läuft lokal und wird vom Agenten als Datenquelle genutzt. Starte ihn vom Root-Verzeichnis aus:

**Windows (PowerShell):**

```powershell
.\start-shop.ps1
```

**macOS:**

```bash
./start-shop-mac.sh
```

**Linux:**

```bash
./start-shop.sh
```

Sollte es mit den Start-Skripten Probleme geben, können die Schritte wie folgt manuell ausgeführt werden:

```bash
cd sn-webshop-client
npm install
npm run client:start

in einer weiteren CMD oder per cmd /c:

cd sn-webshop-server
npm install
npm run server:start
```

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000

### Testaccounts

| Rolle | E-Mail        | Passwort  |
| ----- | ------------- | --------- |
| User  | test@test.de  | password1 |
| Admin | admin@test.de | password1 |

---

## Projektstruktur

```
summit26-agent-mcp-workshop/
├── sn-webshop-client/       Angular Frontend (Port 4200)
├── sn-webshop-server/       Express.js Backend (Port 3000)
├── typescript-ai-agent/     TypeScript Agent – (Referenzimplementierung)
├── python-ai-agent/         Python Agent (Referenzimplementierung)
├── spring-ai-agent/         Spring AI Agent (Referenzimplementierung)
├── start-shop.ps1           Shop starten (Windows)
├── start-shop-mac.sh        Shop starten (macOS)
└── start-shop.sh            Shop starten (Linux)
```
