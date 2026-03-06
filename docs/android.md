# FORGES Android Build Guide

This document explains how to build the FORGES platform as an Android APK using [Capacitor](https://capacitorjs.com/).

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | [nodejs.org](https://nodejs.org) |
| pnpm | 9+ | `npm install -g pnpm` |
| Java (JDK) | 17 | [Adoptium Temurin](https://adoptium.net) |
| Android Studio | Latest stable | [developer.android.com](https://developer.android.com/studio) |
| Android SDK | API 34 (target) / 23 (min) | via Android Studio SDK Manager |

---

## Quick Start

```bash
# 1. Install all dependencies
pnpm install

# 2. Build the Next.js static export and sync into the Android project
pnpm run build:android

# 3. Open Android Studio to run/debug on an emulator or physical device
pnpm run cap:open:android
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm run export:android` | Builds Next.js with `output: 'export'` into the `out/` directory |
| `pnpm run build:android` | Runs `export:android` then syncs assets into the Android project |
| `pnpm run cap:sync` | Syncs web assets and Capacitor plugins into the native project |
| `pnpm run cap:open:android` | Opens the `android/` project in Android Studio |

---

## Build Modes

### Debug APK (local / CI)

```bash
pnpm run build:android
cd android
./gradlew assembleDebug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (signed)

Set up a keystore and use the following environment variables:

```bash
KEYSTORE_BASE64=<base64-encoded keystore>
KEYSTORE_PASSWORD=<store password>
KEY_ALIAS=<key alias>
KEY_PASSWORD=<key password>
```

Then build:

```bash
pnpm run build:android
cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=../release.keystore \
  -Pandroid.injected.signing.store.password="$KEYSTORE_PASSWORD" \
  -Pandroid.injected.signing.key.alias="$KEY_ALIAS" \
  -Pandroid.injected.signing.key.password="$KEY_PASSWORD"
# → android/app/build/outputs/apk/release/app-release.apk
```

### Remote server mode

To point the APK at a deployed FORGES instance rather than bundling the static export, set the `SERVER_URL` environment variable at build time:

```bash
SERVER_URL=https://forges.example.com pnpm run build:android
```

This embeds the URL into `capacitor.config.ts` so the APK loads content from your server.

---

## CI/CD (GitHub Actions)

The workflow at `.github/workflows/android-build.yml` automatically:

- Builds a **debug APK** on every push to `main` and every pull request.
- Attaches the APK to a **GitHub Release** when a version tag (`v*`) is pushed.
- Supports a **manual `workflow_dispatch`** trigger to build a signed release APK.

### Required GitHub Secrets (release builds only)

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded `.jks` / `.keystore` file |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

To encode your keystore:

```bash
base64 -w 0 release.keystore > keystore.b64
# Copy the contents of keystore.b64 into the secret
```

---

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml        # App permissions & activity declaration
│   │   ├── assets/
│   │   │   ├── capacitor.config.json  # Capacitor runtime config (synced)
│   │   │   └── capacitor.plugins.json # Registered plugins (synced)
│   │   ├── java/com/smsdao/forges/
│   │   │   └── MainActivity.java      # Entry point — extends BridgeActivity
│   │   └── res/                       # App icons, splash, colors, strings
│   ├── build.gradle                   # Module-level Gradle config
│   └── capacitor.build.gradle         # Capacitor-injected Gradle helpers
├── build.gradle                       # Project-level Gradle config
├── capacitor.settings.gradle          # Capacitor module imports
├── gradle.properties                  # JVM / AndroidX flags
├── gradlew                            # Gradle wrapper (Unix)
├── settings.gradle                    # Module includes
└── variables.gradle                   # SDK versions & dependency versions
capacitor.config.ts                    # Root Capacitor configuration
```

---

## Troubleshooting

**`cap sync` fails with "webDir does not exist"**
Run `pnpm run export:android` first to create the `out/` directory.

**`gradle-wrapper.jar` missing**
The binary JAR is not stored in this repository. Either regenerate it:
```bash
cd android
gradle wrapper --gradle-version 8.4 --distribution-type bin
```
or download it directly:
```bash
curl -sSfL \
  "https://raw.githubusercontent.com/gradle/gradle/v8.4.0/gradle/wrapper/gradle-wrapper.jar" \
  -o android/gradle/wrapper/gradle-wrapper.jar
```
The CI workflow fetches the JAR automatically.

**Blank screen on device**
Ensure `allowNavigation` is set if using a remote `SERVER_URL`, and that the server is accessible from the device.

**Gradle daemon OOM**
Increase heap in `android/gradle.properties`:
```properties
org.gradle.jvmargs=-Xmx4096m -Dfile.encoding=UTF-8
```

**`JAVA_HOME` not set**
Install JDK 17 and set the variable:
```bash
export JAVA_HOME=/usr/lib/jvm/temurin-17
```
