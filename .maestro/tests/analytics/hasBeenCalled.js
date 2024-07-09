const response = http.get(MAESTRO_MOCK_ANALYTICS_SERVER)
const calledAnalytics = json(response.body)

if (!EXPECTED_ANALYTICS_CALL) {
  throw new Error('you need to add an EXPECTED_ANALYTICS_CALL')
}

if (calledAnalytics.includes(EXPECTED_ANALYTICS_CALL)) {
  output.analyticsHasBeenCalled = true
  console.log(calledAnalytics);
} else {
  console.log('Analytics "' + EXPECTED_ANALYTICS_CALL + '" not called')
  output.analyticsHasBeenCalled = false
}
