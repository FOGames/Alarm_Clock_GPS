# WakeWay — Destination Alarm

WakeWay is a bilingual Arabic/English PWA for public transportation passengers. It uses Leaflet + OpenStreetMap, browser GPS, the Haversine formula, Web Audio, vibration, and local browser storage. No backend or paid map key is required.

## Run locally

1. Serve the project over `localhost` or HTTPS. GPS and service workers are restricted by browsers to secure contexts.
2. From the project directory, run one of the following:

```bash
python3 -m http.server 3000 --bind 0.0.0.0
# or
npx --yes serve . -l 3000
```

3. Open `http://localhost:3000` in a modern mobile or desktop browser.
4. Allow location access. Tap the map or search for an address to set the destination.
5. Choose 100 m, 500 m, 1 km, or fine-tune the range. Press **Start tracking**.
6. To test without moving, use browser DevTools > Sensors to simulate a location near the destination. Alternatively, select a point close to your current GPS location and use a 100 m radius.

## Notes about browser capabilities

- GPS needs HTTPS or `localhost`.
- Web Audio starts after the user presses Start tracking, which satisfies mobile autoplay policies.
- Vibration, screen wake lock, and install prompts depend on device/browser support.
- Keep this page open during a ride. Background execution and alarms after the browser is fully terminated are not guaranteed by a browser PWA.
- Search uses the public Nominatim service. Please avoid rapid repeated requests and use the map pin when offline.
- Location is used in memory only and is not sent to a WakeWay server.

## Files

- `index.html` — accessible responsive interface and PWA shell.
- `styles.css` — visual system, dark/light themes, map markers, alarm overlay.
- `app.js` — map, geolocation watch, Haversine distance, audio/vibration alarm, i18n, localStorage.
- `manifest.webmanifest` / `sw.js` — install metadata and shell caching.
- `manus-routes.json` — Webdev route declaration.
