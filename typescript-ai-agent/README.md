# TypeScript AI Agent – Vorbereitung (zu Hause)

Diese Anleitung richtet deine Umgebung ein, bevor der Workshop startet.

---

## 1. Repository auschecken

```bash
git clone -b session_0 https://github.com/alfer-star/summit26-agent-mcp-workshop
cd summit26-agent-mcp-workshop
```

## 2. Abhängigkeiten installieren

```bash
cd typescript-ai-agent
npm install
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

- **http://localhost:4200** → S&N Webshop (Angular Frontend)
- **http://localhost:3000/api/products** → Produktdaten als JSON

Mit `Ctrl+C` beendest du den Shop wieder.

---

## Checkliste

- [ ] `npm install` in `typescript-ai-agent/` erfolgreich
- [ ] `.env` mit gültigem `ANTHROPIC_API_KEY` angelegt
- [ ] Shop läuft: http://localhost:4200 zeigt den Webshop

---

## Weiter zu Session 1

Beim Workshop-Start wechselst du im selben Repository auf den Branch der ersten Session:

```bash
git checkout session_1_agent
```

Dort baust du aus dem leeren Grundgerüst deinen ersten KI-Agenten. Die Anleitung dazu findest du in `typescript-ai-agent/README.md` auf diesem Branch.
