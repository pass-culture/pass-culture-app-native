module.exports = {
  name: 'todo-format',
  meta: {
    docs: {
      description: 'Enforce formatting for TODO and FIXME comments',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode()
    const warningRegExps = [ /\b(?:TODO|FIXME)\b(?!\(PC-\d+\))/ui ]

    /**
     * Checks the specified comment for matches of the configured warning terms and returns the matches.
     * @param {string} comment The comment which is checked.
     * @returns {boolean} if the comment matches any of the warning regex.
     */
    function commentContainsWarningTerm(comment) {
      for (regex of warningRegExps) {
        if (regex.exec(comment) !== null) {
          return true
        }
      }
      return false
    }

    /**
     * Checks the specified node for matching warning comments and reports them.
     * @param {ASTNode} node The AST node being checked.
     * @returns {void} undefined.
     */
    function checkComment(node) {
      const comment = node.value

      if (commentContainsWarningTerm(comment)) {
        context.report({
          node,
          message: "Wrong TODO/FIXME format. Accepted formats:\n TODO(PC-12345): … \n FIXME(PC-12345): … \n"
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
