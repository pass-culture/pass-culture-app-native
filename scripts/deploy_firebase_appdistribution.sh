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
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log HEAD --pretty=format:"%s" -1)

# Default values
APP_ENV="testing"
APP_OS=""
SLACK_WEBHOOK_URL=""
FIREBASE_CREDENTIALS_PATH=""
GENERATE_BUILD_NUMBER="false"

# Utility functions
error() {
    echo -e "${RED}❌ Error: $1${NO_COLOR}" >&2
    send_slack_notification "failure" "$1"
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
    echo "Usage: ./scripts/deploy_firebase_appdistribution.sh [-e <env>] [-o ios|android|both] [-s <slack_webhook>] [-f <firebase_creds>] [-b] [-h]

Deploy testing builds to Firebase App Distribution with automatic incremental build numbers.

Options:
    -e <env>           Environment to deploy (default: testing)
    -o <platform>      Platform to deploy: ios, android, or both (required)
    -s <webhook_url>   Slack webhook URL for notifications
    -f <creds_path>    Path to Firebase service account credentials JSON file
    -b                 Generate incremental build number (e.g., 1357002001, 1357002002)
    -h                 Display this usage
    
Examples:
    # Deploy both platforms with incremental build number
    ./scripts/deploy_firebase_appdistribution.sh -o both -b
    
    # Deploy only iOS with Slack notifications and build increment
    ./scripts/deploy_firebase_appdistribution.sh -o ios -b -s https://hooks.slack.com/...
    
    # Deploy Android to specific environment with build increment
    ./scripts/deploy_firebase_appdistribution.sh -o android -e staging -b

Build Number Format:
    Without -b: Uses existing package.json build number
    With -b:    Generates incremental build (e.g., version 1.357.2 → 1357002001, 1357002002, etc.)

Environment variables (alternative to -s and -f flags):
    SLACK_WEBHOOK_URL            Slack webhook for notifications
    FIREBASE_CREDENTIALS_PATH    Path to Firebase credentials file
    GOOGLE_APPLICATION_CREDENTIALS    Alternative to FIREBASE_CREDENTIALS_PATH
"
}

check_dependencies() {
    local missing_deps=()
    
    if ! command -v jq &> /dev/null; then
        missing_deps+=("jq")
    fi
    
    if ! command -v bundle &> /dev/null; then
        missing_deps+=("bundle (Ruby bundler)")
    fi
    
    if ! command -v fastlane &> /dev/null; then
        missing_deps+=("fastlane")
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
    
    # Source the environment file to validate Firebase app IDs
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
        warn "No Firebase credentials specified. Deployment may fail if not authenticated."
    fi
    
    if [[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]] && [[ ! -f "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
        error "Firebase credentials file not found: $GOOGLE_APPLICATION_CREDENTIALS"
    fi
}

send_slack_notification() {
    local status="$1"
    local message="$2"
    local webhook_url="${SLACK_WEBHOOK_URL:-}"
    
    if [[ -z "$webhook_url" ]]; then
        return 0
    fi
    
    local color="#36a64f"  # green
    local status_emoji="🚀"
    local status_text="succeeded"
    
    if [[ "$status" == "failure" ]]; then
        color="#A30002"  # red
        status_emoji="💥"
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
            "title": "Firebase App Distribution Deployment",
            "title_link": "https://github.com/pass-culture/pass-culture-app-native/commit/$COMMIT_HASH",
            "text": "Firebase App Distribution deployment for $platforms to \`$APP_ENV\` has $status_text $status_emoji\n\n*Commit:* $COMMIT_HASH\n*Message:* $COMMIT_MESSAGE\n*Branch:* $CURRENT_BRANCH",
            "mrkdwn_in": ["text"]
        }
    ]
}
EOF
)
    
    if ! curl -s -X POST -H 'Content-type: application/json' \
         --data "$payload" \
         "$webhook_url" > /dev/null; then
        warn "Failed to send Slack notification"
    fi
}

