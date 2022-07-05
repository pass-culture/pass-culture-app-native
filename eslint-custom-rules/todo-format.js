/**
 * @fileoverview Rule that warns about used warning comments
 * @author Alexander Schmidt <https://github.com/lxanders>
 */

 function escapeRegExp(string) {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

module.exports = {
  name: 'todo-format',
  meta: {
    docs: {
      description: 'Enforce formatting for TODO and FIXME comments',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode(),
      configuration = context.options[0] || {},
      warningTerms = ['todo ', 'todo:', 'todo()', 'fixme ', 'fixme:', 'fixme()']

    /**
     * Convert a warning term into a RegExp which will match a comment containing that whole word.
     * If the term starts or ends with non word characters, then the match will not
     * require word boundaries on that side.
     * @param {string} term A term to convert to a RegExp
     * @returns {RegExp} The term converted to a RegExp
     */
    function convertToRegExp(term) {
      const escaped = escapeRegExp(term)
      const wordBoundary = '\\b'
      const eitherOrWordBoundary = `|${wordBoundary}`
      let prefix

      if (/^\w/u.test(term)) {
        prefix = wordBoundary;
      } else {
          prefix = "";
      }

      /*
       * If the term ends in a word character (a-z0-9_), ensure a word
       * boundary at the end, so that substrings do not get falsely
       * matched. eg "todo" in a string such as "mastodon".
       * If the term ends in a non-word character, then \b won't match on
       * the boundary to the next non-word character, which would likely
       * be a space. For example `/\bFIX!\b/.test('FIX! blah') === false`.
       * In these cases, use no bounding match. Same applies for the
       * prefix, handled below.
       */
      const suffix = /\w$/u.test(term) ? "\\b" : "";

      /*
       * The regex should be
       * \bTERM\b|\bTERM\b, this checks the entire comment
       * for the term.
       */
      return new RegExp(
        prefix + escaped + suffix,
        'iu'
      )
    }

    const warningRegExps = warningTerms.map(convertToRegExp)

    /**
     * Checks the specified comment for matches of the configured warning terms and returns the matches.
     * @param {string} comment The comment which is checked.
     * @returns {Array} All matched warning terms for this comment.
     */
    function commentContainsWarningTerm(comment) {
      const matches = []

      warningRegExps.forEach((regex, index) => {
        if (regex.test(comment)) {
          matches.push(warningTerms[index])
        }
      })

      return matches
    }

    /**
     * Checks the specified node for matching warning comments and reports them.
     * @param {ASTNode} node The AST node being checked.
     * @returns {void} undefined.
     */
    function checkComment(node) {
      const comment = node.value
      const matches = commentContainsWarningTerm(comment)

      if (matches.length) {
        context.report({
          node,
          message: "Wrong TODO/FIXME format. Accepted formats : \n TODO(githubUsername): … \n TODO(PC-12345): … \n FIXME(githubUsername): … \n FIXME(PC-12345): … \n"
        })
      }
    }

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        comments.filter((token) => token.type !== 'Shebang').forEach(checkComment)
      },
    }
  },
}
