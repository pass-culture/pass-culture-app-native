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
            # self.packages."${system}".jdk
            # self.packages."${system}".sdkmanager
            self.packages."${system}".create-certificate-bundle
          ];

          # shellHook = ''
          #   set -x
          #   env
          #   if [ -z "$SSL_CERT_FILE" ]; then
          #     export CERTIFICATE_BUNDLE_FILE="/tmp/certificates.crt"
          #     "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt" >"$CERTIFICATE_BUNDLE_FILE"
          #     cat "$SSL_CERT_FILE" "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt" >"$CERTIFICATE_BUNDLE_FILE"
          #   fi
          # '';
        };

        packages.create-certificate-bundle = pkgs.writeShellApplication {
          name = "create-certificate-bundle";
          text = ''
            set -x
            env
            if [ -n "$SSL_CERT_FILE" ]; then
              export CERTIFICATE_BUNDLE_FILE="/tmp/certificates.crt"
              cat "$SSL_CERT_FILE" "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt" >"$CERTIFICATE_BUNDLE_FILE"
              export SSL_CERT_FILE="$CERTIFICATE_BUNDLE_FILE"
              export NODE_EXTRA_CA_CERTS="$CERTIFICATE_BUNDLE_FILE"
              export NIX_SSL_CERT_FILE="$CERTIFICATE_BUNDLE_FILE"
            fi
          '';
        };

        packages.jdk = pkgs.writeShellApplication {
          name = "jdk";
          runtimeInputs = [ pkgs.jdk17 ];
          text = ''
            TEMP="$(mktemp)"
            cat "$NIX_SSL_CERT_FILE" "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt" >"$TEMP"
            export NIX_SSL_CERT_FILE="$TEMP"
            exec -a "$0" "${pkgs.jdk17}/bin/java" "$@"
          '';
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
