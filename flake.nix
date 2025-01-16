{
  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShellNoCC {
          packages = [
            pkgs.devbox
            self.packages."${system}".sdkmanager
          ];
        };

        packages.sdkmanager = pkgs.stdenv.mkDerivation {
          name = "sdkmanager-with-certificates";
          src = pkgs.sdkmanager;
          buildInputs = [ pkgs.makeWrapper ];
          postInstall = ''
            mkdir --parents "$out/bin"
            cp "${pkgs.sdkmanager}/bin/sdkmanager" "$out/bin/sdkmanager"
            wrapProgram "$out/bin/sdkmanager" \
              --set NIX_SSL_CERT_FILE "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
          '';
        };
      }
    );
}
