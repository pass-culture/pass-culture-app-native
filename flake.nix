{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

  # we use https://www.nixhub.io/ to find the exact version that we are looking for
  # then we pin this version in the Nix flake
  inputs.nixpkgs_ruby.url =
    "github:nixos/nixpkgs?rev=c5dd43934613ae0f8ff37c59f61c507c2e8f980d"; # contains ruby 3.3.6
  inputs.nixpkgs_gitleaks.url =
    "github:nixos/nixpkgs?rev=01b6809f7f9d1183a2b3e081f0a1e6f8f415cb09"; # contains gitleaks 8.28.0
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs_maestro.url = 
    "github:nixos/nixpkgs?rev=55ba7f49ef2962b42cbd126522b7df5f95037679"; # contains maestro 2.11.0

  outputs = { self, nixpkgs, nixpkgs_ruby, nixpkgs_gitleaks, nixpkgs_maestro, flake-utils, }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        pkgs_ruby = nixpkgs_ruby.legacyPackages.${system};
        pkgs_gitleaks = nixpkgs_gitleaks.legacyPackages.${system};
        pkgs_maestro = nixpkgs_maestro.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShellNoCC {
          packages = [
            pkgs_ruby.ruby # needed to run FastLane and to install iOS dependencies
            pkgs.jdk17 # needed by Android
            pkgs.jq # needed by some scripts run in the pipeline
            pkgs.python3 # needed by scripts/add_tracker.py
            pkgs_maestro.maestro # needed to run end to end test locally
            pkgs.act # needed to debug pipeline locally
            pkgs.gh # needed to debug pipeline locally
            pkgs.podman # needed to debug pipeline locally
            pkgs.watchman # needed by Metro bundler
            pkgs_gitleaks.gitleaks # needed to avoid secrets leaking
          ] ++ (pkgs.lib.optionals pkgs.stdenv.hostPlatform.isDarwin [
            pkgs.ios-deploy # needed to run the app on real iPhone
            pkgs.xcbeautify # optional to build iOS app
          ]);
        };
        formatter = pkgs.nixfmt;
      });
}
