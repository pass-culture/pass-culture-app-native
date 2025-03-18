{
  inputs.nixpkgs-old.url = "github:nixos/nixpkgs?rev=5775c2583f1801df7b790bf7f7d710a19bac66f4";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs-old,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShells.default =
        let
          pkgs = nixpkgs.legacyPackages.${system};
          pkgs-old = nixpkgs-old.legacyPackages.${system};
        in
        pkgs.mkShellNoCC {
          packages = [
            pkgs.devbox
            pkgs.jdk17 # needed by Android
            pkgs.jq # needed by some scripts run in the pipeline
            pkgs.python3 # needed by scripts/add_tracker.py
            pkgs.maestro # needed to run end to end test locally
            pkgs.act # needed to debug pipeline locally
            pkgs.gh # needed to debug pipeline locally
            pkgs.podman # needed to debug pipeline locally
            pkgs.watchman # needed by Metro bundler
          ];
        };
    });
}
