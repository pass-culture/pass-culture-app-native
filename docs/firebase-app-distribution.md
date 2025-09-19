# Firebase App Distribution Scripts

This document describes the Firebase App Distribution deployment and download scripts for automated testing workflows.

## Overview

Two complementary scripts provide complete Firebase App Distribution automation:

1. **`deploy_firebase_appdistribution.sh`** - Deploy testing builds without changing version numbers
2. **`download_firebase_appdistribution.sh`** - Download and analyze releases from Firebase App Distribution

## Deployment Script

### Usage

```bash
# Deploy both platforms with incremental build number (recommended)
./scripts/deploy_firebase_appdistribution.sh -o both -b

# Deploy only iOS with Slack notifications and build increment
./scripts/deploy_firebase_appdistribution.sh -o ios -b -s https://hooks.slack.com/...

# Deploy Android to staging environment with build increment
./scripts/deploy_firebase_appdistribution.sh -o android -e staging -b

# Deploy without changing build number (legacy mode)
./scripts/deploy_firebase_appdistribution.sh -o both
```

### Build Number Management

The script now supports **automatic incremental build numbers** based on your semver version:

**Format**: `MAJORMINORPATCHCOUNTER`
- Version `1.357.2` → Build `1357002001`, `1357002002`, `1357002003`, etc.
- Version `1.358.0` → Build `1358000001`, `1358000002`, etc.

**Usage**:
- **`-b` flag**: Generates incremental build number and updates `package.json`
- **Without `-b`**: Uses existing build number from `package.json`

**Build Counter Storage**: `.build_counter` file tracks increments per version

### Automation

The deployment runs automatically:
- **Daily at 8:00 AM UTC** via GitHub Actions
- **On PR with "testme" label**
- **Manual trigger** via GitHub Actions UI

### Features

- ✅ **Incremental build numbers** - Automatic generation based on semver with counters (1357002001, 1357002002, etc.)
- ✅ **Multi-platform** - Supports iOS, Android, or both simultaneously  
- ✅ **Slack integration** - Rich notifications with commit details, build numbers, and deployment status
- ✅ **Error handling** - Comprehensive validation and error reporting
- ✅ **Security** - Proper credential management via Google Secret Manager
- ✅ **Build tracking** - Persistent counter storage for version-specific increments

## Build Number Generator

### Standalone Usage

The build number generator can be used independently:

```bash
# Generate next build number for current package.json version
./scripts/generate_incremental_build_number.sh

# Generate build number for specific version
./scripts/generate_incremental_build_number.sh -v 1.357.2

# Reset counter for current version (start from 001)
./scripts/generate_incremental_build_number.sh -r

# Show help
./scripts/generate_incremental_build_number.sh -h
```

### Build Number Format

**Pattern**: `MAJORMINORPATCHCOUNTER`

Examples:
- Version `1.357.2`, build #1 → `1357002001`
- Version `1.357.2`, build #2 → `1357002002`
- Version `1.358.0`, build #1 → `1358000001`

**Counter Management**:
- Stored in `.build_counter` JSON file
- Tracks increments per version independently  
- Automatically increments on each run
- Can be reset with `-r` flag

### Android Version Code Compatibility

The generated build numbers are compatible with Android's `versionCode` requirements:
- Must be a positive integer
- Must be strictly increasing for updates
- Maximum value: 2,147,483,647 (2³¹ - 1)

The script validates against these limits and will error if exceeded.

## Download Script

### Usage

```bash
# Download latest builds for both platforms
./scripts/download_firebase_appdistribution.sh -o both -l

# Download last 3 iOS releases to specific directory
./scripts/download_firebase_appdistribution.sh -o ios -m 3 -d ~/Downloads/firebase-builds

# Download Android releases from staging environment
./scripts/download_firebase_appdistribution.sh -o android -e staging -d ./staging-builds
```

### Features

- ✅ **Release metadata** - Downloads complete release information as JSON
- ✅ **Flexible filtering** - Latest only or specify maximum number of releases
- ✅ **Multi-platform** - Works with iOS, Android, or both
- ✅ **Environment support** - Download from testing, staging, or production
- ✅ **API integration** - Uses Firebase REST API with fallback to CLI methods

### Limitations

**Binary Download Limitation**: Firebase App Distribution API doesn't provide direct binary download URLs. The script:

1. **Downloads release metadata** (JSON files with all release information)
2. **Creates download instructions** for manual binary downloads via Firebase Console
3. **Saves organized data** for automated analysis and reporting

