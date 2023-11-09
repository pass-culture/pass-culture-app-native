#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

docker run \
    --network="host" \
    --rm \
    --volume "${PWD}:/local" \
    "swaggerapi/swagger-codegen-cli-v3:${SWAGGER_CODEGEN_CLI_VERSION:-'latest'}" generate \
        --input-spec https://backend.testing.passculture.team/native/v1/openapi.json `# schema location` \
        --lang typescript-fetch `# client type` \
        --config /local/swagger_codegen/swagger_codegen_config.json `# swagger codegen config` \
        --template-dir /local/swagger_codegen/gen_templates `# templates directory` \
        --output /local/src/api/gen `# output directory`

success() {
  echo -e "✅  ${GREEN}$1${NO_COLOR}"
}

success "TypeScript API client and interfaces were generated successfully."
