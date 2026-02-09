const db = require('../models');
const Product = db.product;

exports.createMerchandiseProducts = () => {
    Product.bulkCreate([
        {
            "id": "MER-001",
            "productGroupId": "MER",
            "name_de": "S&N Invent Hoodie (Unisex, Bio)",
            "name_en": "S&N Invent Hoodie (Unisex, Organic)",
            "description_de": "Bequemer Bio-Hoodie mit dezenter Stickerei.",
            "description_en": "Comfortable organic hoodie with subtle embroidery.",
            "detailedDescription_de": "85% Bio-Baumwolle, 15% recyceltes Polyester; weiche Fleece-Innenseite; Kängurutasche und Kordeln; Ton-in-Ton Logo-Stick links auf der Brust; Pflege: 30°C, auf links, nicht in den Trockner.",
            "detailedDescription_en": "85% organic cotton, 15% recycled polyester; soft fleece lining; kangaroo pocket and drawstrings; tone-on-tone logo embroidery on left chest; care: 30°C gentle, wash inside out, do not tumble dry.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-hoodie.png",
            "rating": 4.7,
            "price": 59.0,
            "availableQuantity": 120,
            "deliveryDuration": 1
        },
        {
            "id": "MER-002",
            "productGroupId": "MER",
            "name_de": "Edelstahl-Thermobecher 350 ml",
            "name_en": "Stainless Steel Travel Mug 350 ml",
            "description_de": "Doppelwandiger Thermobecher mit Lasergravur.",
            "description_en": "Double-walled travel mug with laser engraving.",
            "detailedDescription_de": "Gebürsteter Edelstahl mit matter Pulverbeschichtung; 350 ml; auslaufsicherer Deckel; hält Getränke lange warm oder kalt; dezente Lasergravur mit S&N Invent Wortmarke.",
            "detailedDescription_en": "Brushed stainless steel with matte powder coat; 350 ml; leak-proof lid; keeps drinks hot or cold; subtle laser-engraved S&N Invent wordmark.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-cup.png",
            "rating": 4.6,
            "price": 24.0,
            "availableQuantity": 200,
            "deliveryDuration": 1
        },
        {
            "id": "MER-003",
            "productGroupId": "MER",
            "name_de": "Notizbuch A5 \"Invent\"",
            "name_en": "A5 Notebook \"Invent\"",
            "description_de": "Hardcover-Notizbuch mit Gummiband und Prägung.",
            "description_en": "Hardcover notebook with elastic band and debossed logo.",
            "detailedDescription_de": "Format A5, punktkariert; seidig-mattes PU-Cover; Gummibandverschluss und Leseband; geprägtes S&N Invent Logo unten rechts; 160 Seiten, 90 g/m².",
            "detailedDescription_en": "A5, dot grid; silky-matte PU cover; elastic closure and ribbon bookmark; debossed S&N Invent logo bottom right; 160 pages, 90 gsm.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-notebook.png",
            "rating": 4.5,
            "price": 14.0,
            "availableQuantity": 350,
            "deliveryDuration": 2
        },
        {
            "id": "MER-004",
            "productGroupId": "MER",
            "name_de": "Kugelschreiber-Set (3er) Rezyklat",
            "name_en": "Recycled Ballpoint Pen Set (3-pack)",
            "description_de": "Dreier-Set Kugelschreiber mit Soft-Touch.",
            "description_en": "Three-pack ballpoint pens with soft-touch finish.",
            "detailedDescription_de": "Rezyklat-Kunststoff mit Soft-Touch-Oberfläche; Metallclip; Farben: Schwarz, Petrol, Off-White; dezenter Tampondruck der Wortmarke; 1.0 mm Mine, blau schreibend.",
            "detailedDescription_en": "Recycled plastic with soft-touch finish; metal clip; colors: black, petrol, off-white; subtle pad-printed wordmark; 1.0 mm blue ink.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-pen.png",
            "rating": 4.3,
            "price": 12.0,
            "availableQuantity": 500,
            "deliveryDuration": 4
        },
        {
            "id": "MER-005",
            "productGroupId": "MER",
            "name_de": "Emaille-Tasse \"Prototype Daily\"",
            "name_en": "Enamel Mug \"Prototype Daily\"",
            "description_de": "Klassische Emaille-Tasse mit schwarzem Rand.",
            "description_en": "Classic enamel mug with black rim.",
            "detailedDescription_de": "Emaillierter Stahl, 350 ml; weiße Tasse mit schwarzem Rand; robust und leicht; Siebdruckmotiv mit kleiner S&N Invent Wortmarke; nicht mikrowellengeeignet, Handwäsche empfohlen.",
            "detailedDescription_en": "Enamel-coated steel, 350 ml; white mug with black rim; durable and lightweight; screen-printed motif with small S&N Invent wordmark; not microwave safe, hand wash recommended.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-mug.png",
            "rating": 4.4,
            "price": 14.0,
            "availableQuantity": 260,
            "deliveryDuration": 5
        },
        {
            "id": "MER-006",
            "productGroupId": "MER",
            "name_de": "Laptop-Stickerpack \"Build • Test • Learn\"",
            "name_en": "Laptop Sticker Pack \"Build • Test • Learn\"",
            "description_de": "Matte Vinyl-Sticker in verschiedenen Formen.",
            "description_en": "Matte vinyl stickers in assorted shapes.",
            "detailedDescription_de": "Stickerpack mit 8-12 matten Vinyl-Stickern; Farbwelt Anthrazit, Petrol, Off-White; teils mit kleinem Marken-Icon; rückstandsfrei ablösbar; wetterfest.",
            "detailedDescription_en": "Pack of 8-12 matte vinyl stickers; colorway anthracite, petrol, off-white; some with small brand icon; removable without residue; weather-resistant.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-sticker.png",
            "rating": 4.2,
            "price": 7.0,
            "availableQuantity": 800,
            "deliveryDuration": 6
        },
        {
            "id": "MER-007",
            "productGroupId": "MER",
            "name_de": "Premium-Schreibtischmatte (PU)",
            "name_en": "Premium Desk Mat (PU)",
            "description_de": "Seidig-matte PU-Schreibtischmatte 80x40 cm.",
            "description_en": "Silky-matte PU desk mat 80x40 cm.",
            "detailedDescription_de": "PU-Leder, seidig-matt; Maße 80 x 40 cm, abgerundete Ecken; rutschfeste Unterseite; kleine Blindprägung unten rechts; ideal für Maus und Tastatur.",
            "detailedDescription_en": "PU leather, silky-matte; 80 x 40 cm with rounded corners; non-slip backing; small blind deboss logo bottom right; ideal for mouse and keyboard.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-notepad.png",
            "rating": 4.6,
            "price": 39.0,
            "availableQuantity": 180,
            "deliveryDuration": 3
        },
        {
            "id": "MER-008",
            "productGroupId": "MER",
            "name_de": "Baumwoll-Tragetasche XL",
            "name_en": "Cotton Tote Bag XL",
            "description_de": "Robuste Canvas-Tasche mit langem Henkel.",
            "description_en": "Durable canvas tote with long handles.",
            "detailedDescription_de": "Schweres Baumwoll-Canvas (ca. 12 oz); XL-Format mit langen Henkeln; Siebdruck-Logo mittig; ideal für Laptop, Notizbuch und Prototyp-Teile; waschbar bei 30°C.",
            "detailedDescription_en": "Heavy cotton canvas (~12 oz); XL size with long handles; centered screen-printed logo; fits laptop, notebook and prototype parts; machine wash 30°C.",
            "imageUrl": "http://localhost:3000/images/merchandise/mer-totebag.png",
            "rating": 4.5,
            "price": 9.0,
            "availableQuantity": 400,
            "deliveryDuration": 4
        }
    ]);
}

