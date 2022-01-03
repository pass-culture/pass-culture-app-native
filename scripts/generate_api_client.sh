#!/usr/bin/env bash
set -e

docker run \
    --network="host" \
    --rm \
    --volume "${PWD}:/local" \
    "swaggerapi/swagger-codegen-cli-v3:${SWAGGER_CODEGEN_CLI_VERSION:-'latest'}" generate \
        -i https://backend.testing.passculture.team/native/v1/openapi.json `# schema location` \
        -l typescript-fetch `# client type` \
        -c /local/swagger_codegen/swagger_codegen_config.json `# swagger codegen config` \
        -t /local/swagger_codegen/gen_templates `# templates directory` \
        -o /local/src/api/gen `# output directory`

success() {
  echo -e "✅  ${GREEN}$1${NO_COLOR}"
}

success "TypeScript API client and interfaces were generated successfully."
