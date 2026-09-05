# Be the Expert

Mobile Fußball-Wissensspiel für Android und iOS, gebaut mit React Native, Expo SDK 57 und TypeScript.

Die erste Mock-App enthält:

- ein Karriere-Dashboard mit XP, Expertenwertung und Daily Challenge
- ein spielbares Karrierepfad-Quiz mit Antwortfeedback
- ein Expertenprofil mit Fachgebieten
- reine, getestete Quiz- und Punkte-Logik
- eine vorbereitete Supabase-Anbindung mit sicherem Mock-Fallback
- EAS-Profile für Development-, Preview- und Production-Builds
- das bereitgestellte Moderator-Motiv als sichtbares Markenlogo, App-Icon und Splashscreen

## In zwei Minuten starten

Voraussetzungen: Node.js 24 LTS und die Expo-Go-App auf dem Telefon.

### Einfach per Doppelklick

Im Projektordner die Datei **SERVER STARTEN.cmd** doppelt anklicken. Der Button prüft Node.js
und die App-Pakete, startet den Expo-Go-Server und zeigt anschließend den QR-Code an.

Zum Beenden im Serverfenster `Strg+C` drücken. Für die Browser-Vorschau im laufenden
Serverfenster `W` drücken.

### Alternativ im Terminal

```powershell
cd "C:\Users\nitscheASP\Documents\Codex\2026-09-05\referenced-chatgpt-conversation-this-is-an\outputs\be-the-expert"
nvm use 24.20.0
npm install
npm run start:go
```

Danach den QR-Code öffnen:

- Android: Expo Go öffnen und „Scan QR code“ wählen.
- iPhone: QR-Code mit der normalen Kamera scannen.
- PC-Browser: Im laufenden Expo-Terminal `w` drücken.

Telefon und PC sollten im selben WLAN sein. Falls die Verbindung scheitert:

```powershell
npm run start:tunnel
```

## Wichtige Befehle

```powershell
npm run start:go          # schnellster Start mit Expo Go
npm run start:dev         # Development Build verbinden
npm run android           # Expo Go im laufenden Android-Emulator öffnen
npm run android:native    # lokalen Android Development Build erzeugen
npm run web               # Browser-Vorschau
npm run check             # TypeScript, Lint und Tests
npm run doctor            # Expo-Konfiguration/Abhängigkeiten prüfen
```

Die vollständige Einrichtung für Windows, Android Studio, echte Geräte, iPhone, EAS, GitHub und Supabase steht in [docs/WINDOWS_SETUP.md](docs/WINDOWS_SETUP.md).

## Ordnerstruktur

```text
src/
├── app/                    Expo-Router-Routen (bewusst sehr dünn)
├── components/ui/          wiederverwendbare UI-Bausteine
├── features/
│   ├── home/               Startseite und Mock-Dashboard
│   ├── profile/            Expertenprofil
│   └── quiz/
│       ├── data/           Mock-Fragen
│       ├── domain/         UI-unabhängige Spielregeln und Tests
│       └── screens/        Quiz-Oberfläche
├── lib/                    externe Dienste, derzeit Supabase
└── theme/                  Farben, Abstände und Radien

supabase/
└── migrations/             versionierte Datenbankänderungen
```

Für den Start bleibt dies absichtlich ein einzelnes App-Repository. Ein Monorepo würde heute mehr Konfiguration als Nutzen bringen. Gemeinsame Pakete können später ausgelagert werden, sobald tatsächlich eine zweite App oder ein separater Server entsteht.

## Supabase

Die Mock-App läuft ohne Supabase-Projekt. Für die Verbindung:

```powershell
Copy-Item .env.example .env
```

Dann die Projekt-URL und den **Publishable Key** aus Supabase in `.env` eintragen. Niemals einen Service-Role-Key oder den Schlüssel eines Fußball-Datenproviders in die Mobile-App kopieren. `.env` ist von Git ausgeschlossen.

## Entwicklungsregel

Vor jedem abgeschlossenen Schritt:

```powershell
npm run check
npm run doctor
```

Die dauerhaften Projektregeln für Codex stehen in [AGENTS.md](AGENTS.md).
