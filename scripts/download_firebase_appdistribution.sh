#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Colors for output
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NO_COLOR='\033[0m'

# Project configuration
PROJECT_DIR="$(dirname "${BASH_SOURCE[0]}")/.."
SCRIPT_DIR="$(dirname "${BASH_SOURCE[0]}")"

# Default values
APP_ENV="testing"
APP_OS=""
OUTPUT_DIR="./downloads"
FIREBASE_CREDENTIALS_PATH=""
LATEST_ONLY="false"
MAX_RELEASES="5"
SLACK_WEBHOOK_URL=""

# Firebase API configuration
FIREBASE_API_BASE="https://firebaseappdistribution.googleapis.com/v1"

# Utility functions
error() {
    echo -e "${RED}❌ Error: $1${NO_COLOR}" >&2
    exit 1
}

success() {
    echo -e "${GREEN}✅ $1${NO_COLOR}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NO_COLOR}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NO_COLOR}"
}

print_usage() {
    echo "Usage: ./scripts/download_firebase_appdistribution.sh [-e <env>] [-o ios|android|both] [-d <output_dir>] [-f <firebase_creds>] [-l] [-m <max>] [-s <slack_webhook>] [-h]

Download builds from Firebase App Distribution for testing and analysis.

Options:
    -e <env>           Environment to download from (default: testing)
    -o <platform>      Platform to download: ios, android, or both (required)
    -d <output_dir>    Output directory for downloaded files (default: ./downloads)
    -f <creds_path>    Path to Firebase service account credentials JSON file
    -l                 Download only the latest release per platform
    -m <max>           Maximum number of releases to download per platform (default: 5)
    -s <webhook_url>   Slack webhook URL for notifications
    -h                 Display this usage
    
Examples:
    # Download latest builds for both platforms
    ./scripts/download_firebase_appdistribution.sh -o both -l
    
    # Download last 3 iOS releases to specific directory
    ./scripts/download_firebase_appdistribution.sh -o ios -m 3 -d ~/Downloads/firebase-builds
    
    # Download Android releases from staging environment
    ./scripts/download_firebase_appdistribution.sh -o android -e staging -d ./staging-builds

Environment variables (alternative to flags):
    FIREBASE_CREDENTIALS_PATH    Path to Firebase credentials file
    GOOGLE_APPLICATION_CREDENTIALS    Alternative to FIREBASE_CREDENTIALS_PATH
    SLACK_WEBHOOK_URL            Slack webhook for notifications
    FIREBASE_PROJECT_ID          Firebase project ID (auto-detected from credentials)
"
}

check_dependencies() {
    local missing_deps=()
    
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    # Firebase CLI is preferred but not required
    if ! command -v firebase &> /dev/null; then
        warn "Firebase CLI not found. Will use REST API method (limited functionality)."
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        error "Missing required dependencies: ${missing_deps[*]}"
    fi
}

validate_environment() {
    local env_file="${PROJECT_DIR}/fastlane/.env.${APP_ENV}"
    
    if [[ ! -f "$env_file" ]]; then
        error "Environment file not found: $env_file"
    fi
    
    info "Using environment: $APP_ENV"
    
    # Source the environment file to get Firebase app IDs
    source "$env_file"
    
    if [[ "$APP_OS" == *"ios"* && -z "${FIREBASE_PUBLIC_IOS_APP_ID:-}" ]]; then
        error "FIREBASE_PUBLIC_IOS_APP_ID not set in $env_file"
    fi
    
    if [[ "$APP_OS" == *"android"* && -z "${FIREBASE_PUBLIC_ANDROID_APP_ID:-}" ]]; then
        error "FIREBASE_PUBLIC_ANDROID_APP_ID not set in $env_file"
    fi
}

