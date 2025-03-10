// Implémentation directe d'escape-string-regexp
// Basée sur https://github.com/sindresorhus/escape-string-regexp

function escapeStringRegexp(string) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string')
  }

  // Escape characters with special meaning in RegExp
  return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\-')
}

export default escapeStringRegexp
