InteractionTag
 getTagProps
- should return null if no parameters are provided
- should return the "Reco du Club" tag if chroniclesCount > 0
- should return the "Reco par les lieux" tag if chroniclesCount is 0 and headlinesCount > 0
- should return the "j’aime" tag if chroniclesCount and headlinesCount are 0 and likesCount > 0
- should return null if likesCount, headlinesCount and chroniclesCount are not > 0
- should use short label when hasSmallLayout is true "Reco lieux"
- should use short label when hasSmallLayout is true "Reco Club"
- should return the "Bientôt dispo" tag if isComingSoonOffer is true


 <InteractionTag />
- should have correct testID and style

