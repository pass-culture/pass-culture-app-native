/**
 *Compare timestamps using this margin expressed in seconds for a better UX experience.
 *
 *Example : we do not want to tell a user a token is valid, for it to expire in the next 10 seconds.
 *So we do the follwoing comparison : now + TIMESTAMPS_COMPARE_MARGIN > token_validity
 */
const TIMESTAMPS_COMPARE_MARGIN = 300 // seconds

/**
 *@returns current timestamp expressed in seconds.
 */
export function currentTimestamp() {
  return Math.round(new Date().valueOf() / 1000)
}

/**
 *@param timestamp to check for expiration.
 *@param margin in seconds to add to current time for comparaison. Default value: 500.
 *@returns true if current time + margin is superior or equal to timestamp.
 */
export function isTimestampExpired(
  timestamp: number,
  margin: number = TIMESTAMPS_COMPARE_MARGIN
): boolean {
  return currentTimestamp() + margin >= timestamp
}
