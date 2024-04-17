import sys

def load_env_variables(file_path):
    env_vars = []
    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            if line and not line.startswith('#'):
                key, _, _ = line.partition('=')
                env_vars.append(key.strip())
    return env_vars

def compare_env_files(env_files):
    env_data = {}
    for file in env_files:
        env_data[file] = load_env_variables(file)

    all_keys = set(key for data in env_data.values() for key in data)
    missing = {file: all_keys - set(data) for file, data in env_data.items()}

    return missing

env_files = ['.env.testing', '.env.staging', '.env.integration', '.env.production']

missing_variables = compare_env_files(env_files)
error_reported = False
for file, variables in missing_variables.items():
    if variables:
        print(f"❌ The following variables are missing in {file}: {', '.join(variables)}")
        error_reported = True

if error_reported:
    sys.exit(1)
else:
    print("✅ All variables are present in all .env files.")
