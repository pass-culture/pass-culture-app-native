useGetCurrencyToDisplay
 and the feature flag is enabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 and the feature flag is disabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 when location mode is EVERYWHERE


 and the feature flag is enabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 and the feature flag is disabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 when selectedPlace is defined in New Caledonia and location mode is EVERYWHERE


 when user is not connected and location is outside New Caledonia
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 and the feature flag is enabled
- should return Pacific Franc short ("F") when displayFormat is "short"
- should return Pacific Franc full ("francs Pacifique") when displayFormat is "full"


 and the feature flag is disabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 when user is not connected and location is in New Caledonia


 and the feature flag is enabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 and the feature flag is disabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 when user is registered in Euro region


 and the feature flag is enabled
- should return Pacific Franc short ("F") when displayFormat is "short"
- should return Pacific Franc full ("francs Pacifique") when displayFormat is "full"


 and the feature flag is disabled
- should return Euro when displayFormat is "short"
- should return Euro when displayFormat is "full"


 when user is registered in Pacific Franc region


 useGetCurrencyToDisplay
- should return Euro by default when location and user are not provided

