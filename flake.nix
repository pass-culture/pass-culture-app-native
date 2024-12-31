{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShells.default =
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.mkShellNoCC {
          packages = [
            pkgs.devbox
            pkgs.jdk17 # needed to build Android app from the CLI
            pkgs.sdkmanager # needed by ours Android's scripts
            pkgs.toybox # needed to build Android app from the CLI
            pkgs.ios-deploy # needed to run the app on real iPhone
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
