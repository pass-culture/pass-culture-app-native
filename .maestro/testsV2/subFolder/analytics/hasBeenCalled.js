const response = http.get(MAESTRO_MOCK_ANALYTICS_SERVER);
const calledAnalytics = JSON.parse(response.body);

if (!EXPECTED_ANALYTICS_CALL) {
  throw new Error('You need to add an EXPECTED_ANALYTICS_CALL');
}

var analyticsCountMap = {};
for (var i = 0; i < calledAnalytics.length; i++) {
  var analyticsCall = calledAnalytics[i].analyticsKey;
  var params = calledAnalytics[i].params;
  if (analyticsCountMap[analyticsCall]) {
    analyticsCountMap[analyticsCall].count++;
    analyticsCountMap[analyticsCall].params.push(params);
  } else {
    analyticsCountMap[analyticsCall] = { count: 1, params: [params] };
  }
}

var analyticsHasBeenCalled = false;
for (var j = 0; j < calledAnalytics.length; j++) {
  if (calledAnalytics[j].analyticsKey === EXPECTED_ANALYTICS_CALL) {
    analyticsHasBeenCalled = true;
    break;
  }
}

output.analyticsHasBeenCalled = analyticsHasBeenCalled;

var logOutput = 'Called Analytics:\n';
for (var analyticsCall in analyticsCountMap) {
  if (analyticsCountMap.hasOwnProperty(analyticsCall)) {
    var count = analyticsCountMap[analyticsCall].count;
    var paramsList = analyticsCountMap[analyticsCall].params;
    logOutput += ` ║             ${analyticsCall}`;
    if (count > 1) {
      logOutput += ` (called ${count} times)`;
    }
    logOutput += '\n';
    logOutput += ` └── Parameters: ${JSON.stringify(paramsList)}\n`;
  }
}

console.log(logOutput);

if (analyticsHasBeenCalled) {
  console.log('Expected analytics call found ✅');
} else {
  console.log(`Analytics call did not match the expected one: "${EXPECTED_ANALYTICS_CALL}"`);
}