setup_firebase_credentials() {
    # Use provided path, environment variable, or default
    if [[ -n "$FIREBASE_CREDENTIALS_PATH" ]]; then
        export GOOGLE_APPLICATION_CREDENTIALS="$FIREBASE_CREDENTIALS_PATH"
    elif [[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]]; then
        info "Using existing GOOGLE_APPLICATION_CREDENTIALS: $GOOGLE_APPLICATION_CREDENTIALS"
    else
        error "Firebase credentials required. Use -f flag or set GOOGLE_APPLICATION_CREDENTIALS."
    fi
    
    if [[ ! -f "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
        error "Firebase credentials file not found: $GOOGLE_APPLICATION_CREDENTIALS"
    fi
    
    # Extract project ID from credentials
    if command -v jq &> /dev/null; then
        FIREBASE_PROJECT_ID=$(jq -r '.project_id' "$GOOGLE_APPLICATION_CREDENTIALS" 2>/dev/null || echo "")
        if [[ -z "$FIREBASE_PROJECT_ID" ]]; then
            warn "Could not extract project_id from credentials file"
        else
            info "Using Firebase project: $FIREBASE_PROJECT_ID"
        fi
    fi
}

get_access_token() {
    if command -v gcloud &> /dev/null; then
        # Use gcloud if available (more reliable)
        gcloud auth application-default print-access-token 2>/dev/null || {
            # Try activating service account first
            gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS" &>/dev/null
            gcloud auth application-default print-access-token 2>/dev/null
        }
    else
        # Fallback to manual OAuth2 token generation (requires additional setup)
        error "gcloud CLI required for authentication. Please install Google Cloud SDK."
    fi
}

list_releases_firebase_cli() {
    local platform="$1"
    local app_id=""
    
    case "$platform" in
        ios) app_id="$FIREBASE_PUBLIC_IOS_APP_ID" ;;
        android) app_id="$FIREBASE_PUBLIC_ANDROID_APP_ID" ;;
        *) error "Invalid platform: $platform" ;;
    esac
    
    info "Listing $platform releases using Firebase CLI..."
    
    # Set Firebase project context
    if [[ -n "${FIREBASE_PROJECT_ID:-}" ]]; then
        export GOOGLE_CLOUD_PROJECT="$FIREBASE_PROJECT_ID"
    fi
    
    # List releases (requires Firebase CLI with App Distribution plugin)
    if firebase appdistribution:releases:list --app "$app_id" --format json 2>/dev/null; then
        return 0
    else
        warn "Firebase CLI method failed for $platform. Trying REST API..."
        return 1
    fi
}

list_releases_rest_api() {
    local platform="$1"
    local app_id=""
    
    case "$platform" in
        ios) app_id="$FIREBASE_PUBLIC_IOS_APP_ID" ;;
        android) app_id="$FIREBASE_PUBLIC_ANDROID_APP_ID" ;;
        *) error "Invalid platform: $platform" ;;
    esac
    
    info "Listing $platform releases using REST API..."
    
    local access_token
    access_token=$(get_access_token)
    
    if [[ -z "$access_token" ]]; then
        error "Failed to get access token for API authentication"
    fi
    
    # Extract app ID components (format: project_number:platform:app_hash)
    local project_number
    project_number=$(echo "$app_id" | cut -d':' -f1)
    
    # Make API request to list releases
    local api_url="${FIREBASE_API_BASE}/projects/${project_number}/apps/${app_id}/releases"
    
    curl -s -H "Authorization: Bearer $access_token" \
         -H "Content-Type: application/json" \
         "$api_url" || {
        error "Failed to fetch releases from Firebase API"
    }
}

download_release_info() {
    local platform="$1"
    local releases_json="$2"
    local platform_dir="${OUTPUT_DIR}/${APP_ENV}/${platform}"
    
    info "Processing $platform releases..."
    
    # Create output directory
    mkdir -p "$platform_dir"
    
    # Parse releases and extract information
    local release_count
    if [[ "$LATEST_ONLY" == "true" ]]; then
        release_count=1
    else
        release_count="$MAX_RELEASES"
    fi
    
    # Process releases (assuming JSON format from API/CLI)
    echo "$releases_json" | jq -r --arg count "$release_count" '
        .releases // .
        | sort_by(.createTime) 
        | reverse 
        | limit($count | tonumber; .) 
        | .[] 
        | @json' | while IFS= read -r release; do
        
        local release_name display_name version_name build_version create_time
        release_name=$(echo "$release" | jq -r '.name // "unknown"')
        display_name=$(echo "$release" | jq -r '.displayName // .releaseNotes.text // "No description"')
        version_name=$(echo "$release" | jq -r '.version // "unknown"')
        build_version=$(echo "$release" | jq -r '.buildVersion // "unknown"')
        create_time=$(echo "$release" | jq -r '.createTime // "unknown"')
        
        info "Found release: $display_name (v$version_name build $build_version)"
        
        # Save release metadata
        local metadata_file="${platform_dir}/release_${build_version}.json"
        echo "$release" | jq '.' > "$metadata_file"
        
        success "Saved metadata: $metadata_file"
        
        # Note: Actual binary download requires additional implementation
        # The Firebase App Distribution API doesn't provide direct download URLs
        warn "Binary download not available via API. Metadata saved for release: $display_name"
    done
}

download_with_firebase_cli() {
    local platform="$1"
    local platform_dir="${OUTPUT_DIR}/${APP_ENV}/${platform}"
    
    info "Attempting download with Firebase CLI for $platform..."
    
    # This is a placeholder - Firebase CLI doesn't have direct download command
    # Users would need to use the web interface or generate download links manually
    warn "Firebase CLI download not implemented. Use web interface for binary downloads."
    
    # Create instruction file
    local instruction_file="${platform_dir}/download_instructions.txt"
    cat > "$instruction_file" << EOF
To download the actual binary files:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Navigate to App Distribution
3. Select your app: $([[ "$platform" == "ios" ]] && echo "$FIREBASE_PUBLIC_IOS_APP_ID" || echo "$FIREBASE_PUBLIC_ANDROID_APP_ID")
4. Download the desired releases manually

Release metadata has been saved in this directory for reference.
EOF
    
    info "Created download instructions: $instruction_file"
}

