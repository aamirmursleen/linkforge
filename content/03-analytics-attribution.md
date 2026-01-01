# ANALYTICS & ATTRIBUTION

## Module Overview

---

### What It Does
Track every click and scan across all your links and QR codes. Understand who's engaging, where they're coming from, and what drives conversions. Turn raw data into actionable insights.

### Why It Matters (Business Value)
- **Prove ROI**: Show exactly which channels, campaigns, and content drive results.
- **Optimize Spend**: Stop wasting budget on underperforming channels.
- **Understand Audiences**: Know your clickers—devices, locations, timing patterns.
- **Real-Time Visibility**: Don't wait for monthly reports. See what's happening now.
- **Cross-Channel Attribution**: Connect the dots between touchpoints in the customer journey.

---

## How It Works (Step-by-Step User Flow)

**Step 1: Create Trackable Links**
Every short link and QR code you create automatically captures analytics. No additional setup required.

**Step 2: Add UTM Parameters (Optional)**
Enhance attribution by adding UTM parameters to your destination URLs. We'll track both link-level and UTM-level data.

**Step 3: Deploy Across Channels**
Share your links via email, social, ads, SMS, print, and anywhere else. Each click is captured.

**Step 4: Monitor in Real-Time**
Watch clicks come in on your dashboard. See geographic pins, device breakdowns, and referrer sources as they happen.

**Step 5: Analyze & Report**
- Filter by date range, campaign, channel, or team member
- Compare performance across links
- Export data for stakeholders
- Set up automated reports

**Step 6: Optimize & Iterate**
Use insights to improve future campaigns. Double down on what works. Cut what doesn't.

---

## Key Capabilities

1. **Real-Time Click Tracking** — See clicks the moment they happen. No delays, no batch processing.

2. **Geographic Insights** — Country, region, and city-level data for every click.

3. **Device & Browser Data** — Know if your audience is on mobile or desktop, iOS or Android, Chrome or Safari.

4. **Referrer Tracking** — See where clicks originated—social platforms, email clients, or direct.

5. **UTM Parameter Support** — Full support for source, medium, campaign, term, and content parameters.

6. **Time-Based Analysis** — View trends by hour, day, week, or month. Identify peak engagement times.

7. **Unique vs. Total Clicks** — Distinguish between how many times a link was clicked vs. how many unique visitors clicked.

8. **Comparison Tools** — Compare multiple links or campaigns side-by-side.

9. **Custom Date Ranges** — Analyze any time period. Last 7 days, last quarter, custom dates.

10. **Automated Reports** — Schedule daily, weekly, or monthly reports delivered to your inbox.

11. **Export Capabilities** — Download raw data as CSV or formatted reports as PDF.

12. **API Access** — Pull analytics data programmatically for custom dashboards and integrations.

---

## Real Use-Cases

### 1. Marketing Campaign Attribution
**Scenario**: Running a product launch across email, paid social, organic social, and influencers.
**How LinkForge Helps**: Create unique links for each channel. See which source drives the most traffic and conversions. Calculate cost-per-click by channel.

### 2. Content Performance Tracking
**Scenario**: Publishing blog posts, videos, and podcasts with promotional links.
**How LinkForge Helps**: Track which content pieces drive the most engagement. Identify evergreen performers vs. one-hit wonders.

### 3. Email Marketing Optimization
**Scenario**: A/B testing subject lines, send times, and CTAs in email campaigns.
**How LinkForge Helps**: Unique links for each variant reveal true click-through performance beyond opens.

### 4. Influencer & Affiliate Performance
**Scenario**: Managing 50+ influencers promoting your product.
**How LinkForge Helps**: Each influencer gets a unique link. Compare performance, calculate compensation, identify top performers.

### 5. Physical Marketing ROI
**Scenario**: QR codes on billboards, flyers, packaging, and store displays.
**How LinkForge Helps**: Finally measure offline marketing. Compare scan rates across physical placements.

### 6. Geographic Market Analysis
**Scenario**: Expanding into new regions and need to understand demand.
**How LinkForge Helps**: See where your clicks come from. Discover unexpected markets showing organic interest.

### 7. Device & Platform Optimization
**Scenario**: Deciding whether to prioritize mobile app vs. mobile web vs. desktop.
**How LinkForge Helps**: Device breakdown shows where your audience actually is. Optimize accordingly.

### 8. Sales Team Performance
**Scenario**: Sales reps sharing product links with prospects.
**How LinkForge Helps**: Each rep gets unique links. See who drives the most engagement. Identify coaching opportunities.

