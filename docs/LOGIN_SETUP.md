# Login und persönliche Daten

Die App unterstützt Supabase-Login per E-Mail-Code, dauerhafte Sitzungen, Abmelden auf dem aktuellen Gerät, einen persönlichen Spielernamen und serverseitige Karrierebestwerte sowie Ligaauswahl. Neue Nutzer werden beim ersten bestätigten Code angelegt. Ein Passwort und ein Deep-Link-Callback sind nicht nötig; derselbe Ablauf funktioniert auch in Expo Go.

## Noch erforderlich: Supabase-Projekt

1. Im [Supabase-Dashboard](https://supabase.com/dashboard) ein Projekt erstellen. Das Datenbankpasswort sicher aufbewahren; es gehört nicht in die App.
2. Im neuen, leeren Projekt den **SQL Editor → New query** öffnen. Den gesamten Inhalt von [`supabase/SETUP_NEW_PROJECT.sql`](../supabase/SETUP_NEW_PROJECT.sql) einfügen und **Run** klicken. Das Skript einmal ausführen; es enthält beide Migrationen in einer Transaktion. Danach existieren `profiles`, `account_settings`, `career_progress` und `sports`. Falls die erste Migration schon ausgeführt wurde, nur die noch fehlende Datei `supabase/migrations/202609190001_account_career.sql` ausführen.
3. Unter Authentication den E-Mail-Anbieter und neue Registrierungen aktivieren. E-Mail-Bestätigung eingeschaltet lassen. In den E-Mail-Vorlagen **Confirm signup** und **Magic Link** den Code ausgeben, beispielsweise mit der Vorlage unten. Eine kurze Code-Gültigkeit (z. B. zehn Minuten) konfigurieren.
4. Für echte Nutzer einen eigenen SMTP-Versand unter Authentication einrichten. Der eingebaute Supabase-Testversand ist auf vorab autorisierte Team-Adressen beschränkt. Keine SMTP-Zugangsdaten in die App schreiben.
5. Unter **Connect** bzw. **Project Settings → API Keys / Data API** die Projekt-URL sowie den **Publishable-Key** kopieren. Im lokalen Projekt `.env.example` nach `.env` kopieren und diese beiden Werte eintragen:

   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=https://DEIN-PROJEKT.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=DEIN-PUBLISHABLE-KEY
   ```

   Keine Secret-/Service-Role-Keys verwenden. `.env` wird nicht versioniert. Der öffentliche Key wird beim Build absichtlich im Client eingebettet; die Datenbankregeln schützen die Nutzerdaten.
6. Den laufenden Expo-Server beenden und über `SERVER STARTEN.cmd` neu starten. Jetzt erscheint vor den Spielbereichen die Anmeldung.

Betreff der beiden Vorlagen: `Dein Be-the-Expert-Anmeldecode`

```html
<h2>Dein Anmeldecode</h2>
<p>Gib diesen Code in Be the Expert ein:</p>
<p><strong>{{ .Token }}</strong></p>
<p>Falls du keinen Code angefordert hast, ignoriere diese Nachricht.</p>
```

## Datenverhalten

### Falls trotz Code-Vorlagen weiter Link-Mails ankommen

`SUPABASE CODE-MAIL REPARIEREN.cmd` startet ein sichtbares, nach Abschluss offen bleibendes Fenster. Es verwendet die Supabase Management API, um die gespeicherten Einstellungen zu lesen, beide Anmeldevorlagen und Betreffzeilen auf Code-Versand zu setzen und `mailer_otp_length` auf 6 zu stellen. Anschließend werden die Werte erneut gelesen und verglichen. SMTP-Zugangsdaten und Bestätigungsregeln werden nicht geändert. Ein aktiver Send-Email-Hook führt zum Abbruch, da er einen eigenen Versandweg verwenden kann.

Dafür im [Supabase-Konto](https://supabase.com/dashboard/account/tokens) einen temporären Personal Access Token erstellen und nur in die unsichtbare lokale Eingabe des Werkzeugs einfügen. Der Token wird weder in `.env` noch in einer anderen Datei gespeichert und ausschließlich an `api.supabase.com` übermittelt. Danach im Dashboard widerrufen. Das Werkzeug startet keinen Server und fordert keine E-Mail an. Zum reinen Prüfen: `node scripts/repair-login-email.mjs` ohne `--apply`.

Werkzeugtests ohne Netzwerk: `node --test scripts/repair-login-email.node-test.mjs`. Ein erfolgreiches Ergebnis bestätigt gespeicherte Konfiguration, noch nicht die tatsächlich zugestellte Mail.

- Ohne Backend-Konfiguration bleibt die bisherige lokale Nutzung verfügbar. Das Profil kennzeichnet sie ausdrücklich als lokal.
- Mit Backend-Konfiguration ist die Anmeldung erforderlich. Lokale Altdaten werden **nicht automatisch** einem neuen Konto zugeordnet oder gelöscht, da ihr Besitzer nicht feststeht. Neue Konten beginnen mit eigenem Fortschritt.
- Cloud-Fortschritt wird beim Öffnen der Karriere und des Profils geladen. Speichern benötigt Internet; ein fehlgeschlagener Upload wird angezeigt und kann in der Ergebnisansicht wiederholt werden. Es gibt noch keine Offline-Synchronisierungswarteschlange.
- Bei Kontoänderungen wird der gesamte Spielbereich neu aufgebaut. Bereits geladene Daten und laufende Runden des vorherigen Kontos werden verworfen. Schreibvorgänge prüfen den ursprünglich erwarteten Nutzer.
- Die Datenbank erzwingt über RLS getrennte Profile, Einstellungen und Ergebnisse. Ein atomarer Speichervorgang erhält den höchsten Prozentwert über mehrere Geräte; bestanden ist ein Level ab **exakt 80 %**, nicht ab einer gerundeten Anzeige.
- Dies ist persönliche Fortschrittsspeicherung, keine manipulationssichere Rangliste: Spielresultate entstehen weiterhin im Client. Für spätere Wettkämpfe ist eine serverseitige Ergebnisprüfung erforderlich.
- Die bisherigen erfundenen persönlichen XP-/Ratingwerte werden in Startseite und Profil nicht mehr als Nutzerdaten angezeigt. Weitere Battle-/Spielkonzepte bleiben außerhalb dieser Kontenanbindung.

## Prüfung

`npm run check` prüft TypeScript, Lint und Tests einschließlich Konto-Wechsel, angemeldet/abgemeldet, Cloud-Fehlern und Besitzerfilterung.

Die Migrationen und tatsächlichen PostgreSQL-Berechtigungen lassen sich isoliert mit PGlite prüfen, ohne ein Cloud-Projekt anzulegen oder Produktionsdaten zu verändern:

```powershell
npm install --prefix .expo/auth-sql-test --no-package-lock --no-audit --no-fund @electric-sql/pglite
node scripts/test-account-db.mjs
```

Dieser Test verwendet eine frische temporäre Datenbank, zwei Testnutzer und simulierte JWT-Claims. Er ersetzt keinen echten Supabase-Auth-Test. Nach Einrichtung des Projekts prüfen: Erstregistrierung, erneuter Login, ungültiger/abgelaufener Code, Abmelden, App-Neustart, ein zweites Konto und dasselbe Konto auf einem zweiten Gerät. E-Mail-Zustellung und ein echter Gerätetest stehen bis zur Einrichtung aus.

`npm run doctor` meldet weiterhin die zuvor vorhandenen Expo-Patchversionsabweichungen (20/21 Checks erfolgreich). Die App-Abhängigkeiten wurden nicht geändert.

Grundlagen: [Supabase E-Mail-OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless), [React-Native-Auth](https://supabase.com/docs/guides/auth/quickstarts/react-native), [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security), [SMTP-Versand](https://supabase.com/docs/guides/auth/auth-smtp).
