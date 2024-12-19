{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  inputs.brew-api.url = "github:BatteredBunny/brew-api";
  inputs.brew-api.flake = false;
  inputs.brew-nix.url = "github:BatteredBunny/brew-nix";
  inputs.brew-nix.inputs.brew-api.follows = "brew-api";
  inputs.brew-nix.inputs.nixpkgs.follows = "nixpkgs";
  inputs.brew-nix.inputs.flake-utils.follows = "flake-utils";

  outputs =
    { self
    , nixpkgs
    , flake-utils
    , brew-nix
    , ...
    }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShell =
        let
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
            overlays = [
              brew-nix.overlays.default
            ];
          };
          inherit (pkgs) lib;
        in
        pkgs.mkShellNoCC {
          packages = [
            pkgs.devbox
          ]
          ++
          (lib.optionals pkgs.stdenv.hostPlatform.isDarwin [
            pkgs.brewCasks.android-studio
            pkgs.brewCasks.firefox
          ]);
        };
    });
}
