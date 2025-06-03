useInit
 useInit
- should set default event parameters to null when the campaign date started more than 24 hours ago
- should set default event parameters to null when there is no campaign date
- should not reset default event parameters if the campaign date started less than 24 hours ago
- should not reset default event parameters while reading campaign date
- should remove generate UTM keys from localStorage when campaignDate is null

