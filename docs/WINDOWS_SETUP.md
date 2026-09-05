# Be the Expert: Windows-Entwicklungsstart

Stand: 5. September 2026. Diese Anleitung ist auf Expo SDK 57 abgestimmt.

## 1. Was bereits vorbereitet ist

Auf diesem PC wurden geprüft oder eingerichtet:

| Teil | Status |
|---|---|
| Node.js | 24.20.0 LTS über NVM for Windows |
| npm | installiert |
| Git | installiert |
| VS Code | installiert |
| Codex Desktop | vorhanden; dieses Projekt wurde damit erzeugt |
| Expo-Projekt | SDK 57 mit TypeScript und Expo Router |
| EAS CLI | global installiert |
| Android Studio / SDK / ADB | noch nicht installiert |
| GitHub CLI | installiert; persönliche Anmeldung steht noch aus |

Auf Laufwerk C: waren bei der Einrichtung nur etwa 12 GB frei. Android Studio plus SDK und ein Emulator-Image benötigen mehr. Vor Schritt 4 sollten mindestens 25–30 GB frei sein; mehr ist angenehmer.

Den Status jederzeit prüfen:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\check-windows-setup.ps1
```

## 2. Einmalige Basisinstallation auf einem neuen Windows-PC

Auf diesem PC ist der Abschnitt weitgehend erledigt. Für einen anderen Rechner:

1. Node.js in der aktuellen LTS-Version installieren. Für dieses Projekt ist Node 24 vorgesehen.
2. Git for Windows installieren.
3. VS Code und/oder Codex Desktop installieren.
4. Ein neues PowerShell-Fenster öffnen und prüfen:

```powershell
node --version
npm --version
git --version
```

Offizielle Downloads:

- Node.js LTS: https://nodejs.org/en/download
- Git for Windows: https://git-scm.com/downloads/win
- VS Code: https://code.visualstudio.com/download
- OpenAI/Codex: https://developers.openai.com/

Das Projekt enthält `.nvmrc`. Mit NVM for Windows genügt:

```powershell
nvm install 24.20.0
nvm use 24.20.0
```

EAS einmalig installieren:

```powershell
npm install --global eas-cli
eas --version
```

## 3. Projekt lokal starten

```powershell
cd "C:\Users\nitscheASP\Documents\Codex\2026-09-05\referenced-chatgpt-conversation-this-is-an\outputs\be-the-expert"
nvm use 24.20.0
npm install
npm run start:go
```

Expo startet den Entwicklungsserver und zeigt einen QR-Code. Änderungen an TypeScript-Dateien werden per Fast Refresh meist innerhalb weniger Sekunden sichtbar.

### Schnellste Testreihenfolge

1. Zuerst `npm run web`, um offensichtliche UI- und Logikfehler schnell zu finden.
2. Danach mit Expo Go auf einem echten Android-Gerät und, falls vorhanden, iPhone testen.
3. Danach im Android-Emulator verschiedene Displaygrößen testen.
4. Sobald native Bibliotheken, Push-Nachrichten, App-Links oder echte App-Icons relevant werden, einen Development Build verwenden.
5. Vor einer Veröffentlichung Preview-/Production-Builds auf echten Geräten testen.

## 4. Android Studio, SDK und Emulator installieren

Erst ausreichend Speicher freimachen. Dann entweder über die offizielle EXE oder Windows Package Manager installieren:

```powershell
winget install --exact --id Google.AndroidStudio
```

Im ersten Android-Studio-Start:

1. „Standard“ als Installationsart wählen.
2. Android Studio und Android Virtual Device aktiviert lassen.
3. Alle SDK-Lizenzen akzeptieren.
4. Unter `Settings > Languages & Frameworks > Android SDK` die Plattform **Android 16 / API 36** und die Sources installieren.
5. Unter `SDK Tools` mindestens Android SDK Build-Tools, Android SDK Platform-Tools und Android Emulator aktivieren.

Der Standard-SDK-Pfad unter Windows ist:

```text
%LOCALAPPDATA%\Android\Sdk
```

Danach in den Windows-Benutzervariablen setzen:

```text
ANDROID_HOME = %LOCALAPPDATA%\Android\Sdk
```

Diese Einträge zur Benutzer-Variable `Path` ergänzen:

```text
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
```

PowerShell und Codex anschließend vollständig neu öffnen und prüfen:

```powershell
adb --version
```

Offizielle Anleitungen:

- Android Studio: https://developer.android.com/studio/install
- Expo mit Android Emulator: https://docs.expo.dev/workflow/android-studio-emulator/

### Emulator anlegen

1. Android Studio öffnen.
2. `More Actions > Virtual Device Manager` wählen.
3. `Create virtual device` anklicken.
4. Als guten Start ein aktuelles Pixel-Modell wählen.
5. Ein Google-APIs-System-Image für API 36 laden.
6. AVD fertigstellen und über den Play-Button starten.
7. Im Projekt ausführen:

```powershell
npm run android
```

Ist der Emulator sehr langsam, im BIOS/UEFI CPU-Virtualisierung (Intel VT-x oder AMD-V) aktivieren und in Windows `Virtual Machine Platform` einschalten. Ein Emulator ist hilfreich, ersetzt aber keinen abschließenden Test auf einem echten Gerät.

## 5. Echtes Android-Gerät testen

### Variante A: Expo Go – empfohlen für den ersten Tag

1. Expo Go aus dem Google Play Store installieren.
2. Telefon und PC mit demselben WLAN verbinden.
3. `npm run start:go` ausführen.
4. In Expo Go „Scan QR code“ wählen.

Wenn ein Firmen-/Gast-WLAN Geräte voneinander trennt:

```powershell
npm run start:tunnel
```

### Variante B: USB / Development Build

1. Auf dem Telefon unter „Über das Telefon“ siebenmal auf die Build-Nummer tippen.
2. In den Entwickleroptionen USB-Debugging aktivieren.
3. Telefon mit einem Datenkabel anschließen und den RSA-Dialog bestätigen.
4. Unter Windows bei Bedarf den OEM-USB-Treiber installieren.
5. Verbindung prüfen:

```powershell
adb devices
```

6. Development Build lokal erzeugen und installieren:

```powershell
npm run android:native -- --device
```

Offizielle Geräteanleitung: https://developer.android.com/studio/run/device

## 6. Expo Go oder Development Build?

| Expo Go | Development Build |
|---|---|
| sofort startklar | einmalig eigene App kompilieren |
| ideal für UI, Navigation und frühe Spiellogik | für produktionsnahe Entwicklung |
| nur bereits enthaltene native Module | beliebige kompatible native Module und Konfiguration |
| App-Name/Icon/Push/App-Links nicht realistisch testbar | eigene App-ID, Icons, Push und App-Links testbar |

Empfehlung für dieses Projekt:

- Jetzt mit Expo Go starten.
- Nach dem ersten echten vertikalen Spielfluss auf Development Builds umsteigen.
- Development Build neu erstellen, wenn eine native Bibliothek installiert oder `app.json` nativ verändert wurde.
- Bei reinen TypeScript-/UI-Änderungen reicht danach wieder `npm run start:dev`.

Development Build über EAS Cloud:

```powershell
eas login
npm run eas:configure
npm run build:android:dev
```

Den erzeugten QR-Code auf dem Android-Gerät öffnen und die APK installieren. Anschließend:

```powershell
npm run start:dev
```

Referenz: https://docs.expo.dev/develop/development-builds/introduction/

## 7. iPhone unter Windows testen

Unter Windows gibt es keinen lokalen iOS-Simulator und kein Xcode. Drei Wege funktionieren trotzdem:

### Sofort und kostenlos: Expo Go auf einem echten iPhone

1. Expo Go aus dem iOS App Store installieren.
2. PC und iPhone in dasselbe WLAN bringen.
3. `npm run start:go` ausführen.
4. QR-Code mit der normalen iPhone-Kamera scannen.
5. Bei Netzwerkproblemen `npm run start:tunnel` verwenden.

Das reicht für die aktuelle Mock-App.

### Eigene iOS-Test-App: EAS Development Build

EAS kompiliert iOS in der Cloud, daher ist kein eigener Mac nötig. Für eine auf einem echten iPhone installierbare Development-App unter Windows wird in der Praxis ein Apple-Developer-Konto für Signierung und Geräte-Provisionierung benötigt.

```powershell
eas login
npm run eas:configure
npm run build:ios:dev
```

Die EAS-Abfragen zu Apple-Zugang und Geräte-Registrierung durchgehen, den Build auf dem registrierten iPhone installieren und danach `npm run start:dev` starten.

### TestFlight

Voraussetzungen sind Apple Developer Program, ein Eintrag in App Store Connect und eine eindeutige Bundle-ID. Die vorbereitete Kennung `com.betheexpert.football` vor dem ersten Store-Build prüfen und gegebenenfalls endgültig festlegen.

```powershell
npm run build:ios:production
eas submit --platform ios --profile production
```

Danach in App Store Connect den Build für interne oder externe TestFlight-Tester freigeben. Auch Build und Upload funktionieren über EAS von Windows aus.

Wichtig: Vor Store-Freigabe mindestens einmal auf einem echten iPhone testen. Für besonders tiefe iOS-Diagnose oder lokale native Swift-Änderungen wird später trotzdem ein Mac mit Xcode benötigt.

Offizielle Expo-Antwort zu iOS unter Windows: https://docs.expo.dev/faq/#can-i-develop-ios-apps-on-a-windows-computer

## 8. Git und GitHub

Das Projekt ist bereits als lokales Git-Repository initialisiert. Vor dem ersten Commit persönliche Git-Daten setzen:

```powershell
git config --global user.name "DEIN NAME"
git config --global user.email "DEINE GITHUB-E-MAIL"
```

GitHub CLI installieren und anmelden:

```powershell
winget install --exact --id GitHub.cli
gh auth login
```

Privates Repository erstellen und ersten Stand hochladen:

```powershell
git add .
git commit -m "Initialize Be the Expert Expo app"
gh repo create be-the-expert --private --source . --remote origin --push
```

Alternativ auf github.com ein leeres privates Repository `be-the-expert` erstellen und verbinden:

```powershell
git remote add origin https://github.com/DEIN-NAME/be-the-expert.git
git branch -M main
git push -u origin main
```

Vor `git add` immer `git status` prüfen. `.env`, Signierdateien und generierte native Ordner sind bereits ausgeschlossen.

## 9. Entwicklung mit Codex

Den Ordner `outputs\be-the-expert` in Codex als lokales Projekt öffnen. `AGENTS.md` beschreibt dauerhaft Stack, Architektur, Lizenzgrenzen und Qualitätsregeln.

Gute nächste Aufträge sind kleine vertikale Schritte, zum Beispiel:

```text
Erweitere den Karrierepfad auf fünf Mock-Fragen mit Ergebnisbildschirm und XP-Auswertung. Nutze die vorhandene Domain-Logik, ergänze Tests und führe npm run check aus.
```

Nicht mehrere große Systeme gleichzeitig beauftragen. Nach jeder funktionierenden Einheit auf einem echten Gerät testen und committen.

## 10. Supabase vorbereiten

Die App läuft weiterhin vollständig mit Mock-Daten. Für das Backend:

1. Unter https://database.new ein Supabase-Projekt erstellen.
2. Im `Connect`-Dialog Project URL und Publishable Key kopieren.
3. Lokale Umgebungsdatei anlegen:

```powershell
Copy-Item .env.example .env
```

4. In `.env` eintragen:

```dotenv
EXPO_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=DEIN_PUBLISHABLE_KEY
```

5. Den Inhalt von `supabase/migrations/202609050001_initial_schema.sql` im Supabase SQL Editor ausführen. Er legt `sports` und benutzereigene `profiles` mit Row Level Security an.
6. Expo nach Änderung von `.env` neu starten.

`EXPO_PUBLIC_` bedeutet: Der Wert landet im App-Bundle. Der Supabase Publishable Key ist dafür vorgesehen, wenn Row Level Security korrekt ist. Niemals `service_role`, Datenbankpasswort oder private Football-API-Schlüssel so speichern. Externe Fußball-Daten später serverseitig über eine Edge Function oder einen eigenen Importdienst abrufen.

Offizieller Expo/Supabase-Quickstart: https://supabase.com/docs/guides/getting-started/quickstarts/expo-react-native

## 11. Prüfen und testen

Nach jeder Änderung:

```powershell
npm run check
npm run doctor
```

Vor einem Release zusätzlich manuell prüfen:

| Umgebung | Mindestprüfung |
|---|---|
| Web | Layout, Navigation, offensichtliche Fehler |
| kleines Android | Touch-Ziele, Textumbruch, Zurück-Taste |
| großes Android | Abstände, Skalierung, Rotation falls später erlaubt |
| echtes Android | Performance, Netzwerk, App-Wechsel |
| echtes iPhone | Safe Areas, Navigation, Tastatur, App-Wechsel |
| Development/Preview Build | App-Icon, Splash, Deep Links, native Funktionen |

## 12. Häufige Probleme

### QR-Code verbindet nicht

```powershell
npm run start:tunnel
```

Außerdem Windows-Firewall-Freigabe für Node.js erlauben und VPN testweise trennen.

### Falsche Node-Version

```powershell
nvm use 24.20.0
node --version
```

### ADB wird nicht gefunden

Prüfen, ob `%LOCALAPPDATA%\Android\Sdk\platform-tools` im Benutzer-`Path` steht, dann alle Terminals neu öffnen.

### Expo Go meldet falsche SDK-Version

Expo Go aktualisieren. Dieses Projekt verwendet SDK 57. Für produktive Arbeit anschließend einen eigenen Development Build verwenden.

### Cache wirkt veraltet

```powershell
npx expo start --clear --go
```

### Abhängigkeiten passen nicht zusammen

```powershell
npm run doctor
npx expo install --fix
```

Keine blinden `npm audit fix --force`-Aufrufe: Expo-Pakete müssen zur SDK-Version passen.
