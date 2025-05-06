#!/bin/bash

data=$(npx eslint . --format json | \
  jq -r '.[].messages[] | select(.severity == 1) | .ruleId' | \
  sort | \
  uniq -c | \
  sort -nr)

max_rule_length=$(echo "$data" | awk '{print length($2)}' | sort -nr | head -n1)
max_count_length=$(echo "$data" | awk '{print length($1)}' | sort -nr | head -n1)

max_rule_length=$((max_rule_length > 4 ? max_rule_length : 4))
max_count_length=$((max_count_length > 5 ? max_count_length : 5))

rule_sep=$(printf "%${max_rule_length}s" | tr " " "-")
count_sep=$(printf "%${max_count_length}s" | tr " " "-")

echo -e "\nESLint Warnings Summary"
echo "======================"
printf "\n| %-${max_rule_length}s | %${max_count_length}s |\n" "Rule" "Count"
printf "| %${max_rule_length}s | %${max_count_length}s |\n" "$rule_sep" "$count_sep"

echo "$data" | awk -v rule_len="$max_rule_length" -v count_len="$max_count_length" '{
  printf "| %-'$max_rule_length's | %'$max_count_length'd |\n", $2, $1
}'

echo -e "\n" 