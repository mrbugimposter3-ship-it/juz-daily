# ورد الجزء اليومي — Daily Juz

A Gregorian month calendar where every day opens one juz of the Quran, recited by **Sheikh Abdulrahman Al-Ossi (عبدالرحمن العوسي)**, with word-by-word highlighting and soft background visuals that follow the meaning of each ayah.

**Live app:** https://mrbugimposter3-ship-it.github.io/juz-daily/ · **Android:** [`releases/Juz-Daily.apk`](releases/Juz-Daily.apk)

- **Calendar rule:** day 1–30 of the month = juz 1–30; day 31 = juz 30 again. Today is highlighted; finished days get a ✓ (saved on the device).
- **Three calendars (v1.1)** — a tab switch at the top (ميلادي | هجري | الطبيعة); the last tab is remembered.
  - **هجري (Hijri):** Umm al-Qura months (`Intl` calendar `islamic-umalqura`, checked against Aladhan/Umm al-Qura: 22 Oct 2026 = 11 Jumada al-Ula 1448). Hijri day 1–30 = juz 1–30; a 29-day month simply ends at juz 29. Each cell shows the Hijri day big and the Gregorian date small. Marked: 1 Muharram, Tasu'a & Ashura (9–10 Muharram), 1 Ramadan, the last ten (21–30 Ramadan), the odd nights 21/23/25/27/29 (marked on the evening they begin), Eid al-Fitr, the first ten of Dhul Hijjah, Tarwiyah (8), Arafah (9), Eid al-Adha (10), Tashreeq (11–13), the white days 13/14/15 (not in Ramadan, not 13 Dhul Hijjah), and a subtle dot on Mondays/Thursdays (not on Eid/Tashreeq or in Ramadan). Mawlid and Isra-Mi'raj are deliberately not marked. Devices without Umm al-Qura support fall back to the tabular Islamic calendar (flagged on screen). Local moon sighting may differ by a day.
  - **الطبيعة (Nature):** Gregorian month with a season scene (SVG, no images) for the chosen city (default Toronto; change it by name via Open-Meteo geocoding, saved on the device). Equinoxes & solstices (Meeus ch. 27 refined with truncated VSOP87 — within ~5 s of JPL DE421), cross-quarter days (Sun at 45/135/225/315°), new & full moons (Meeus ch. 49), sunrise/sunset per day, day length and its daily change, a whole-year day-length curve, longest/shortest day, all computed in `astro.js` and shown in the city's time zone. Weather from Open-Meteo (`/v1/forecast`, past 31 days + next 16 days: icon, high/low; cached for an hour). Tapping a day opens that day's juz (Gregorian rule).
  - The ✓ completion store is keyed by Gregorian date, so all three views agree. Opening a day from the Hijri tab passes the juz explicitly (`#d=YYYY-MM-DD&j=N`).
- **Screen stays on (☀️ in the header, default on):** Android sets `FLAG_KEEP_SCREEN_ON` (toggled through a small JS bridge); browsers use the Screen Wake Lock API, requested on the first tap and re-acquired when the page becomes visible again; silently ignored where unsupported (iOS Safari 16.4+ supports it, older iPads don't).
- **Player:** ayah-by-ayah with auto-scroll, tap any word to jump there, play/pause, previous/next ayah, speed 0.75×–1.5×, text size, resume where you stopped.
- **Meaning line:** Arabic only / English (Pickthall, public domain) / اردو (Fateh Muhammad Jalandhry).
- **Background visuals** (drawn in SVG/CSS in `scenes.js`, no outside images): mercy, paradise, fire, water, night, creation, prophets' stories, charity, prayer, and a calm default, chosen by keyword matching on Pickthall's English meaning.

## Sources
- Audio: [mp3quran.net](https://mp3quran.net) reciter 225, one file per surah: `https://cdn.mp3quran.net/audio/abdulrahman-oosi/r1/NNN.mp3` (NNN = 001–114).
- Ayah timings: `https://www.mp3quran.net/api/v3/ayat_timing?surah=N&read=225` (stored as `t:[start_ms,end_ms]` inside the surah file in `data/juz-NN.json`).
- Uthmani text: `api.alquran.cloud` edition `quran-uthmani`; meanings `en.pickthall`, `ur.jalandhry`. Built by `gen_data.py`.

- Weather & city search: [Open-Meteo.com](https://open-meteo.com/) (data CC BY 4.0, attribution in the app footer); city names from GeoNames.
- Astronomy: computed on the device (`astro.js`): Meeus, *Astronomical Algorithms*; VSOP87D Earth series (Bretagnon & Francou, CDS VI/81), truncated.

## Word timings
Without alignment data, highlighting inside an ayah is **approximate** (split by word length). Real timings can be dropped into `timings/juz-NN.json`:

```json
[{"surah":78,"ayah":1,"words":[[0,620],[620,1500]]}]
```
`words` must have one `[start_ms,end_ms]` pair per entry of that ayah's `w` array in `data/juz-NN.json`; times are relative to the ayah's start inside the surah mp3 (add `"base":"surah"` for absolute surah-file times). Then run `python3 update_timings_index.py` so `timings/index.json` lists the juz.

## Build the APK
Version 1.1 (versionCode 2). `./build.sh` (JDK 17, Android SDK build-tools 34, no Gradle) → `releases/Juz-Daily.apk`. Links open in the phone's browser.

---
### الإنفاق في سبيل الله
> مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى كُلِّ سُنۢبُلَةٍۢ مِّا۟ئَةُ حَبَّةٍۢ ۗ وَٱللَّهُ يُضَٰعِفُ لِمَن يَشَآءُ ۗ وَٱللَّهُ وَٰسِعٌ عَلِيمٌ — البقرة ٢٦١

> Tools we use: [Postiz](https://postiz.pro/mr-bug) (referral link — we may earn a commission)