exports.createGadgetProducts = () => {
    Product.bulkCreate([
        {
            "id": "GAD-001",
            "productGroupId": "GAD",
            "name_de": "Kabelloses Ladepad 10–15W (mit Logo)",
            "name_en": "Wireless Charging Pad 10–15W (branded)",
            "description_de": "Qi-Ladepad mit rutschfester Oberfläche und USB‑C.",
            "description_en": "Qi wireless charger with non-slip surface and USB‑C.",
            "detailedDescription_de": "Kompatibel mit Qi-Geräten; bis zu 15 W Schnellladen (geräteabhängig); foreign object detection (FOD); sanfte Status-LED; rutschfeste Gummimatte; USB‑C Anschluss; inkl. 1 m USB‑C Kabel; Eingang 5V/2A oder 9V/2A.",
            "detailedDescription_en": "Compatible with Qi devices; up to 15 W fast charging (device dependent); foreign object detection (FOD); soft status LED; non-slip rubber top; USB‑C input; includes 1 m USB‑C cable; input 5V/2A or 9V/2A.",
            "imageUrl": "http://localhost:3000/images/gadgets/gad-charging-pad.png",
            "rating": 4.5,
            "price": 29.0,
            "availableQuantity": 220,
            "deliveryDuration": 5
        },
        {
            "id": "GAD-002",
            "productGroupId": "GAD",
            "name_de": "USB‑C Dock Mini (HDMI, USB‑A, PD)",
            "name_en": "USB‑C Mini Dock (HDMI, USB‑A, PD)",
            "description_de": "Kompakter USB‑C Hub mit HDMI, USB‑A und 100 W PD‑Passthrough.",
            "description_en": "Compact USB‑C hub with HDMI, USB‑A and 100 W PD pass‑through.",
            "detailedDescription_de": "Anschlüsse: 1× HDMI (bis 4K@30Hz), 2× USB‑A (5 Gbps), USB‑C PD‑Passthrough bis 100 W; Aluminiumgehäuse; Plug‑and‑Play; ideal für Hybrid‑Work; inkl. 15 cm USB‑C Kabel.",
            "detailedDescription_en": "Ports: 1× HDMI (up to 4K@30Hz), 2× USB‑A (5 Gbps), USB‑C PD pass‑through up to 100 W; aluminum housing; plug‑and‑play; great for hybrid work; includes 15 cm USB‑C cable.",
            "imageUrl": "http://localhost:3000/images/gadgets/gad-docking-station.png",
            "rating": 4.4,
            "price": 69.0,
            "availableQuantity": 140,
            "deliveryDuration": 2
        },
        {
            "id": "GAD-003",
            "productGroupId": "GAD",
            "name_de": "Smart LED‑Glühbirne (App + Szenen)",
            "name_en": "Smart LED Bulb (App & Scenes)",
            "description_de": "E27 LED‑Lampe mit App‑Steuerung, Zeitplänen und Szenen.",
            "description_en": "E27 smart LED bulb with app control, schedules and scenes.",
            "detailedDescription_de": "E27 Sockel; 2700–6500 K Weißtöne (CCT), dimmbar; ca. 800 lm bei 9 W; 2,4 GHz WLAN; App‑Steuerung für Zeitpläne, Gruppen und Szenen; Speicherfunktion bei Stromwiederkehr.",
            "detailedDescription_en": "E27 base; 2700–6500 K tunable white (CCT), dimmable; approx. 800 lm at 9 W; 2.4 GHz Wi‑Fi; app control for schedules, groups and scenes; power‑on memory.",
            "imageUrl": "http://localhost:3000/images/gadgets/gad-lamp.png",
            "rating": 4.3,
            "price": 19.0,
            "availableQuantity": 300,
            "deliveryDuration": 3
        },
        {
            "id": "GAD-004",
            "productGroupId": "GAD",
            "name_de": "Kabelmanagement‑Set (Clips, Sleeves, Klettbänder)",
            "name_en": "Cable Management Kit (clips, sleeves, hook‑and‑loop)",
            "description_de": "Set zur Kabelordnung für Schreibtisch und Homeoffice.",
            "description_en": "Cable organizing kit for desk and home office.",
            "detailedDescription_de": "Inhalt: 6× Kabelclips (selbstklebend), 2× Kabelsleeves (je 1 m, aus Neopren), 10× Klettkabelbinder (wiederverwendbar), 8× Kabelmarker; sorgt für Ordnung und Schutz; rückstandsfreie Klebe‑Pads.",
            "detailedDescription_en": "Includes: 6× self‑adhesive cable clips, 2× 1 m neoprene cable sleeves, 10× reusable hook‑and‑loop ties, 8× cable labels; keeps cables tidy and protected; residue‑free adhesive pads.",
            "imageUrl": "http://localhost:3000/images/gadgets/gad-cable-management.png",
            "rating": 4.2,
            "price": 15.0,
            "availableQuantity": 600,
            "deliveryDuration": 6
        },
        {
            "id": "GAD-005",
            "productGroupId": "GAD",
            "name_de": "Monitor‑Lightbar (blendfrei, stufenlos dimmbar)",
            "name_en": "Monitor Light Bar (glare‑free, stepless dimming)",
            "description_de": "Schlanke Bildschirm‑Leuchte mit einstellbarer Farbtemperatur.",
            "description_en": "Slim screen light with adjustable color temperature.",
            "detailedDescription_de": "Blendfreier asymmetrischer Lichtwurf; stufenlos dimmbar; Farbtemperatur 2700–6500 K; USB‑C Stromversorgung; universelle Klemme für 5–35 mm Rahmen; Memory‑Funktion.",
            "detailedDescription_en": "Glare‑free asymmetric beam; stepless dimming; color temperature 2700–6500 K; USB‑C powered; universal clamp for 5–35 mm bezels; memory function.",
            "imageUrl": "http://localhost:3000/images/gadgets/gad-monitor-lamp.png",
            "rating": 4.6,
            "price": 59.0,
            "availableQuantity": 110,
            "deliveryDuration": 5
        },
        {
            "id": "GAD-006",
            "productGroupId": "GAD",
            "name_de": "Bluetooth‑Tracker für Equipment",
            "name_en": "Bluetooth Equipment Tracker",
            "description_de": "Kompakter Tracker zum Wiederfinden von Taschen und Equipment.",
            "description_en": "Compact tracker to help locate bags and equipment.",
            "detailedDescription_de": "Bluetooth Low Energy; lauter Signalton; App‑Benachrichtigungen; Austauschbare CR2032‑Knopfzelle (bis 12 Monate); Schlüsselring‑Öse; Reichweite bis ca. 60 m (umgebungsabhängig).",
            "detailedDescription_en": "Bluetooth Low Energy; loud ring; app notifications; replaceable CR2032 coin cell (up to 12 months); keyring hole; range up to ~60 m (environment dependent).",
            "imageUrl": "http://localhost:3000/images/gadgets/gad-tracker.png",
            "rating": 4.4,
            "price": 24.0,
            "availableQuantity": 250,
            "deliveryDuration": 4
        }
    ]);
}


