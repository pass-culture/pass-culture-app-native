import argparse
import os
import subprocess
import json
import collections


def remove_resolution_from_lock(dependency):
    remove_lines = False
    with open("yarn.lock", 'r') as yarn_file:
        with open("yarn_curated.lock", "w") as curated_yarn_file:
            for line in yarn_file:
                line_dep = f'"{dependency}@npm:'
                dep = line.find(line_dep)
                if dep != -1:
                    remove_lines = True
                if not line.strip():
                    remove_lines = False
                if not remove_lines:
                    curated_yarn_file.write(line)
    
    os.replace("yarn_curated.lock", "yarn.lock")

def set_resolution(dependency, version_min, version_max, target_version):
    with open('package.json') as package_file:
        with open('package_curated.json', "w") as package_curated_file:
            package_data = json.load(package_file)
            resolutions = package_data["resolutions"]
            remove_dep = False
            for k, version in resolutions.items():
                if dependency in k:
                    target_major_version = target_version.split('.')[0].lstrip('^').lstrip('~')
                    package_major_version = version.split('.')[0].lstrip('^').lstrip('~')
                    if package_major_version == target_major_version:
                        remove_dep = k
            if remove_dep:
                resolutions.pop(remove_dep, None)
            resolutions[f"{dependency}@{version_min}, {version_max}"] = target_version 
            ordered_resolutions = collections.OrderedDict(sorted(resolutions.items()))
            package_curated_data = package_data
            package_curated_data["resolutions"] = ordered_resolutions
            json.dump(package_curated_data, package_curated_file, indent=2)

    os.replace("package_curated.json", "package.json")
        
def run_yarn():
    subprocess.run(["yarn"], shell = True)

def pull_master():
    subprocess.run(["git switch master"], shell = True)
    subprocess.run(["git pull"], shell = True)

def create_git_branch(branch):
    subprocess.run([f"git switch -c {branch}"], shell = True)

def stage_modifications():
    subprocess.run(["git add package.json yarn.lock"], shell = True)

def commit_modifications(branch):
    subprocess.run([f"git commit -m \"({branch}) build(yarn): update dep\""], shell = True)

def push_modifications(branch):
    subprocess.run([f"git push origin {branch}"], shell = True)


if __name__ == "__main__":
    # Get arguments
    parser = argparse.ArgumentParser(description='Fix a dependency resolution in package.json and yarn.lock')
    parser.add_argument('--dep', type=str, help='Dependency name')
    parser.add_argument('--vmin', type=str, help='Min Version')
    parser.add_argument('--vmax', type=str, help='Max Version')
    parser.add_argument('--vtarget', type=str, help='Target version')
    parser.add_argument('--branch', type=str, help='Branch to create', nargs='?')
    args = parser.parse_args()

    branch = args.branch
    if branch:
        pull_master()
        create_git_branch(branch)

    # Fix the resolution
    remove_resolution_from_lock(args.dep)
    set_resolution(args.dep, args.vmin, args.vmax, args.vtarget)
    run_yarn()

    if branch:
        stage_modifications()
        commit_modifications(branch)
        push_modifications(branch)
