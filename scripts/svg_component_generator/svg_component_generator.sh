#!/bin/bash

# Handle missing arguments
if [ -z "$1" ] || [ -z "$2" ]
then
  RED='\033[0;31m'
  echo -e "${RED}Missing argument: please provide an SVG file and a component name (PascalCase)." >&2
  exit -1
fi

svg=$1
component_name=$2
final_file_path="src/ui/svg/icons/$component_name.tsx"

# Run SVGR to generate the React component, regarding the config
npx @svgr/cli --config-file "scripts/svg_component_generator/.svgrrc.json" --template ./scripts/svg_component_generator/template.js < $svg > $final_file_path

# Replace the default component name by the one provided
sed -i '' "s/SvgComponent/$component_name/" $final_file_path