exports.createTrainingProducts = () => {
    Product.bulkCreate(
        [
            {
                "id": "TRAIN-001",
                "productGroupId": "TRAIN",
                "name_de": "Angular für Einsteiger/Umsteiger",
                "name_en": "Angular for Beginners/Migrators",
                "description_de": "Praxisnaher Einstieg in modernes Angular – ideal für Neu- und Umsteiger.",
                "description_en": "Hands-on introduction to modern Angular – ideal for new and migrating developers.",
                "detailedDescription_de": "Inhalte: TypeScript-Quickstart, Komponenten & Templates, Datenbindung, Standalone Components, Services & Dependency Injection, Routing, Reactive Forms, HTTPClient, RxJS-Grundlagen, CLI & Build. Format: 2 Tage live (Remote oder vor Ort), viele Übungen, Git-Repo & Cheatsheets, Teilnahmezertifikat. Zielgruppe: Entwickler:innen mit JS/TS-Basiswissen. Max. 12 Teilnehmende.",
                "detailedDescription_en": "Topics: TypeScript quick start, components & templates, data binding, standalone components, services & dependency injection, routing, reactive forms, HTTP client, RxJS basics, CLI & build. Format: 2 days live (remote or onsite), plenty of exercises, Git repo & cheat sheets, certificate. Audience: Developers with basic JS/TS knowledge. Max 12 participants.",
                "imageUrl": "http://localhost:3000/images/trainings/train-angular-1.png",
                "rating": 4.8,
                "price": 1090.0,
                "availableQuantity": 20,
                "deliveryDuration": 3
            },
            {
                "id": "TRAIN-002",
                "productGroupId": "TRAIN",
                "name_de": "Angular für Fortgeschrittene",
                "name_en": "Angular Advanced",
                "description_de": "Vertiefung für produktionsreife Angular-Apps: Architektur, Performance, Tests.",
                "description_en": "Deep dive into production-grade Angular apps: architecture, performance, testing.",
                "detailedDescription_de": "Inhalte: Architektur-Patterns, State-Management (RxJS, ggf. NgRx), Change Detection & OnPush, Lazy Loading, Advanced Routing, Form-Architekturen, Interceptor & Guards, Performance-Tuning, Testing (Jest/Karma), Best Practices & Migrationspfade. Format: 2 Tage, intensives Hands-on, Code Reviews, Projekt-Q&A. Voraussetzungen: solide Angular-Grundkenntnisse. Max. 10 Teilnehmende.",
                "detailedDescription_en": "Topics: architecture patterns, state management (RxJS, optionally NgRx), change detection & OnPush, lazy loading, advanced routing, form architectures, interceptors & guards, performance tuning, testing (Jest/Karma), best practices & migration paths. Format: 2 days, intensive hands-on, code reviews, project Q&A. Prerequisites: solid Angular fundamentals. Max 10 participants.",
                "imageUrl": "http://localhost:3000/images/trainings/train-angular-2.png",
                "rating": 4.7,
                "price": 1290.0,
                "availableQuantity": 16,
                "deliveryDuration": 7
            },
            {
                "id": "TRAIN-003",
                "productGroupId": "TRAIN",
                "name_de": "Scrum Kompakt",
                "name_en": "Scrum Essentials",
                "description_de": "Kompakter Überblick über Scrum-Rollen, -Events und -Artefakte mit Praxisübungen.",
                "description_en": "Compact overview of Scrum roles, events and artifacts with hands-on exercises.",
                "detailedDescription_de": "Inhalte: Werte & Prinzipien, Rollen (PO, SM, Dev-Team), Events (Sprint, Planning, Review, Retro), Artefakte (Product Backlog, Sprint Backlog, Increment), Schätzung & Story Mapping, DoR/DoD, Skalierungsüberblick. Format: 1 Tag, Gruppenübungen, Templates & Checklisten. Zielgruppe: Dev-Teams, POs, SMs, Stakeholder. Keine Vorkenntnisse nötig. Max. 16 Teilnehmende.",
                "detailedDescription_en": "Topics: values & principles, roles (PO, SM, Dev Team), events (sprint, planning, review, retrospective), artifacts (product backlog, sprint backlog, increment), estimation & story mapping, DoR/DoD, scaling overview. Format: 1 day, group exercises, templates & checklists. Audience: dev teams, POs, SMs, stakeholders. No prior knowledge required. Max 16 participants.",
                "imageUrl": "http://localhost:3000/images/trainings/train-scrum.png",
                "rating": 4.6,
                "price": 690.0,
                "availableQuantity": 24,
                "deliveryDuration": 2
            },
            {
                "id": "TRAIN-004",
                "productGroupId": "TRAIN",
                "name_de": "Software-Architektur in der Praxis",
                "name_en": "Software Architecture in Practice",
                "description_de": "Grundlagen, Muster und Entscheidungsfindung für skalierbare Systeme.",
                "description_en": "Foundations, patterns and decision making for scalable systems.",
                "detailedDescription_de": "Inhalte: Qualitätsziele & Trade-offs, Modularisierung, Domain-driven Design (leichtgewichtig), Monolith vs. Microservices, Integrationsstile & Schnittstellen, ADRs, C4-Modell, Architekturreviews & Fitness Functions, Testbarkeit & Observability. Format: 2 Tage, Fallstudien, Gruppenarbeit, Architektur-Skizzen. Zielgruppe: Architekt:innen, Senior Devs, Tech Leads. Max. 14 Teilnehmende.",
                "detailedDescription_en": "Topics: quality attributes & trade-offs, modularization, lightweight DDD, monolith vs microservices, integration styles & APIs, ADRs, C4 model, architecture reviews & fitness functions, testability & observability. Format: 2 days, case studies, group work, architecture sketches. Audience: architects, senior devs, tech leads. Max 14 participants.",
                "imageUrl": "http://localhost:3000/images/trainings/train-soft-arc.png",
                "rating": 4.7,
                "price": 1390.0,
                "availableQuantity": 18,
                "deliveryDuration": 6
            },
            {
                "id": "TRAIN-005",
                "productGroupId": "TRAIN",
                "name_de": "Datenbanken – Modelle, SQL & Performance",
                "name_en": "Databases – Modeling, SQL & Performance",
                "description_de": "Relationale und NoSQL-Konzepte, Modellierung und Tuning mit Praxisbezug.",
                "description_en": "Relational and NoSQL concepts, modeling and tuning with practical focus.",
                "detailedDescription_de": "Inhalte: Relationales Modell & Normalisierung, ER-Modellierung, Indizes & Transaktionen, Query-Optimierung, PostgreSQL/MySQL Basics, NoSQL (Dokumenten- & Key-Value-Modelle), ORMs & Migrations, Replikation & Backup-Strategien. Format: 2 Tage, Labs & Übungen. Zielgruppe: Devs & Data-nahe Rollen. Vorkenntnisse: Grundlagen in SQL vorteilhaft. Max. 16 Teilnehmende.",
                "detailedDescription_en": "Topics: relational model & normalization, ER modeling, indexes & transactions, query optimization, PostgreSQL/MySQL basics, NoSQL (document & key-value models), ORMs & migrations, replication & backup strategies. Format: 2 days, labs & exercises. Audience: developers & data-adjacent roles. Prerequisites: basic SQL helpful. Max 16 participants.",
                "imageUrl": "http://localhost:3000/images/trainings/train-db.png",
                "rating": 4.5,
                "price": 990.0,
                "availableQuantity": 22,
                "deliveryDuration": 1
            },
            {
                "id": "TRAIN-006",
                "productGroupId": "TRAIN",
                "name_de": "Git SCM – Workflow & Best Practices",
                "name_en": "Git SCM – Workflow & Best Practices",
                "description_de": "Sicheres Arbeiten mit Git: Branching-Strategien, Rebase/Merge, CI-Integration.",
                "description_en": "Confident Git usage: branching strategies, rebase/merge, CI integration.",
                "detailedDescription_de": "Inhalte: Git-Grundlagen kurz, Branching-Modelle (Trunk-based, Git Flow), Pull Requests & Reviews, Rebase vs. Merge, Konfliktlösung, Bisect & Cherry-Pick, Hooks & Signing, Monorepos, Versionierung & Release-Flows, Integration in CI/CD. Format: 1 Tag, viele Übungen, Repo-Vorlagen. Zielgruppe: Dev-Teams. Max. 20 Teilnehmende.",
                "detailedDescription_en": "Topics: brief Git fundamentals, branching models (trunk-based, Git Flow), pull requests & reviews, rebase vs merge, conflict resolution, bisect & cherry-pick, hooks & signing, monorepos, versioning & release flows, CI/CD integration. Format: 1 day, hands-on exercises, repo templates. Audience: dev teams. Max 20 participants.",
                "imageUrl": "http://localhost:3000/images/trainings/train-git.png",
                "rating": 4.6,
                "price": 590.0,
                "availableQuantity": 28,
                "deliveryDuration": 4
            }
        ]
    )
}


