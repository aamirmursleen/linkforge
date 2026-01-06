# UTM Builder

## Overview
The UTM Builder helps you add tracking parameters to your URLs so you can measure which marketing campaigns drive the most traffic.

## What are UTM Parameters?

UTM (Urchin Tracking Module) parameters are tags added to URLs that help track the source of traffic in analytics tools.

Example:
```
https://example.com/page?utm_source=facebook&utm_medium=social&utm_campaign=summer-sale
```

## The 5 UTM Parameters

### 1. utm_source (Required)
**What it tracks:** Where the traffic comes from
**Examples:**
- facebook
- google
- twitter
- linkedin
- newsletter
- instagram

### 2. utm_medium (Required)
**What it tracks:** The marketing channel or medium
**Examples:**
- social (organic social media)
- cpc (cost-per-click ads)
- email (email campaigns)
- banner (display ads)
- referral (partner links)

### 3. utm_campaign (Required)
**What it tracks:** The specific campaign name
**Examples:**
- summer-sale-2024
- product-launch
- black-friday
- newsletter-jan

### 4. utm_term (Optional)
**What it tracks:** Paid search keywords
**Examples:**
- running+shoes
- best+laptops
- cheap+flights

### 5. utm_content (Optional)
**What it tracks:** Differentiates similar content or A/B tests
**Examples:**
- logo-link
- text-link
- blue-button
- hero-image

## How to Use UTM Builder

1. Go to **Dashboard → UTM Builder**
2. Paste your destination URL
3. Fill in UTM parameters:
   - Source: facebook
   - Medium: social
   - Campaign: summer-sale
4. (Optional) Add term and content
5. Copy the generated URL
6. Use in your marketing!

## Quick Presets

Save time with one-click presets:

| Preset | Source | Medium |
|--------|--------|--------|
| Facebook | facebook | social |
| Twitter | twitter | social |
| Instagram | instagram | social |
| Google Ads | google | cpc |
| Email | newsletter | email |
| TikTok | tiktok | social |

## Saving Custom Presets

1. Build your UTM URL
2. Click **"Save as Preset"**
3. Name your preset (e.g., "Email Newsletter")
4. Access it anytime from your presets list

## Best Practices

### Naming Conventions
- Use lowercase letters
- Use hyphens instead of spaces: `summer-sale` not `summer sale`
- Be consistent across campaigns
- Keep names descriptive but short

### Don't
- Use spaces (they become %20)
- Use special characters
- Change naming conventions mid-campaign
- Forget to track important campaigns

### Do
- Create a naming convention document
- Use the same terms across your team
- Review UTM data regularly
- Test URLs before sharing

## Viewing UTM Analytics

1. Go to **Dashboard → Analytics**
2. Scroll to "Traffic Sources" section
3. Filter by source, medium, or campaign
4. See which UTMs drive the most clicks

## Combining with Short Links

For the best results:
1. Build your UTM URL
2. Create a short link from the UTM URL
3. Share the short link
4. Get both UTM tracking AND click analytics!

## Common Mistakes to Avoid

1. **Case sensitivity** - `Facebook` and `facebook` are different
2. **Typos** - `faceboook` won't match your other Facebook traffic
3. **Missing parameters** - Always include source, medium, campaign
4. **URL encoding** - Let the builder handle special characters
