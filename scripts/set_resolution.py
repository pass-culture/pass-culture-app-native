import argparse
import os
import subprocess
import json
import collections


def remove_resolution_from_lock(dependency: str, manifest: str):
    remove_lines = False
    curated_manifest = manifest + ".curated"
    line_dep = f'"{dependency}@npm:'
    with open(manifest, "r") as yarn_file:
        with open(curated_manifest, "w") as curated_yarn_file:
            for line in yarn_file:
                dep = line.find(line_dep)
                if dep != -1:
                    remove_lines = True
                if not line.strip():
                    remove_lines = False
                if not remove_lines:
                    curated_yarn_file.write(line)

    os.replace(curated_manifest, manifest)


def set_resolution(
    dependency: str,
    min_version: str,
    max_version: str,
    target_version: str,
    package_json: str,
):
    print("\n----------------------------------------")
    print("------ Fixing Dependency version -------")
    print("----------------------------------------")
    print(f"           name    {dependency}        ")
    print(f"    min version    {min_version}       ")
    print(f"    max version    {max_version}       ")
    print(f" target version    {target_version}    ")
    print(f"        package    {package_json}      ")
    print("----------------------------------------\n")

    curated_package_json = package_json + ".curated"
    with (
        open(package_json) as package_file,
        open(curated_package_json, "w") as package_curated_file,
    ):
        package_data = json.load(package_file)
        resolutions = package_data["resolutions"]
        remove_dep = False
        for k, version in resolutions.items():
            if dependency in k:
                target_major_version = (
                    target_version.split(".")[0].lstrip("^").lstrip("~")
                )
                package_major_version = version.split(".")[0].lstrip("^").lstrip("~")
                if package_major_version == target_major_version:
                    remove_dep = k
        if remove_dep:
            resolutions.pop(remove_dep, None)

        if not min_version:
            resolutions[f"{dependency}@{max_version}"] = target_version
        else:
            resolutions[f"{dependency}@{min_version}, {max_version}"] = target_version

        ordered_resolutions = collections.OrderedDict(sorted(resolutions.items()))
        package_curated_data = package_data
        package_curated_data["resolutions"] = ordered_resolutions
        json.dump(package_curated_data, package_curated_file, indent=2)

    os.replace(curated_package_json, package_json)


def set_resolutions(dependencies_data: str, manifest: str, package_json: str):
    n_patch_max = 0
    for dependency_data in dependencies_data:
        if n_patch_max >= 100:
            break

        dependency = dependency_data["security_vulnerability"]
        name = dependency["package"]["name"]
        vulnerable_version_range = dependency["vulnerable_version_range"]
        versions = vulnerable_version_range.split(",")
        if len(versions) == 2:
            v_min = versions[0].strip()
            v_max = versions[1].strip()
        else:
            v_max = vulnerable_version_range
            v_min = None
        v_target = "^" + dependency["first_patched_version"]["identifier"].lstrip(
            "^"
        ).lstrip("~")

        remove_resolution_from_lock(name, manifest)
        set_resolution(name, v_min, v_max, v_target, package_json)
        n_patch_max += 1


def run_yarn():
    subprocess.run(["yarn"], shell=True)


def pull_master():
    subprocess.run(["git switch master"], shell=True)
    subprocess.run(["git pull"], shell=True)


def create_git_branch(branch: str):
    subprocess.run([f"git switch -c {branch}"], shell=True)


def stage_modifications():
    subprocess.run(["git add package.json yarn.lock"], shell=True)


def commit_modifications(branch: str):
    subprocess.run([f'git commit -m "({branch}) build(yarn): update dep"'], shell=True)


def push_modifications(branch: str):
    subprocess.run([f"git push origin {branch}"], shell=True)


def get_dependabot_alerts(manifest: str):
    """
    Needs gh cli to be able to run
    """
    return subprocess.run(
        [
            "gh",
            "api",
            "-H",
            "Accept: application/vnd.github+json",
            "-H",
            "X-GitHub-Api-Version: 2026-03-10",
            f"/repos/pass-culture/pass-culture-app-native/dependabot/alerts?state=open&manifest={manifest}",
        ],
        stdout=subprocess.PIPE,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Fix a dependency resolution in package.json and yarn.lock"
    )
    parser.add_argument("-dep", type=str, help="Dependency name", nargs="?")
    parser.add_argument("-v-min", type=str, help="Min Version", nargs="?")
    parser.add_argument("-v-max", type=str, help="Max Version", nargs="?")
    parser.add_argument("-vt", type=str, help="Target version", nargs="?")
    parser.add_argument("-br", type=str, help="Branch to create", nargs="?")
    parser.add_argument(
        "-d-bot",
        type=bool,
        help="Recover dependabot alerts and treat them (max: 100 - pagination)",
        nargs="?",
    )
    parser.add_argument(
        "-man",
        type=str,
        help="The manifest to filter from (ex. yarn.lock, server/yarn.lock etc ...)",
        nargs="?",
    )
    args = parser.parse_args()

    branch = args.br
    if branch:
        pull_master()
        create_git_branch(branch)

    from_dependabot = args.d_bot
    manifest = args.man or "yarn.lock"
    package_json = os.path.join(os.path.dirname(manifest), "package.json")
    if from_dependabot:
        dependabot_alerts = get_dependabot_alerts(manifest)
        dependabot_alerts_json = json.loads(dependabot_alerts.stdout)
        set_resolutions(dependabot_alerts_json, manifest, package_json)
    else:
        remove_resolution_from_lock(args.dep, manifest)
        set_resolution(args.dep, args.v_min, args.v_max, args.vt, package_json)

    run_yarn()

    if branch:
        stage_modifications()
        commit_modifications(branch)
        push_modifications(branch)