---

## Example Attribution Workflow

### UTM Parameter Strategy

**Standard Taxonomy**
```
utm_source   = Where the traffic comes from (platform name)
utm_medium   = How it comes (type of channel)
utm_campaign = Why it comes (campaign name)
utm_term     = What triggered it (keyword/audience)
utm_content  = What specific element (ad/link variation)
```

**Example URL with UTMs**
```
https://yoursite.com/landing-page
  ?utm_source=linkedin
  &utm_medium=paid_social
  &utm_campaign=product_launch_q1_2024
  &utm_term=marketing_managers
  &utm_content=carousel_ad_v2
```

**Then shorten to**
```
go.brand.com/linkedin-launch
```

### UTM Naming Conventions

| Parameter | Convention | Examples |
|-----------|------------|----------|
| source | Platform name, lowercase | `facebook`, `google`, `newsletter`, `billboard-nyc` |
| medium | Channel type, lowercase | `paid_social`, `organic_social`, `email`, `qr_code`, `cpc` |
| campaign | Campaign name, date optional | `summer_sale_2024`, `product_launch`, `webinar_jan` |
| term | Audience or keyword | `retargeting`, `lookalike`, `brand_keywords` |
| content | Variation identifier | `video_ad`, `image_ad_blue`, `cta_learn_more` |

### Multi-Touch Attribution Example

**Customer Journey**
1. Sees LinkedIn ad → clicks `go.brand.com/linkedin-launch` (tracked)
2. Gets retargeting email → clicks `go.brand.com/email-reminder` (tracked)
3. Searches Google → clicks organic result (trackable if link on page)
4. Types URL directly → converts

**LinkForge Shows**
- First touch: LinkedIn (awareness)
- Second touch: Email (nurture)
- Full journey timeline with timestamps

---

## Analytics You Get

### Dashboard Metrics

| Metric | Definition | Why It Matters |
|--------|------------|----------------|
| **Total Clicks** | All clicks on a link | Raw engagement volume |
| **Unique Clicks** | Clicks from distinct visitors | True audience reach |
| **Click-Through Rate** | Clicks ÷ Impressions | Efficiency of your placement |
| **Top Performing Links** | Highest click links | Identify winners |
| **Geographic Heatmap** | Visual click distribution | Market insights |
| **Device Split** | Mobile / Desktop / Tablet | Platform prioritization |
| **Browser Distribution** | Chrome / Safari / Firefox / Edge | Compatibility focus |
| **OS Breakdown** | iOS / Android / Windows / Mac | Development priorities |
| **Referrer Sources** | Where clicks came from | Channel effectiveness |
| **Peak Times** | Hours/days of highest engagement | Timing optimization |

### How to Interpret Key Patterns

**High Clicks, Low Conversions**
- Link is working; landing page needs work
- Audience mismatch—wrong people clicking
- Technical issue on destination page

**Low Clicks, High Conversions**
- Quality over quantity—highly targeted audience
- Consider scaling this channel

**Mobile Dominant (80%+)**
- Ensure destination is mobile-optimized
- Consider mobile-first landing pages
- Test load times on cellular

**Geographic Surprises**
- Unexpected countries could mean new market opportunity
- Could also mean bot traffic—check conversion rates

**Referrer "Direct" Heavy**
- Links shared via dark social (messaging apps)
- Links typed manually (print/broadcast)
- Links in email clients that strip referrers

---

## Admin & Controls

### Analytics Permissions
| Role | Can View Own Links | Can View Team Links | Can View All Links | Can Export |
|------|-------------------|--------------------|--------------------|------------|
| Viewer | Yes | No | No | No |
| Editor | Yes | No | No | Yes (own) |
| Admin | Yes | Yes | Yes | Yes |
| Owner | Yes | Yes | Yes | Yes |

### Data Governance
- **Retention periods**: Choose how long to keep detailed click data
- **Data export**: Download all data for backup or migration
- **Privacy compliance**: Options to hash or discard IP addresses
- **Access logs**: See who viewed which analytics and when

### Reporting Controls
- **Scheduled reports**: Automate delivery to stakeholders
- **Custom dashboards**: Build views for specific teams or campaigns
- **White-label reports**: Add your branding to exported PDFs
- **Alert thresholds**: Get notified when metrics hit certain levels

---

## FAQs

**Q1: How quickly do clicks appear in analytics?**
Clicks appear within seconds. Our system processes events in real-time. You may see a 1-2 minute delay during extremely high traffic periods.

