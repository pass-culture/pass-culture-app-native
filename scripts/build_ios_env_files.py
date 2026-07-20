import argparse
import os
import json
import shutil


def create_dot_env(root_path: str, env: str):
    dot_env_path = os.path.join(root_path, ".env")
    dot_env_chosen_path = os.path.join(root_path, f".env.{env}")
    shutil.copyfile(dot_env_chosen_path, dot_env_path)


def add_project_version_to_dot_env(root_path: str):
    package_json = os.path.join(root_path, "package.json")
    with open(package_json, "r") as package_file:
        package_data = json.load(package_file)
        version = package_data["version"]
        build = package_data["build"]

    with open(os.path.join(root_path, ".env"), "a") as env_file:
        env_file.write("\n# App Version\n")
        env_file.write(f"VERSION={version}\n")
        env_file.write(f"BUILD={build}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Add project version and build to envfile"
    )
    parser.add_argument("--dir", type=str, help="Directory name")
    parser.add_argument("--env", type=str, help="Env name")
    args = parser.parse_args()

    root_dir = args.dir
    env = args.env

    create_dot_env(root_dir, env)
    add_project_version_to_dot_env(root_dir)
