/* WakeWay: destination alarm logic. No location data leaves the browser. */
(() => {
  'use strict';

  const STORAGE_KEY = 'wakeway-settings-v1';
  const DEFAULTS = { language: 'ar', theme: 'light', threshold: 500, destination: null, destinationName: '' };
  const translations = {
    ar: {
      eyebrow: 'منبّه الوجهة', mapHintTitle: 'اضغط على الخريطة لتحديد الوجهة', mapHintBody: 'سيظهر موقعك هنا عند تفعيل GPS.', mapAttribution: 'بيانات الخريطة © OpenStreetMap · البحث عبر Nominatim', set: 'محددة',
      kicker: 'اركب مطمئنًا', headline: 'لا تفوّت محطتك.', intro: 'حدد وجهتك، ابدأ التتبع، واترك WakeWay يراقب المسافة.', statusLabel: 'الحالة', ready: 'جاهز لتحديد وجهة', destinationTitle: 'اختر الوجهة', notSet: 'غير محددة', searchLabel: 'ابحث عن مكان', searchPlaceholder: 'ابحث عن مكان أو عنوان…', searchButton: 'بحث', clear: 'مسح', destinationEmpty: 'لم تُحدد وجهة بعد', tapMap: 'اضغط على الخريطة أو ابحث أعلاه', radiusTitle: 'أيقظني ضمن', fineTune: 'ضبط دقيق', distanceLabel: 'المسافة إلى المحطة', speedLabel: 'السرعة التقديرية', gpsLabel: 'دقة GPS', waitingForGps: 'في انتظار GPS', kmh: 'كم/س', meters: 'متر', startTracking: 'بدء التتبع', stopTracking: 'إيقاف التتبع', howItWorks: 'كيف يعمل WakeWay', helpOne: '<b>1.</b> اختر محطتك بالضغط على الخريطة أو البحث عن عنوان.', helpTwo: '<b>2.</b> اختر المسافة التي تريد أن يرن عندها الإنذار.', helpThree: '<b>3.</b> اضغط بدء التتبع. اترك الصفحة مفتوحة واسمح بالوصول إلى الموقع.', helpNote: 'لإنذارات موثوقة أثناء الرحلة، اشحن الهاتف واسمح بإشعارات وموقع التطبيق من إعدادات النظام.', privacyNote: 'يعمل في المتصفح · بلا حساب · لا تُحفظ بيانات موقعك على خادم', alarmKicker: 'الوجهة أمامك', alarmTitle: 'استيقظ — لقد اقتربت من وجهتك.', stopAlarm: 'إيقاف الإنذار', alarmFootnote: 'سيبقى التنبيه المرئي ظاهرًا حتى توقفه.', tracking: 'التتبع نشط — نراقب اقترابك', stopped: 'تم إيقاف التتبع', arrived: 'أنت داخل نطاق الإنذار', locating: 'جارٍ تحديد موقعك…', permissionDenied: 'تم رفض إذن الموقع. فعّله من إعدادات المتصفح.', locationUnavailable: 'الموقع غير متاح على هذا الجهاز.', locationTimeout: 'انتهت مهلة تحديد الموقع. حاول مجددًا.', genericLocationError: 'تعذر الوصول إلى موقعك. تحقق من GPS.', needDestination: 'حدد وجهة أولًا قبل بدء التتبع.', searchSearching: 'جارٍ البحث…', searchEmpty: 'لم نجد نتيجة. جرّب اسمًا أو عنوانًا أوضح.', searchError: 'تعذر البحث الآن. تحقق من الاتصال.', searchSelected: 'تم تحديد الوجهة من نتيجة البحث.', gpsReady: 'تم تحديث الموقع', wakeLockHint: 'لاستمرار التتبع، أبقِ هذه الصفحة مفتوحة.', permissionHint: 'اسمح بالوصول إلى موقعك لبدء التتبع.', installHint: 'يمكنك تثبيت WakeWay من قائمة المتصفح.', noGpsSupport: 'هذا المتصفح لا يدعم تحديد الموقع.', alarmIn: 'بعد', withinRadius: 'داخل النطاق المحدد', searchResult: 'النتيجة الأولى',
    },
    en: {
      eyebrow: 'DESTINATION ALARM', mapHintTitle: 'Tap the map to set a destination', mapHintBody: 'Your position appears here when GPS is enabled.', mapAttribution: 'Map data © OpenStreetMap · Search by Nominatim', set: 'SET',
      kicker: 'RIDE WITH PEACE OF MIND', headline: 'Never miss your stop.', intro: 'Set your destination, start tracking, and let WakeWay do the watching.', statusLabel: 'STATUS', ready: 'Ready to set a destination', destinationTitle: 'Choose destination', notSet: 'NOT SET', searchLabel: 'Search for a place', searchPlaceholder: 'Search a place or address…', searchButton: 'Search', clear: 'Clear', destinationEmpty: 'No destination selected', tapMap: 'Tap the map or search above', radiusTitle: 'Wake me within', fineTune: 'Fine tune', distanceLabel: 'DISTANCE TO STOP', speedLabel: 'EST. SPEED', gpsLabel: 'GPS ACCURACY', waitingForGps: 'Waiting for GPS', kmh: 'km/h', meters: 'meters', startTracking: 'Start tracking', stopTracking: 'Stop tracking', howItWorks: 'How WakeWay works', helpOne: '<b>1.</b> Choose your stop by tapping the map or searching for an address.', helpTwo: '<b>2.</b> Pick how close you want to be before the alarm rings.', helpThree: '<b>3.</b> Press Start tracking. Keep this tab open and allow location access.', helpNote: 'For reliable alerts during the ride, keep your phone charged and allow notification/location access in system settings.', privacyNote: 'Runs in your browser · No account · No location stored on a server', alarmKicker: 'DESTINATION AHEAD', alarmTitle: 'Wake up — you’re almost there.', stopAlarm: 'Stop alarm', alarmFootnote: 'The visual alert stays on until you stop it.', tracking: 'Tracking active — watching your approach', stopped: 'Tracking stopped', arrived: 'You are inside the alarm radius', locating: 'Finding your location…', permissionDenied: 'Location permission was denied. Enable it in browser settings.', locationUnavailable: 'Location is not available on this device.', locationTimeout: 'Location request timed out. Try again.', genericLocationError: 'Could not access your location. Check GPS.', needDestination: 'Choose a destination before starting tracking.', searchSearching: 'Searching…', searchEmpty: 'No result found. Try a clearer place name or address.', searchError: 'Search is unavailable right now. Check your connection.', searchSelected: 'Destination set from the search result.', gpsReady: 'Location updated', wakeLockHint: 'Keep this page open to continue tracking.', permissionHint: 'Allow location access to start tracking.', installHint: 'Install WakeWay from your browser menu.', noGpsSupport: 'This browser does not support location services.', alarmIn: 'In', withinRadius: 'Within selected radius', searchResult: 'Top result',
    }
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    map: $('map'), statusCard: $('statusCard'), statusIcon: $('statusIcon'), statusText: $('statusText'), accuracyBadge: $('accuracyBadge'),
    searchForm: $('searchForm'), searchInput: $('searchInput'), searchMessage: $('searchMessage'), destinationDetails: $('destinationDetails'), destinationName: $('destinationName'), destinationCoords: $('destinationCoords'), destinationBadge: $('destinationBadge'), clearDestinationButton: $('clearDestinationButton'),
    thresholdRange: $('thresholdRange'), thresholdOutput: $('thresholdOutput'), distanceValue: $('distanceValue'), distanceSub: $('distanceSub'), speedValue: $('speedValue'), gpsValue: $('gpsValue'), speedUnit: $('speedUnit'),
    startButton: $('startButton'), stopButton: $('stopButton'), locateButton: $('locateButton'), themeButton: $('themeButton'), languageButton: $('languageButton'), installButton: $('installButton'),
    alarmOverlay: $('alarmOverlay'), alarmDistance: $('alarmDistance'), dismissAlarmButton: $('dismissAlarmButton'), toast: $('toast')
  };

  let settings = loadSettings();
  let map; let destinationMarker; let destinationCircle; let userMarker; let accuracyCircle;
  let watchId = null; let lastPosition = null; let currentPosition = null; let currentDistance = null; let alarmActive = false;
  let audioContext = null; let alarmTimer = null; let vibrationTimer = null; let wakeLock = null; let deferredInstallPrompt = null; let toastTimer = null;

  function loadSettings() {
    try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; } catch { return { ...DEFAULTS }; }
  }
  function saveSettings() { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
  function t(key) { return translations[settings.language]?.[key] || translations.en[key] || key; }
  function applyTranslations() {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach((node) => { node.innerHTML = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    els.languageButton.textContent = settings.language === 'ar' ? 'EN' : 'ع';
    els.speedUnit.textContent = t('kmh');
    updateThresholdUI();
    if (!currentPosition) setStatus('idle', t('ready'));
    else if (watchId !== null && !alarmActive) setStatus('tracking', t('tracking'));
    if (settings.destination) updateDestinationUI();
  }
  function applyTheme() { document.body.classList.toggle('dark', settings.theme === 'dark'); els.themeButton.textContent = settings.theme === 'dark' ? '☼' : '◐'; }

  function initMap() {
    map = L.map(els.map, { zoomControl: false, preferCanvas: true }).setView([31.95, 35.91], 7);
    L.control.zoom({ position: 'bottomleft' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    map.on('click', (event) => setDestination(event.latlng.lat, event.latlng.lng, 'Map pin'));
    if (settings.destination) setDestination(settings.destination.lat, settings.destination.lng, settings.destinationName || 'Saved destination', false);
  }
  function destinationIcon() { return L.divIcon({ className: '', html: '<div class="destination-marker"></div>', iconSize: [28, 28], iconAnchor: [14, 26], popupAnchor: [0, -24] }); }
  function userIcon() { return L.divIcon({ className: '', html: '<div class="user-marker"></div>', iconSize: [22, 22], iconAnchor: [11, 11] }); }
  function setDestination(lat, lng, name = 'Map pin', persist = true) {
    const destination = { lat: Number(lat), lng: Number(lng) };
    settings.destination = destination; settings.destinationName = name; if (persist) saveSettings();
    if (destinationMarker) map.removeLayer(destinationMarker);
    if (destinationCircle) map.removeLayer(destinationCircle);
    destinationMarker = L.marker([destination.lat, destination.lng], { icon: destinationIcon(), title: name }).addTo(map).bindPopup(`<strong>${escapeHtml(name)}</strong>`);
    destinationCircle = L.circle([destination.lat, destination.lng], { radius: settings.threshold, color: '#ff6b5f', weight: 2, opacity: .8, fillColor: '#ff6b5f', fillOpacity: .11 }).addTo(map);
    updateDestinationUI();
    els.startButton.disabled = false;
    if (!currentPosition) map.setView([destination.lat, destination.lng], 15);
    else fitMapToTrip();
  }
  function updateDestinationUI() {
    const hasDestination = Boolean(settings.destination);
    els.destinationBadge.textContent = hasDestination ? t('set') : t('notSet');
    els.destinationBadge.style.color = hasDestination ? 'var(--signal-deep)' : '';
    els.destinationName.textContent = hasDestination ? (settings.destinationName || t('destinationTitle')) : t('destinationEmpty');
    els.destinationCoords.textContent = hasDestination ? `${settings.destination.lat.toFixed(5)}, ${settings.destination.lng.toFixed(5)}` : t('tapMap');
    els.destinationDetails.classList.toggle('empty-details', !hasDestination);
    els.clearDestinationButton.classList.toggle('hidden', !hasDestination);
    els.startButton.disabled = !hasDestination || watchId !== null;
  }
  function updateThresholdUI() {
    const meters = Number(settings.threshold);
    els.thresholdRange.value = meters; els.thresholdOutput.textContent = formatDistance(meters, true);
    document.querySelectorAll('.preset-button').forEach((button) => button.classList.toggle('active', Number(button.dataset.threshold) === meters));
    if (destinationCircle) destinationCircle.setRadius(meters);
    const percentage = ((meters - 100) / (5000 - 100)) * 100;
    els.thresholdRange.style.background = `linear-gradient(90deg, ${settings.theme === 'dark' ? '#9eff00' : '#6dad00'} ${percentage}%, var(--line) ${percentage}%)`;
  }
  function clearDestination() {
    settings.destination = null; settings.destinationName = ''; saveSettings();
    if (destinationMarker) { map.removeLayer(destinationMarker); destinationMarker = null; }
    if (destinationCircle) { map.removeLayer(destinationCircle); destinationCircle = null; }
    updateDestinationUI(); setStatus(watchId === null ? 'idle' : 'tracking', watchId === null ? t('ready') : t('tracking'));
  }

  function startTracking() {
    if (!settings.destination) { showToast(t('needDestination')); return; }
    if (!navigator.geolocation) { setStatus('error', t('noGpsSupport')); return; }
    stopAlarm();
    // A user gesture unlocks audio on mobile browsers before any future alarm.
    ensureAudio();
    if (audioContext?.state === 'suspended') audioContext.resume();
    setStatus('tracking', t('locating')); els.startButton.disabled = true; els.stopButton.disabled = false;
    watchId = navigator.geolocation.watchPosition(handlePosition, handleLocationError, { enableHighAccuracy: true, maximumAge: 4000, timeout: 15000 });
    requestWakeLock();
    showToast(t('permissionHint'));
  }
  function stopTracking() {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    watchId = null; lastPosition = null; releaseWakeLock(); stopAlarm();
    els.startButton.disabled = !settings.destination; els.stopButton.disabled = true;
    setStatus('idle', t('stopped'));
  }
  function handlePosition(position) {
    const coords = position.coords; const now = Date.now();
    if (lastPosition && position.timestamp > lastPosition.timestamp) {
      const movement = haversine(lastPosition.coords.latitude, lastPosition.coords.longitude, coords.latitude, coords.longitude);
      const seconds = (position.timestamp - lastPosition.timestamp) / 1000;
      const speedKmh = seconds > 0 ? (movement / seconds) * 3.6 : 0;
      // Ignore implausible GPS jumps; keep the last useful estimate otherwise.
      if (speedKmh < 180) els.speedValue.textContent = speedKmh < 1 ? '0.0' : speedKmh.toFixed(1);
    }
    lastPosition = { coords, timestamp: position.timestamp || now }; currentPosition = position;
    updateUserLocation(coords); updateMetrics(coords); setStatus(alarmActive ? 'alarm' : 'tracking', alarmActive ? t('arrived') : t('tracking'));
  }
  function handleLocationError(error) {
    const message = error.code === 1 ? t('permissionDenied') : error.code === 2 ? t('locationUnavailable') : error.code === 3 ? t('locationTimeout') : t('genericLocationError');
    setStatus('error', message); showToast(message);
    if (error.code === 1) stopTracking();
  }
  function updateUserLocation(coords) {
    const latlng = [coords.latitude, coords.longitude];
    if (!userMarker) userMarker = L.marker(latlng, { icon: userIcon(), zIndexOffset: 1000, title: 'Your location' }).addTo(map);
    else userMarker.setLatLng(latlng);
    if (!accuracyCircle) accuracyCircle = L.circle(latlng, { radius: coords.accuracy || 0, color: '#4e7cff', weight: 1, opacity: .5, fillColor: '#4e7cff', fillOpacity: .08 }).addTo(map);
    else accuracyCircle.setLatLng(latlng).setRadius(coords.accuracy || 0);
    els.gpsValue.textContent = Math.round(coords.accuracy || 0);
    els.accuracyBadge.textContent = `±${Math.round(coords.accuracy || 0)} m`;
    if (!settings.destination) map.setView(latlng, 16);
    fitMapToTrip(false);
  }
  function updateMetrics(coords) {
    if (!settings.destination) return;
    currentDistance = haversine(coords.latitude, coords.longitude, settings.destination.lat, settings.destination.lng);
    els.distanceValue.textContent = formatDistance(currentDistance);
    els.distanceSub.textContent = currentDistance <= settings.threshold ? t('withinRadius') : `${t('alarmIn')} ${formatDistance(Math.max(0, currentDistance - settings.threshold))}`;
    if (!alarmActive && currentDistance <= settings.threshold) triggerAlarm();
  }
  function fitMapToTrip(force = false) {
    if (!currentPosition || !settings.destination || !map) return;
    if (!force && map.getZoom() >= 15) return;
    const group = L.featureGroup([destinationMarker, userMarker].filter(Boolean));
    if (group.getLayers().length > 1) map.fitBounds(group.getBounds().pad(.35), { maxZoom: 16, animate: true });
  }
  function locateUser() {
    if (currentPosition) { map.setView([currentPosition.coords.latitude, currentPosition.coords.longitude], 16); return; }
    if (!navigator.geolocation) { showToast(t('noGpsSupport')); return; }
    navigator.geolocation.getCurrentPosition((position) => { handlePosition(position); map.setView([position.coords.latitude, position.coords.longitude], 16); }, handleLocationError, { enableHighAccuracy: true, timeout: 12000 });
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; const toRad = (value) => value * Math.PI / 180;
    const dLat = toRad(lat2 - lat1); const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  function formatDistance(meters, compact = false) {
    if (!Number.isFinite(meters)) return '—';
    if (meters < 1000) return `${Math.round(meters)} ${compact ? 'm' : 'm'}`;
    return `${(meters / 1000).toFixed(meters < 10000 ? 2 : 1)} ${compact ? 'km' : 'km'}`;
  }
  function setStatus(type, text) { els.statusCard.className = `status-card status-${type}`; els.statusText.textContent = text; els.statusIcon.textContent = type === 'tracking' ? '●' : type === 'alarm' ? '!' : type === 'error' ? '×' : '○'; }

  function ensureAudio() {
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return false;
      try { audioContext = new AudioCtor(); } catch { return false; }
    }
    if (audioContext.state === 'suspended') audioContext.resume();
    return true;
  }
  function beep() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
    oscillator.type = 'square'; oscillator.frequency.setValueAtTime(880, audioContext.currentTime); oscillator.frequency.setValueAtTime(660, audioContext.currentTime + .18);
    gain.gain.setValueAtTime(.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.26, audioContext.currentTime + .02); gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + .42);
    oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + .45);
  }
  function triggerAlarm() {
    alarmActive = true; setStatus('alarm', t('arrived')); els.alarmOverlay.hidden = false; els.alarmDistance.textContent = `${formatDistance(currentDistance || settings.threshold)} · ${t('withinRadius')}`;
    ensureAudio(); beep(); clearInterval(alarmTimer); alarmTimer = setInterval(beep, 900);
    if ('vibrate' in navigator) { navigator.vibrate([700, 300, 700, 300, 1200]); clearInterval(vibrationTimer); vibrationTimer = setInterval(() => navigator.vibrate([700, 300, 700]), 2500); }
    try { document.title = `⚠ ${t('alarmTitle')}`; } catch {}
  }
  function stopAlarm() {
    alarmActive = false; els.alarmOverlay.hidden = true; clearInterval(alarmTimer); clearInterval(vibrationTimer); alarmTimer = null; vibrationTimer = null; if ('vibrate' in navigator) navigator.vibrate(0); document.title = 'WakeWay — Destination Alarm';
  }
  async function requestWakeLock() { if (!('wakeLock' in navigator)) return; try { wakeLock = await navigator.wakeLock.request('screen'); } catch { /* optional capability */ } }
  async function releaseWakeLock() { if (wakeLock) { try { await wakeLock.release(); } catch {} wakeLock = null; } }

  async function searchDestination(event) {
    event.preventDefault(); const query = els.searchInput.value.trim(); if (!query) return;
    els.searchMessage.className = 'inline-message'; els.searchMessage.textContent = t('searchSearching');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=${settings.language}&q=${encodeURIComponent(query)}`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('search'); const results = await response.json();
      if (!results.length) { els.searchMessage.className = 'inline-message error'; els.searchMessage.textContent = t('searchEmpty'); return; }
      const result = results[0]; setDestination(Number(result.lat), Number(result.lon), result.display_name.split(',').slice(0, 2).join(', ')); els.searchMessage.textContent = t('searchSelected'); els.searchInput.value = '';
    } catch { els.searchMessage.className = 'inline-message error'; els.searchMessage.textContent = t('searchError'); }
  }
  function showToast(message) { clearTimeout(toastTimer); els.toast.textContent = message; els.toast.classList.add('visible'); toastTimer = setTimeout(() => els.toast.classList.remove('visible'), 3800); }
  function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstallPrompt = event; els.installButton.classList.remove('hidden'); });
    els.installButton.addEventListener('click', async () => { if (!deferredInstallPrompt) return; deferredInstallPrompt.prompt(); await deferredInstallPrompt.userChoice; deferredInstallPrompt = null; els.installButton.classList.add('hidden'); });
  }
  function bindEvents() {
    els.searchForm.addEventListener('submit', searchDestination);
    els.clearDestinationButton.addEventListener('click', clearDestination);
    els.startButton.addEventListener('click', startTracking); els.stopButton.addEventListener('click', stopTracking); els.dismissAlarmButton.addEventListener('click', stopAlarm); els.locateButton.addEventListener('click', locateUser);
    els.themeButton.addEventListener('click', () => { settings.theme = settings.theme === 'dark' ? 'light' : 'dark'; saveSettings(); applyTheme(); updateThresholdUI(); });
    els.languageButton.addEventListener('click', () => { settings.language = settings.language === 'ar' ? 'en' : 'ar'; saveSettings(); applyTranslations(); });
    els.thresholdRange.addEventListener('input', () => { settings.threshold = Number(els.thresholdRange.value); saveSettings(); updateThresholdUI(); });
    document.querySelectorAll('.preset-button').forEach((button) => button.addEventListener('click', () => { settings.threshold = Number(button.dataset.threshold); saveSettings(); updateThresholdUI(); }));
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && watchId !== null) requestWakeLock(); });
  }
  async function registerServiceWorker() { if ('serviceWorker' in navigator) { try { await navigator.serviceWorker.register('/sw.js'); } catch (error) { console.info('Service worker registration skipped', error); } } }

  function init() {
    applyTheme(); initMap(); applyTranslations(); bindEvents(); setupInstallPrompt(); registerServiceWorker();
    if (!window.isSecureContext && location.hostname !== 'localhost') showToast(settings.language === 'ar' ? 'يحتاج GPS إلى اتصال HTTPS أو localhost.' : 'GPS requires HTTPS or localhost.');
  }
  init();
})();
