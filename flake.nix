{
  inputs.nixpkgs-old.url = "github:nixos/nixpkgs?rev=5775c2583f1801df7b790bf7f7d710a19bac66f4";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs-old,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShells.default =
        let
          pkgs-old = nixpkgs-old.legacyPackages.${system};
        in
        pkgs-old.mkShellNoCC {
          packages = [
            pkgs-old.devbox
            pkgs-old.jdk17 # needed by Android
            pkgs-old.jq # needed by some scripts run in the pipeline
            pkgs-old.python3 # needed by scripts/add_tracker.py
            pkgs-old.maestro # needed to run end to end test locally
            pkgs-old.act # needed to debug pipeline locally
            pkgs-old.gh # needed to debug pipeline locally
            pkgs-old.podman # needed to debug pipeline locally
          ];
        };
    });
}
