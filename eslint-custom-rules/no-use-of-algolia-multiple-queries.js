/**
 * This rule avoids using multipleQueries, forcing to use our custom method instead.
 * The risk by using the Algolia method is to encounter the quota of queries, which returns an empty array.
 *
 * KO:
 * import { client } from 'libs/algolia/fetchAlgolia/clients'
 * await client.multipleQueries(queries)
 *
 * OK:
 * import { multipleQueries } from 'libs/algolia/fetchAlgolia/multipleQueries'
 * await multipleQueries(queries)
 */

module.exports = function(context) {
  return {
    'MemberExpression[object.name=client][property.name=multipleQueries]': function(node) {
      context.report({
        node,
        message: 'Avoid using client.multipleQueries. Use another method instead.',
      });
    },
  };
};
