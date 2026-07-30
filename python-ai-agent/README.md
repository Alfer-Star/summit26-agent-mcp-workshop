# Python AI Agent – Vorbereitung (zu Hause)

Diese Anleitung richtet deine Umgebung ein, bevor der Workshop startet.

---

## 0. Install Python

Install uv - (package and project manager)

```bash
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Its all you need. uv installs in next steps required python version and manages the virtual environment.

## 1. Repository auschecken

```bash
git clone -b session_0 https://github.com/Alfer-Star/summit26-agent-mcp-workshop
cd summit-26-agent-workshop
```

## 2. Abhängigkeiten installieren

With uv (installs required Python and dependencies):

```bash
powershell -ExecutionPolicy ByPass -c "uv sync"
```

Falls du vergessen hast uv in den als env hinzu: nutze einfach den Pfad zur uv.exe im Installationpfad.

(Not recommended) With normal python Pip (install Python >=3.14):

```bash
cd python-ai-agent
python -m venv .venv
./.venv/Scripts/activate
python -m pip install .
```

## 3. API-Key einrichten

Kopiere `.env-example` zu `.env` und trage deinen Anthropic API-Key ein:

```bash
cp .env-example .env
```

Öffne `.env` und ersetze den Platzhalter:

```
ANTHROPIC_API_KEY=dein-api-key-hier
```

## 4. Webshop starten

Wechsle zurück ins Root-Verzeichnis und starte den Shop mit dem passenden Skript für dein System:

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

Das Skript installiert alle Shop-Abhängigkeiten und startet Backend und Frontend automatisch.

## 5. Prüfen

Öffne im Browser:

- **<http://localhost:4200>** → S&N Webshop (Angular Frontend)
- **<http://localhost:3000/api/products>** → Produktdaten als JSON

Mit `Ctrl+C` beendest du den Shop wieder.

---

## Checkliste

- [ ] `uv sync` oder `pip install .` in `python-ai-agent/` erfolgreich
- [ ] `.env` mit gültigem `ANTHROPIC_API_KEY` angelegt
- [ ] Shop läuft: <http://localhost:4200> zeigt den Webshop

## Weiter zu Session 1

Beim Workshop-Start wechselst du im selben Repository auf den Branch der ersten Session:

```bash
git checkout -f session_1_agent
```

> **Hinweis:** `-f` verwirft deine lokalen Änderungen (deine bisherige Lösung). Das ist hier gewollt – der Zielbranch enthält den passenden Stand bereits.

Dort baust du aus dem leeren Grundgerüst deinen ersten KI-Agenten. Die Anleitung dazu findest du in `typescript-ai-agent/README.md` auf diesem Branch.