exports.createDigitalProducts = () => {
    Product.bulkCreate(
        [
            {
                "id": "DIG-001",
                "productGroupId": "DIG",
                "name_de": "Innovations-Canvas (Miro/Figma/Notion Templates)",
                "name_en": "Innovation Canvas (Miro/Figma/Notion Templates)",
                "description_de": "Strukturierte Templates für Ideation, Priorisierung und Roadmapping.",
                "description_en": "Structured templates for ideation, prioritization and roadmapping.",
                "detailedDescription_de": "Umfang: 6 Boards (Problem/Solution, Value Map, Priorisierung 2×2, Roadmap, Risikomatrix, Retro). Formate: Miro, Figma, PNG und Notion-Seite. Lizenz: Teamlizenz bis 20 Nutzer. Lieferung: Sofort-Download, inkl. 12 Monate Updates und Support per E-Mail.",
                "detailedDescription_en": "Includes: 6 boards (problem/solution, value map, 2×2 prioritization, roadmap, risk matrix, retro). Formats: Miro, Figma, PNG and Notion page. License: team license up to 20 users. Delivery: instant download with 12 months of updates and email support.",
                "imageUrl": "http://localhost:3000/images/digitals/dig-canvas.png",
                "rating": 4.7,
                "price": 24.0,
                "availableQuantity": 10000,
                "deliveryDuration": 1
            },
            {
                "id": "DIG-002",
                "productGroupId": "DIG",
                "name_de": "KPI‑Dashboard Vorlage (Excel/Google Sheets)",
                "name_en": "KPI Dashboard Template (Excel/Google Sheets)",
                "description_de": "Sofort nutzbares KPI-Dashboard mit Charts, Formeln und Beispieldaten.",
                "description_en": "Ready-to-use KPI dashboard with charts, formulas and sample data.",
                "detailedDescription_de": "Inhalte: vorkonfigurierte Metriken (Umsatz, Conversion, Funnel, Auslastung), interaktive Diagramme, Datenerfassungs-Tabellen, Filter & Slicer, Anleitung (PDF). Formate: Excel (.xlsx) und Google Sheets. Lieferung: Sofort-Download, inkl. Farbvarianten und Logo-Platzhalter.",
                "detailedDescription_en": "Contents: preconfigured metrics (revenue, conversion, funnel, utilization), interactive charts, data capture tables, filters & slicers, PDF guide. Formats: Excel (.xlsx) and Google Sheets. Delivery: instant download, includes color variants and logo placeholders.",
                "imageUrl": "http://localhost:3000/images/digitals/dig-kpi.png",
                "rating": 4.6,
                "price": 29.0,
                "availableQuantity": 10000,
                "deliveryDuration": 1
            },
            {
                "id": "DIG-003",
                "productGroupId": "DIG",
                "name_de": "CAD‑Bibliothek: Normteile Starterpaket (STEP/IGES)",
                "name_en": "CAD Library: Standard Parts Starter Pack (STEP/IGES)",
                "description_de": "Kuratiertes Paket mit Normteilen für CAD-Projekte in STEP/IGES.",
                "description_en": "Curated pack of standard parts for CAD projects in STEP/IGES.",
                "detailedDescription_de": "Inhalte: Schrauben, Muttern, Unterlegscheiben, Abstandshalter, Lager und gängige Profile; metrische Größen M2–M12; Dateiformate: STEP (.stp) und IGES (.igs); Strukturierte Ordner und Vorschaubilder; Lizenz: teamintern nutzbar, keine Weitervermarktung.",
                "detailedDescription_en": "Includes: screws, nuts, washers, standoffs, bearings and common profiles; metric sizes M2–M12; file formats: STEP (.stp) and IGES (.igs); structured folders and previews; license: internal team use, no resale.",
                "imageUrl": "http://localhost:3000/images/digitals/dig-cad.png",
                "rating": 4.5,
                "price": 49.0,
                "availableQuantity": 10000,
                "deliveryDuration": 1
            },
            {
                "id": "DIG-004",
                "productGroupId": "DIG",
                "name_de": "Pitch‑Deck Theme (PowerPoint/Keynote)",
                "name_en": "Pitch Deck Theme (PowerPoint/Keynote)",
                "description_de": "Professionelles Präsentations-Theme mit Masterfolien und Iconset.",
                "description_en": "Professional presentation theme with master slides and icon set.",
                "detailedDescription_de": "Inhalte: 30+ Masterfolien (Agenda, Problem, Lösung, Markt, Traction, Team, Finanzplan), Farbpaletten, Typografie-Empfehlungen, Icons & Diagrammvorlagen, 16:9 und 4:3. Formate: PowerPoint (.pptx) und Keynote (.key). Lieferung: Sofort-Download inkl. Beispielbilder.",
                "detailedDescription_en": "Includes: 30+ master slides (agenda, problem, solution, market, traction, team, financials), color palettes, typography recommendations, icons & chart templates, 16:9 and 4:3. Formats: PowerPoint (.pptx) and Keynote (.key). Delivery: instant download with sample images.",
                "imageUrl": "http://localhost:3000/images/digitals/dig-pitch.png",
                "rating": 4.6,
                "price": 24.0,
                "availableQuantity": 10000,
                "deliveryDuration": 1
            },
            {
                "id": "DIG-005",
                "productGroupId": "DIG",
                "name_de": "Onboarding‑Checkliste (HR/IT)",
                "name_en": "Onboarding Checklist (HR/IT)",
                "description_de": "Praktische Checklisten und Vorlagen für strukturierte Employee Onboarding.",
                "description_en": "Practical checklists and templates for structured employee onboarding.",
                "detailedDescription_de": "Inhalte: HR- und IT-Checklisten (Preboarding, Tag 1, Woche 1, Monat 1), Rollen & Verantwortlichkeiten, Geräte-/Zugriffslisten, Vorlagen für E-Mail & Docs, Notion- und CSV-Versionen. Lieferung: Sofort-Download inkl. anpassbarer Felder.",
                "detailedDescription_en": "Includes: HR and IT checklists (preboarding, day 1, week 1, month 1), roles & responsibilities, device/access lists, email & document templates, Notion and CSV versions. Delivery: instant download with customizable fields.",
                "imageUrl": "http://localhost:3000/images/digitals/dig-onboarding.png",
                "rating": 4.4,
                "price": 12.0,
                "availableQuantity": 10000,
                "deliveryDuration": 1
            }
        ]
    )
}