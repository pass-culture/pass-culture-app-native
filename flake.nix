{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";

  # we use https://www.nixhub.io/ to find the exact version that we are looking for
  # then we pin this version in the Nix flake
  inputs.nixpkgs_nodejs.url = "github:nixos/nixpkgs?rev=dd5621df6dcb90122b50da5ec31c411a0de3e538"; # contains nodejs 20.10.0
  inputs.nixpkgs_ruby.url = "github:nixos/nixpkgs?rev=0343e3415784b2cd9c68924294794f7dbee12ab3"; # contains ruby 2.7.5

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs_nodejs,
      nixpkgs_ruby,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShells.default =
        let
          pkgs = nixpkgs.legacyPackages.${system};
          pkgs_nodejs = nixpkgs_nodejs.legacyPackages.${system};
          pkgs_ruby = nixpkgs_ruby.legacyPackages.${system};
        in
        pkgs.mkShellNoCC {
          packages = [
            pkgs_nodejs.nodejs # needed to install NodeJS dependencies, run scripts...
            pkgs_ruby.ruby # needed to run FastLane and to install iOS dependencies
            pkgs.jdk17 # needed by Android
            pkgs.jq # needed by some scripts run in the pipeline
            pkgs.python3 # needed by scripts/add_tracker.py
            pkgs.maestro # needed to run end to end test locally
            pkgs.act # needed to debug pipeline locally
            pkgs.gh # needed to debug pipeline locally
            pkgs.podman # needed to debug pipeline locally
            pkgs.watchman # needed by Metro bundler
          ]
          ++ (pkgs.lib.optionals pkgs.stdenv.hostPlatform.isDarwin [
            pkgs.ios-deploy # needed to run the app on real iPhone
            pkgs.xcbeautify # optional to build iOS app
          ]);
        };
    });
}