**Q2: What data do you collect about clickers?**
We collect: timestamp, approximate geographic location (country/region/city based on IP), device type, browser, operating system, and referrer URL. We do not collect names, email addresses, or other personal identifiers.

**Q3: Can I see which specific person clicked?**
No. LinkForge provides aggregate, anonymized analytics. We see "someone from New York on an iPhone clicked at 3:45 PM" but not "John Smith clicked." For person-level tracking, you need to capture that on your destination page.

**Q4: How do unique clicks work?**
We use a combination of IP address, device fingerprint, and cookies to identify unique visitors. The same visitor clicking multiple times within a session counts as one unique click.

**Q5: Why does my referrer show "direct"?**
"Direct" appears when: (1) someone types the URL manually, (2) the referrer header is stripped (common in messaging apps, some email clients), (3) the click came from HTTPS to HTTP (referrer not passed).

**Q6: Can I compare time periods?**
Yes. Select any two date ranges to see side-by-side comparison. Useful for week-over-week or month-over-month analysis.

**Q7: How do I track conversions, not just clicks?**
LinkForge tracks clicks. For conversion tracking, integrate with your analytics platform (Google Analytics, Mixpanel, etc.) using UTM parameters. This connects clicks to downstream conversion events.

**Q8: Can I get real-time alerts?**
Yes. Set up notifications for: links hitting click milestones, unusual traffic spikes, links with zero activity after X days.

**Q9: How long is analytics data retained?**
Depends on your plan. Free accounts: 30 days. Paid plans: 1-5 years. Enterprise: configurable retention.

**Q10: Can I delete analytics data?**
Yes. You can delete analytics for specific links or request full data deletion for compliance purposes. Deleted data cannot be recovered.

---

## Limitations & Best Practices

### Platform Limitations
- **Granularity**: City-level is the most precise geographic data (not street-level)
- **Bot filtering**: We filter known bots but sophisticated bots may occasionally pass
- **Referrer gaps**: Some sources (apps, email clients) don't pass referrer data
- **Cross-device**: Same person on different devices counts as different unique visitors

### Accuracy Best Practices
- **Use UTM parameters**: Don't rely solely on referrer data; it's incomplete
- **Create unique links per channel**: Don't reuse links across different sources
- **Give campaigns time**: 24-48 hours minimum before drawing conclusions
- **Watch for outliers**: A single bot can skew numbers; look at patterns, not anomalies

### Reporting Best Practices
- **Compare fairly**: Same day-of-week, similar conditions
- **Segment meaningfully**: Channel, audience, content type
- **Focus on trends**: Day-to-day noise matters less than weekly/monthly trends
- **Tie to outcomes**: Clicks are a means, not an end. Connect to business results.

### Privacy Best Practices
- **Be transparent**: Tell users you track click data in your privacy policy
- **Respect regulations**: Enable IP hashing for GDPR compliance if needed
- **Limit retention**: Don't keep data longer than you need it
- **Honor requests**: Have a process for data deletion requests

---

## UI Microcopy (For App Screens)

### Button Labels
- "View Analytics"
- "Export Report"
- "Compare Links"
- "Schedule Report"
- "Download CSV"
- "Download PDF"
- "Set Date Range"
- "Clear Filters"

### Empty States
- **No clicks yet**: "This link hasn't received any clicks yet. Share it to start tracking engagement."
- **No data for date range**: "No clicks recorded during this period. Try expanding your date range."
- **No links match filters**: "No links match your current filters. Adjust filters or clear them to see more."

### Tooltips
- **Unique clicks**: "Number of distinct visitors who clicked. Same visitor clicking multiple times counts once."
- **Total clicks**: "Every click on this link, including repeat clicks from the same visitor."
- **Referrer**: "The website or app where the visitor clicked from. 'Direct' means no referrer was detected."
- **Device type**: "The type of device used to click: mobile phone, tablet, or desktop computer."
- **Geographic data**: "Location is estimated based on IP address. Accuracy varies by region."

### Helper Text
- **Date range selector**: "Compare performance over different time periods."
- **Export format**: "CSV for spreadsheets and analysis. PDF for sharing with stakeholders."
- **Filter by tag**: "Select tags to see performance for specific campaigns or categories."
- **Timezone**: "All times displayed in your account timezone setting."

### Alert Messages
- "Click data is updated in real-time."
- "Export started. You'll receive an email when it's ready."
- "Large date ranges may take a few moments to load."
- "Scheduled report saved successfully."

---
