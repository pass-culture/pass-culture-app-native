#!/usr/bin/env bash
set -e

# This file uses custom Docker image to handle generating api.ts until this PR is merged
# https://github.com/swagger-api/swagger-codegen/pull/11772

docker run \
    --network="host" \
    --rm \
    --volume "${PWD}:/local" \
    "parsertongue/swagger-codegen-cli:${SWAGGER_CODEGEN_CLI_VERSION:-'latest'}" generate \
        --input-spec https://backend.testing.passculture.team/native/v1/openapi.json `# schema location` \
        --lang typescript-fetch `# client type` \
        --config /local/swagger_codegen/swagger_codegen_config.json `# swagger codegen config` \
        --template-dir /local/swagger_codegen/gen_templates `# templates directory` \
        --output /local/src/api/gen `# output directory`

success() {
  echo -e "✅  ${GREEN}$1${NO_COLOR}"
}

success "TypeScript API client and interfaces were generated successfully."
