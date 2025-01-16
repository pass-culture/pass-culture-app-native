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

        packages.sdkmanager = pkgs.writeShellApplication {
          name = "sdkmanager";
          runtimeInputs = [ pkgs.makeWrapper ];
          text = ''
            # mkdir --parents "$out/bin"
            # cp "${pkgs.sdkmanager}/bin/sdkmanager" "$out/bin/sdkmanager"
            #   --set NIX_SSL_CERT_FILE "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
            # wrapProgram "$out/bin/sdkmanager" \
            #   --set NIX_SSL_CERT_FILE "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"

            TEMP="$(mktemp)"
            cat "$NIX_SSL_CERT_FILE" "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt" >"$TEMP"
            export NIX_SSL_CERT_FILE="$TEMP"
            exec -a "$0" "${pkgs.sdkmanager}/bin/sdkmanager" "$@"
          '';
        };

        packages.sdkmanager2 = pkgs.stdenv.mkDerivation {
          name = "sdkmanager-with-certificates";
          src = pkgs.sdkmanager;
          buildInputs = [ pkgs.makeWrapper ];
          postInstall = ''
            mkdir --parents "$out/bin"
            wrapProgram "$out/bin/sdkmanager" \
              --set NIX_SSL_CERT_FILE "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
          '';
        };
      }
    );
}
