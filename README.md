# ورد الجزء اليومي — Daily Juz

A Gregorian month calendar where every day opens one juz of the Quran, recited by **Sheikh Abdulrahman Al-Ossi (عبدالرحمن العوسي)**, with word-by-word highlighting and soft background visuals that follow the meaning of each ayah.

**Live app:** https://mrbugimposter3-ship-it.github.io/juz-daily/ · **Android:** [`releases/Juz-Daily.apk`](releases/Juz-Daily.apk)

- **Calendar rule:** day 1–30 of the month = juz 1–30; day 31 = juz 30 again. Today is highlighted; finished days get a ✓ (saved on the device).
- **Player:** ayah-by-ayah with auto-scroll, tap any word to jump there, play/pause, previous/next ayah, speed 0.75×–1.5×, text size, resume where you stopped.
- **Meaning line:** Arabic only / English (Pickthall, public domain) / اردو (Fateh Muhammad Jalandhry).
- **Background visuals** (drawn in SVG/CSS in `scenes.js`, no outside images): mercy, paradise, fire, water, night, creation, prophets' stories, charity, prayer, and a calm default, chosen by keyword matching on Pickthall's English meaning.

## Sources
- Audio: [mp3quran.net](https://mp3quran.net) reciter 225, one file per surah: `https://cdn.mp3quran.net/audio/abdulrahman-oosi/r1/NNN.mp3` (NNN = 001–114).
- Ayah timings: `https://www.mp3quran.net/api/v3/ayat_timing?surah=N&read=225` (stored as `t:[start_ms,end_ms]` inside the surah file in `data/juz-NN.json`).
- Uthmani text: `api.alquran.cloud` edition `quran-uthmani`; meanings `en.pickthall`, `ur.jalandhry`. Built by `gen_data.py`.

## Word timings
Without alignment data, highlighting inside an ayah is **approximate** (split by word length). Real timings can be dropped into `timings/juz-NN.json`:

```json
[{"surah":78,"ayah":1,"words":[[0,620],[620,1500]]}]
```
`words` must have one `[start_ms,end_ms]` pair per entry of that ayah's `w` array in `data/juz-NN.json`; times are relative to the ayah's start inside the surah mp3 (add `"base":"surah"` for absolute surah-file times). Then run `python3 update_timings_index.py` so `timings/index.json` lists the juz.

## Build the APK
`./build.sh` (JDK 17, Android SDK build-tools 34, no Gradle) → `releases/Juz-Daily.apk`. Links open in the phone's browser.

---
### الإنفاق في سبيل الله
> مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى كُلِّ سُنۢبُلَةٍۢ مِّا۟ئَةُ حَبَّةٍۢ ۗ وَٱللَّهُ يُضَٰعِفُ لِمَن يَشَآءُ ۗ وَٱللَّهُ وَٰسِعٌ عَلِيمٌ — البقرة ٢٦١

> Tools we use: [Postiz](https://postiz.pro/mr-bug) (referral link — we may earn a commission)
