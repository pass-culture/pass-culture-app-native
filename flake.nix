{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    { self
    , nixpkgs
    , flake-utils
    }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShell =
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.mkShellNoCC {
          packages = [
            pkgs.nix # ensure to have always the same version
            pkgs.devbox
            self.packages.${system}.maestro
          ];
        };

      packages.maestro =
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        pkgs.callPackage ./packages/maestro.nix { };
    });
}