generate_incremental_build_number() {
    if [[ "$GENERATE_BUILD_NUMBER" == "true" ]]; then
        info "Generating incremental build number..."
        
        # Check if build number generator exists
        if [[ ! -f "${PROJECT_DIR}/scripts/generate_incremental_build_number.sh" ]]; then
            error "Build number generator script not found: ${PROJECT_DIR}/scripts/generate_incremental_build_number.sh"
        fi
        
        # Generate new build number and update package.json
        if bash "${PROJECT_DIR}/scripts/generate_incremental_build_number.sh"; then
            local new_build_number
            new_build_number=$(jq -r '.build' "${PROJECT_DIR}/package.json")
            success "Generated incremental build number: $new_build_number"
            
            # Add build number to commit message context for Slack
            COMMIT_MESSAGE="$COMMIT_MESSAGE (build: $new_build_number)"
        else
            error "Failed to generate incremental build number"
        fi
    else
        local current_build
        current_build=$(jq -r '.build' "${PROJECT_DIR}/package.json")
        info "Using existing build number: $current_build"
    fi
}

deploy_ios() {
    info "Starting iOS deployment to Firebase App Distribution..."
    
    cd "$PROJECT_DIR"
    
    # Build and deploy iOS
    if bundle exec fastlane ios build --env "$APP_ENV" --verbose; then
        success "iOS build completed"
    else
        error "iOS build failed"
    fi
    
    local firebase_args=""
    if [[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]]; then
        firebase_args="firebase_token:\"${GOOGLE_APPLICATION_CREDENTIALS}\""
    fi
    
    if bundle exec fastlane ios deploy_appDistribution $firebase_args --env "$APP_ENV" --verbose; then
        success "iOS deployment to Firebase App Distribution completed"
    else
        error "iOS deployment to Firebase App Distribution failed"
    fi
}

deploy_android() {
    info "Starting Android deployment to Firebase App Distribution..."
    
    cd "$PROJECT_DIR"
    
    # Build and deploy Android
    if bundle exec fastlane android build --env "$APP_ENV" --verbose; then
        success "Android build completed"
    else
        error "Android build failed"
    fi
    
    local firebase_args=""
    if [[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" ]]; then
        firebase_args="firebase_token:\"${GOOGLE_APPLICATION_CREDENTIALS}\""
    fi
    
    if bundle exec fastlane android deploy_appDistribution $firebase_args --env "$APP_ENV" --verbose; then
        success "Android deployment to Firebase App Distribution completed"
    else
        error "Android deployment to Firebase App Distribution failed"
    fi
}

# Parse command line arguments
while getopts ":e:o:s:f:bh" opt; do
    case $opt in
        e) APP_ENV="$OPTARG" ;;
        o) APP_OS="$OPTARG" ;;
        s) SLACK_WEBHOOK_URL="$OPTARG" ;;
        f) FIREBASE_CREDENTIALS_PATH="$OPTARG" ;;
        b) GENERATE_BUILD_NUMBER="true" ;;
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
# Use environment variables if flags not provided
# (No need for nested parameter expansion)
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
FIREBASE_CREDENTIALS_PATH="${FIREBASE_CREDENTIALS_PATH:-}"

# Main execution
info "🔥 Firebase App Distribution Deployment Script"
info "Platform: $APP_OS | Environment: $APP_ENV | Branch: $CURRENT_BRANCH"
if [[ "$GENERATE_BUILD_NUMBER" == "true" ]]; then
    info "Build number generation: ENABLED (incremental)"
else
    info "Build number generation: DISABLED (using existing)"
fi

# Pre-flight checks
check_dependencies
validate_environment
setup_firebase_credentials

# Generate incremental build number if requested
generate_incremental_build_number

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    warn "You have uncommitted changes. Consider committing or stashing them."
fi

# Send start notification
send_slack_notification "start" "Starting deployment"

# Deployment execution
start_time=$(date +%s)

case "$APP_OS" in
    ios)
        deploy_ios
        ;;
    android)
        deploy_android
        ;;
    both)
        deploy_ios
        deploy_android
        ;;
esac

end_time=$(date +%s)
duration=$((end_time - start_time))

success "🎉 Firebase App Distribution deployment completed successfully in ${duration}s"
send_slack_notification "success" "Deployment completed successfully in ${duration}s"