#!/bin/bash
# Gradle-free Android build: JDK 17 + Android SDK (platforms;android-34, build-tools;34.0.0). Signs with the same debug key as Mevlanas.
set -e
cd "$(dirname "$0")"
JAVA_HOME=${JAVA_HOME:-$(ls -d /opt/jdk-17* | head -1)}; export PATH=$JAVA_HOME/bin:$PATH
SDK=${ANDROID_HOME:-/opt/android}; BT=$SDK/build-tools/34.0.0; AJ=$SDK/platforms/android-34/android.jar
KS=${KEYSTORE:-$HOME/.android/debug.keystore}
W=android/assets/www; rm -rf android/assets android/out && mkdir -p $W/data $W/timings android/out/cls
cp index.html app.js scenes.js infaq.js Amiri.ttf icon-192.png icon-512.png manifest.webmanifest $W/ && cp data/*.json $W/data/ && cp timings/*.json $W/timings/
cd android
$BT/aapt2 compile --dir res -o out/res.zip
$BT/aapt2 link -I $AJ --manifest AndroidManifest.xml -A assets -o out/base.apk out/res.zip
javac -nowarn -source 8 -target 8 -cp $AJ -d out/cls src/com/knowboran/juzdaily/Main.java
$BT/d8 --lib $AJ --min-api 24 --output out out/cls/com/knowboran/juzdaily/*.class
cp out/base.apk out/u.apk
python3 -c "import zipfile;zipfile.ZipFile('out/u.apk','a').write('out/classes.dex','classes.dex')"
$BT/zipalign -f 4 out/u.apk out/a.apk
$BT/apksigner sign --ks "$KS" --ks-pass pass:android --out ../releases/Juz-Daily.apk out/a.apk
rm -f ../releases/Juz-Daily.apk.idsig
$BT/apksigner verify --print-certs ../releases/Juz-Daily.apk | head -3 && echo "Built releases/Juz-Daily.apk"
