#!/usr/bin/env sh
set -eu

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"

if [ -s "$NVM_DIR/nvm.sh" ]; then
	. "$NVM_DIR/nvm.sh"
elif [ -x "$(command -v brew)" ] && [ -s "$(brew --prefix nvm)/nvm.sh" ]; then
	. "$(brew --prefix nvm)/nvm.sh"
fi

nvm use ||
	{
		nvm install
		nvm use
	}
