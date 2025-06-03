buildLocationParameter
 buildLocationParameter
- should return undefined when there is no userPosition
- should return a position with a "all" radius when selectedLocationMode is "EVERYWHERE" and there is a userPosition
- should return a position with a specified radius when selectedLocationMode is "AROUND_ME" and there is a userPosition
- should return a position with a specified radius when selectedLocationMode is "AROUND_PLACE" and there is a userPosition
- should return a position with a minimum radius when selectedLocationMode is "AROUND_ME", the radius is 0 and there is a userPosition
- should return a position with a minimum radius when selectedLocationMode is "AROUND_PLACE", the radius is 0 and there is a userPosition


 buildLocationParameter