send_slack_notification() {
    local status="$1"
    local message="$2"
    local webhook_url="${SLACK_WEBHOOK_URL:-}"
    
    if [[ -z "$webhook_url" ]]; then
        return 0
    fi
    
    local color="#36a64f"  # green
    local status_emoji="📥"
    local status_text="completed"
    
    if [[ "$status" == "failure" ]]; then
        color="#A30002"  # red
        status_emoji="❌"
        status_text="failed"
    fi
    
    local platforms=""
    case "$APP_OS" in
        *ios*android*|*android*ios*) platforms="iOS & Android" ;;
        *ios*) platforms="iOS" ;;
        *android*) platforms="Android" ;;
        *) platforms="Unknown platform" ;;
    esac
    
    local payload=$(cat <<EOF
{
    "attachments": [
        {
            "color": "$color",
            "author_name": "$USER",
            "title": "Firebase App Distribution Download",
            "text": "Download of $platforms releases from \`$APP_ENV\` has $status_text $status_emoji\n\n*Output directory:* $OUTPUT_DIR\n*Environment:* $APP_ENV",
            "mrkdwn_in": ["text"]
        }
    ]
}
EOF
)
    
    curl -s -X POST -H 'Content-type: application/json' \
         --data "$payload" \
         "$webhook_url" > /dev/null || warn "Failed to send Slack notification"
}

download_platform_releases() {
    local platform="$1"
    
    info "Downloading $platform releases from Firebase App Distribution..."
    
    # Try Firebase CLI first, then REST API
    local releases_json=""
    if command -v firebase &> /dev/null; then
        releases_json=$(list_releases_firebase_cli "$platform") || releases_json=""
    fi
    
    if [[ -z "$releases_json" ]]; then
        releases_json=$(list_releases_rest_api "$platform")
    fi
    
    if [[ -z "$releases_json" ]] || [[ "$releases_json" == "null" ]]; then
        warn "No releases found for $platform in environment $APP_ENV"
        return 0
    fi
    
    # Process and download release information
    download_release_info "$platform" "$releases_json"
    
    # Attempt CLI download (limited functionality)
    download_with_firebase_cli "$platform"
    
    success "$platform releases processed successfully"
}

# Parse command line arguments
while getopts ":e:o:d:f:lm:s:h" opt; do
    case $opt in
        e) APP_ENV="$OPTARG" ;;
        o) APP_OS="$OPTARG" ;;
        d) OUTPUT_DIR="$OPTARG" ;;
        f) FIREBASE_CREDENTIALS_PATH="$OPTARG" ;;
        l) LATEST_ONLY="true" ;;
        m) MAX_RELEASES="$OPTARG" ;;
        s) SLACK_WEBHOOK_URL="$OPTARG" ;;
        h)
            print_usage
            exit 0
            ;;
        \?)
            error "Invalid option -$OPTARG. Use -h for help."
            ;;
        :)
            error "Option -$OPTARG requires an argument. Use -h for help."
            ;;
    esac
done

# Validate required arguments
if [[ -z "$APP_OS" ]]; then
    error "Platform (-o) is required. Use 'ios', 'android', or 'both'. Use -h for help."
fi

case "$APP_OS" in
    ios|android|both) ;;
    *) error "Invalid platform '$APP_OS'. Use 'ios', 'android', or 'both'." ;;
esac

# Use environment variables if flags not provided
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-${SLACK_WEBHOOK_URL:-}}"
FIREBASE_CREDENTIALS_PATH="${FIREBASE_CREDENTIALS_PATH:-${FIREBASE_CREDENTIALS_PATH:-}}"

# Main execution
info "📥 Firebase App Distribution Download Script"
info "Platform: $APP_OS | Environment: $APP_ENV | Output: $OUTPUT_DIR"

# Pre-flight checks
check_dependencies
validate_environment
setup_firebase_credentials

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Send start notification
send_slack_notification "start" "Starting download"

# Download execution
start_time=$(date +%s)

case "$APP_OS" in
    ios)
        # Source environment to get app IDs
        source "${PROJECT_DIR}/fastlane/.env.${APP_ENV}"
        download_platform_releases "ios"
        ;;
    android)
        source "${PROJECT_DIR}/fastlane/.env.${APP_ENV}"
        download_platform_releases "android"
        ;;
    both)
        source "${PROJECT_DIR}/fastlane/.env.${APP_ENV}"
        download_platform_releases "ios"
        download_platform_releases "android"
        ;;
esac

end_time=$(date +%s)
duration=$((end_time - start_time))

success "🎉 Firebase App Distribution download completed successfully in ${duration}s"
success "📁 Downloads saved to: $OUTPUT_DIR"

# Send success notification
send_slack_notification "success" "Download completed successfully in ${duration}s"