# Be the Expert development rules

## Product

- Be the Expert is a mobile sports-knowledge game.
- Implement football only until another sport is explicitly requested.
- The product is a long-term career and skill game, not a collection of disconnected quizzes.
- Do not add club logos, player photos, competition marks, or other licensed artwork without explicit approval and verified rights.

## Technology

- Expo SDK 57, React Native, Expo Router, and TypeScript in strict mode.
- Read the exact versioned Expo docs at https://docs.expo.dev/versions/v57.0.0/ before changing Expo APIs or native configuration.
- Supabase is the intended backend. Never put a service-role key or third-party football-data API key in the mobile app.
- `EXPO_PUBLIC_` values are embedded in the client bundle. Only publishable client configuration belongs there.

## Architecture

- Route files in `src/app` stay thin and render feature screens.
- UI and state for a feature belong in `src/features/<feature>`.
- Reusable primitives belong in `src/components/ui`.
- Pure game rules belong in `src/features/quiz/domain` and must not depend on React.
- Use mock data until a backend task explicitly connects a feature.
- Database changes require a migration in `supabase/migrations`.

## Quality

- Start long-running development servers only in a visible terminal window that the user can stop, or let the user launch `SERVER STARTEN.cmd`. Do not leave hidden tool-session servers running.

- Support Android and iOS; avoid platform-specific code unless necessary.
- Keep TypeScript strict and add tests for game/scoring rules.
- Run `npm run check` and `npm run doctor` before considering an implementation complete.
- Never remove or weaken tests just to make a check pass.
- Prefer small vertical slices that can be tested on a real device.
