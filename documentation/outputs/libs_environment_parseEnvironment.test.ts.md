parseEnvironment
 parseBooleanVariables
- should generate falsy values for feature flags used with false
- should generate truthy values for feature flags used with true
- should not touch strings other than "true" and "false"


 parseEnvironment
- should log error when having a validation error
- should log to Sentry when having a validation error