For actual APK/IPA downloads, users must:
1. Use the Firebase Console web interface
2. Follow the generated instructions in `download_instructions.txt`
3. Use the release metadata to identify which releases to download

## GitHub Actions Integration

### Deploy Workflow
- **File**: `.github/workflows/firebase_appdistribution_deploy.yml`
- **Triggers**: Schedule, manual dispatch, PR labels
- **Platforms**: iOS, Android, both
- **Environments**: Testing, staging

### Download Workflow  
- **File**: `.github/workflows/firebase_appdistribution_download.yml`
- **Triggers**: Manual dispatch, workflow call
- **Outputs**: Release metadata as GitHub artifacts
- **Retention**: 30 days

## Configuration

### Environment Files

The scripts use existing Fastlane environment files:
- `fastlane/.env.testing` - Testing environment configuration
- `fastlane/.env.staging` - Staging environment configuration

### Required Environment Variables

```bash
# Firebase App IDs (already configured)
FIREBASE_PUBLIC_IOS_APP_ID=1:557258398232:ios:7e115147acf19cda22816d
FIREBASE_PUBLIC_ANDROID_APP_ID=1:557258398232:android:981d2fd61e096ddf22816d

# Authentication (via Google Secret Manager)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-credentials.json

# Optional Slack integration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### Secret Manager Secrets

The GitHub Actions workflows expect these secrets in Google Secret Manager:

```
# Firebase credentials
passculture-metier-ehp/pc_native_testing_firebase_json
passculture-metier-ehp/pc_native_staging_firebase_json

# Slack webhooks
passculture-metier-ehp/passculture-native-firebase-deploy-slack-webhook
passculture-metier-ehp/passculture-native-firebase-download-slack-webhook

# iOS/Android signing (existing secrets)
passculture-metier-ehp/passculture-app-native-ios-*
passculture-metier-ehp/passculture-app-native-android-*
```

## Dependencies

### Required
- `bash` (v4+)
- `jq` - JSON processing
- `curl` - HTTP requests
- `bundle` - Ruby bundler (for Fastlane)
- `gcloud` - Google Cloud SDK (for authentication)

### Optional
- `firebase` - Firebase CLI (enhanced functionality)
- Slack webhook URL (for notifications)

## Error Handling

Both scripts include comprehensive error handling:

- **Pre-flight validation** - Check dependencies, credentials, and configuration
- **Environment validation** - Verify Firebase app IDs and environment files
- **Authentication checks** - Validate Google Cloud credentials and API access
- **Graceful failures** - Send Slack notifications on errors
- **Cleanup** - Remove sensitive files after execution

## Security

- **Credential isolation** - No hardcoded secrets in scripts
- **Temporary files** - Credentials written to temp files and cleaned up
- **Access control** - Uses service accounts with minimal required permissions
- **Secure transmission** - All API calls use HTTPS with proper authentication

## Integration with Existing Workflow

The scripts integrate seamlessly with your existing infrastructure:

- **Reuses Fastlane lanes** - Leverages existing `deploy_appDistribution` lanes
- **Environment compatibility** - Works with current `.env.*` files
- **CI/CD integration** - Uses established GitHub Actions patterns
- **Secret management** - Compatible with existing Google Secret Manager setup
- **Notification channels** - Extends current Slack notification system

## Troubleshooting

### Common Issues

1. **Authentication failures**
   - Verify `GOOGLE_APPLICATION_CREDENTIALS` path
   - Check service account permissions
   - Ensure `gcloud` is authenticated

2. **Missing Firebase app IDs**
   - Verify environment files contain correct `FIREBASE_PUBLIC_*_APP_ID`
   - Check Firebase project configuration

3. **Fastlane errors**
   - Ensure Ruby dependencies are installed: `bundle install`
   - Verify iOS/Android build requirements are met

4. **Download limitations**
   - Binary downloads require manual steps via Firebase Console
   - Release metadata is available via API/CLI

### Debug Mode

Run scripts with debug output:
```bash
bash -x ./scripts/deploy_firebase_appdistribution.sh -o both -e testing
bash -x ./scripts/download_firebase_appdistribution.sh -o both -e testing -l
```

### Log Analysis

GitHub Actions provide detailed logs for troubleshooting:
- Deploy workflow logs include Fastlane output
- Download workflow logs show API responses
- Slack notifications include error context