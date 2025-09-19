#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NO_COLOR='\033[0m'

PROJECT_DIR="$(dirname "${BASH_SOURCE[0]}")/.."
BUILD_COUNTER_FILE="${PROJECT_DIR}/.build_counter"

# Utility functions
error() {
    echo -e "${RED}❌ Error: $1${NO_COLOR}" >&2
    exit 1
}

success() {
    echo -e "${GREEN}✅ $1${NO_COLOR}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NO_COLOR}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NO_COLOR}"
}

print_usage() {
    echo "Usage: ./scripts/generate_incremental_build_number.sh [-r] [-v <version>] [-h]

Generate incremental build numbers based on semver with format: MAJORMINORPATCHXXX
Where XXX is an auto-incremented counter (001, 002, 003, etc.)

Examples for version 1.357.2:
  - First build:  1357002001
  - Second build: 1357002002  
  - Third build:  1357002003

Options:
    -r                 Reset counter for current version (start from 001)
    -v <version>       Use specific version instead of package.json version
    -h                 Display this usage

Examples:
    # Generate next build number for current package.json version
    ./scripts/generate_incremental_build_number.sh

    # Generate build number for specific version
    ./scripts/generate_incremental_build_number.sh -v 1.357.2

    # Reset counter for current version
    ./scripts/generate_incremental_build_number.sh -r

Build counter is stored in: .build_counter
Format: {\"1.357.2\": 5, \"1.358.0\": 12}
"
}

get_current_version() {
    if [[ -f "${PROJECT_DIR}/package.json" ]]; then
        jq -r '.version' "${PROJECT_DIR}/package.json"
    else
        error "package.json not found in ${PROJECT_DIR}"
    fi
}

load_build_counter() {
    if [[ -f "$BUILD_COUNTER_FILE" ]]; then
        cat "$BUILD_COUNTER_FILE"
    else
        echo '{}'
    fi
}

save_build_counter() {
    local counter_json="$1"
    echo "$counter_json" > "$BUILD_COUNTER_FILE"
}

get_version_counter() {
    local version="$1"
    local counter_json="$2"
    
    echo "$counter_json" | jq -r --arg version "$version" '.[$version] // 0'
}

set_version_counter() {
    local version="$1"
    local counter="$2"
    local counter_json="$3"
    
    echo "$counter_json" | jq --arg version "$version" --argjson counter "$counter" '.[$version] = $counter'
}

generate_build_number() {
    local version="$1"
    local counter="$2"
    
    # Parse version components
    IFS='.' read -ra VERSION_PARTS <<< "$version"
    local major="${VERSION_PARTS[0]}"
    local minor="${VERSION_PARTS[1]}"
    local patch="${VERSION_PARTS[2]}"
    
    # Validate version format
    if [[ -z "$major" || -z "$minor" || -z "$patch" ]]; then
        error "Invalid version format: $version. Expected format: MAJOR.MINOR.PATCH"
    fi
    
    # Validate numeric components
    if ! [[ "$major" =~ ^[0-9]+$ ]] || ! [[ "$minor" =~ ^[0-9]+$ ]] || ! [[ "$patch" =~ ^[0-9]+$ ]]; then
        error "Version components must be numeric: $version"
    fi
    
    # Generate build number: MAJORMINORPATCHCOUNTER
    # Build number format: MAJORMINORPATCHCOUNTER, where:
    #   - MAJOR is not zero-padded
    #   - MINOR and PATCH are zero-padded to 3 digits each (e.g., 001, 002)
    #   - COUNTER is zero-padded to 3 digits (e.g., 001, 002)
    # Example: version 1.357.2, counter 5 => 1357002005
    printf "%d%03d%03d%03d" "$major" "$minor" "$patch" "$counter"
}

    if (( build_number > max_android_version_code )); then
        error "Build number $build_number exceeds Android versionCode limit ($max_android_version_code)"
    fi
    
    if [[ "$build_number" -gt "$max_android_version_code" ]]; then
        error "Build number $build_number exceeds Android versionCode limit ($max_android_version_code)"
    fi
}

update_package_json_build() {
    local build_number="$1"
    local package_file="${PROJECT_DIR}/package.json"
    
    info "Updating package.json build number to: $build_number"
    
    # Create backup
    cp "$package_file" "${package_file}.backup"
    
    # Update build number using jq
    jq --argjson build "$build_number" '.build = $build' "$package_file" > "${package_file}.tmp"
    mv "${package_file}.tmp" "$package_file"
    
    success "Updated package.json build number"
}

show_build_history() {
    local counter_json="$1"
    
    if [[ "$counter_json" == "{}" ]]; then
        info "No build history found"
        return
    fi
    
    echo ""
    info "Build History:"
    echo "$counter_json" | jq -r 'to_entries[] | "  \(.key): \(.value) builds"' | sort -V
}

# Parse command line arguments
RESET_COUNTER=false
SPECIFIC_VERSION=""

while getopts ":rv:h" opt; do
    case $opt in
        r) RESET_COUNTER=true ;;
        v) SPECIFIC_VERSION="$OPTARG" ;;
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

# Main execution
info "🔢 Incremental Build Number Generator"

# Determine version to use
if [[ -n "$SPECIFIC_VERSION" ]]; then
    VERSION="$SPECIFIC_VERSION"
    info "Using specified version: $VERSION"
else
    VERSION=$(get_current_version)
    info "Using package.json version: $VERSION"
fi

# Load current counters
COUNTER_JSON=$(load_build_counter)

# Get current counter for this version
CURRENT_COUNTER=$(get_version_counter "$VERSION" "$COUNTER_JSON")

# Handle reset option
if [[ "$RESET_COUNTER" == "true" ]]; then
    NEW_COUNTER=1
    warn "Resetting counter for version $VERSION"
else
    NEW_COUNTER=$((CURRENT_COUNTER + 1))
fi

# Generate new build number
BUILD_NUMBER=$(generate_build_number "$VERSION" "$NEW_COUNTER")

# Validate build number
validate_build_number "$BUILD_NUMBER"

# Update counter
NEW_COUNTER_JSON=$(set_version_counter "$VERSION" "$NEW_COUNTER" "$COUNTER_JSON")

# Save updated counter
save_build_counter "$NEW_COUNTER_JSON"

# Update package.json if using current version
if [[ -z "$SPECIFIC_VERSION" ]]; then
    update_package_json_build "$BUILD_NUMBER"
fi

# Show results
echo ""
success "Generated build number: $BUILD_NUMBER"
info "Version: $VERSION"
info "Counter: $NEW_COUNTER (increment #$NEW_COUNTER)"
info "Format: ${VERSION//./}$(printf "%03d" "$NEW_COUNTER")"

# Show build history
show_build_history "$NEW_COUNTER_JSON"

echo ""
info "Build counter saved to: $BUILD_COUNTER_FILE"

# Show example for different versions
echo ""
info "Examples for version $VERSION:"
echo "  - Build #1: $(generate_build_number "$VERSION" 1)"
echo "  - Build #2: $(generate_build_number "$VERSION" 2)"
echo "  - Build #3: $(generate_build_number "$VERSION" 3)"