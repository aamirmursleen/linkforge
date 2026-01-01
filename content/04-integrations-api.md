# INTEGRATIONS & API

## Module Overview

---

### What It Does
Connect LinkForge with your existing tools and build custom solutions with our developer-friendly API. Automate link creation, sync data across platforms, and embed link management into your own applications.

### Why It Matters (Business Value)
- **Workflow Automation**: Create links automatically from your CRM, email platform, or marketing tools.
- **Data Synchronization**: Keep click data flowing into your analytics and reporting systems.
- **Custom Solutions**: Build exactly what your business needs with our flexible API.
- **Reduced Manual Work**: Eliminate copy-paste. Let systems talk to each other.
- **Scalability**: Handle thousands of links programmatically without human bottlenecks.

---

## How It Works (Step-by-Step User Flow)

### For Native Integrations
**Step 1: Browse Integration Directory**
Find the tool you want to connect from our integration library.

**Step 2: Authorize Connection**
Click "Connect" and authenticate with your other platform (usually OAuth).

**Step 3: Configure Settings**
Choose what triggers link creation, where data flows, and how often to sync.

**Step 4: Test & Activate**
Run a test to verify everything works, then turn the integration live.

### For API Implementation
**Step 1: Generate API Key**
Create an API key in your account settings. Keep it secure.

**Step 2: Read Documentation**
Our API docs include endpoints, parameters, authentication, and code examples.

**Step 3: Build & Test**
Use our sandbox environment to test your integration without affecting production data.

**Step 4: Deploy**
Move to production API endpoints once testing is complete.

---

## Key Capabilities

### Native Integrations

1. **Zapier** — Connect to 5,000+ apps. Create links from form submissions, CRM updates, spreadsheet entries, and more.

2. **HubSpot** — Auto-shorten links in emails, track click data in contact records, trigger workflows based on engagement.

3. **Salesforce** — Create tracking links for sales outreach, log click activity to leads and opportunities.

4. **Google Analytics** — Automatic UTM parameter integration, import click data as events.

5. **Slack** — Create short links directly from Slack, get notifications for click milestones.

6. **Microsoft Teams** — Link creation and analytics access without leaving Teams.

7. **Mailchimp** — Auto-shorten links in campaigns, enhanced click tracking beyond Mailchimp's native data.

8. **Shopify** — Create product links, track marketing channel performance, integrate with shop analytics.

9. **WordPress** — Plugin for shortening links in posts, automatic link replacement, click tracking in dashboard.

10. **Google Sheets** — Bulk create links from spreadsheet data, export analytics back to Sheets.

### API Capabilities

1. **RESTful API** — Standard REST architecture with JSON request/response format.

2. **Authentication** — API keys or OAuth 2.0 for secure access.

3. **Rate Limiting** — Generous limits that scale with your plan.

4. **Webhooks** — Real-time notifications for link clicks and events.

5. **Sandbox Environment** — Test without affecting production data.

6. **SDKs** — Official libraries for Python, JavaScript/Node.js, PHP, Ruby, and Go.

7. **Comprehensive Docs** — Interactive documentation with try-it-now functionality.

8. **Versioned Endpoints** — Stable API versions so your integrations don't break.

---

## Real Use-Cases

### 1. Marketing Automation
**Scenario**: Auto-create tracking links for every email campaign.
**Integration**: Mailchimp + LinkForge via Zapier
**How It Works**: When a new campaign is created, Zapier triggers LinkForge to generate tracked short links for each CTA. Links auto-insert into the campaign.

### 2. Sales Enablement
**Scenario**: Sales reps need personalized tracking links for prospects.
**Integration**: Salesforce + LinkForge
**How It Works**: When a new opportunity is created, a unique tracking link is generated. Click data logs to the opportunity record. Reps see engagement in Salesforce.

### 3. E-commerce Attribution
**Scenario**: Track which marketing channels drive purchases.
**Integration**: Shopify + LinkForge + Google Analytics
**How It Works**: All marketing links go through LinkForge with UTM parameters. Click data flows to GA, sales data comes from Shopify. Connect the dots in your analytics dashboard.

### 4. Content Publishing
**Scenario**: Automatically shorten all links in blog posts.
**Integration**: WordPress + LinkForge Plugin
**How It Works**: Plugin scans post content, replaces long URLs with branded short links, tracks clicks in WordPress dashboard.

### 5. Customer Support
**Scenario**: Track which help articles solve tickets.
**Integration**: Zendesk + LinkForge via API
**How It Works**: Support agents share shortened help article links. Click data helps identify which articles are most useful. Articles with high clicks but repeat tickets need improvement.

### 6. Event Management
**Scenario**: Generate unique registration links for each speaker/sponsor.
**Integration**: Eventbrite + LinkForge via Zapier
**How It Works**: When a speaker is added, generate their unique referral link. Track registrations by speaker. Calculate speaker-driven revenue.

### 7. Developer Applications
**Scenario**: White-label link shortening in your own SaaS.
**Integration**: LinkForge API
**How It Works**: Your app calls our API to create links on behalf of your users. Links appear with your branding. You manage the UI; we handle the infrastructure.

### 8. Business Intelligence
**Scenario**: Aggregate all link data into company-wide dashboards.
**Integration**: API + Data Warehouse (Snowflake, BigQuery)
**How It Works**: Scheduled API calls pull click data into your warehouse. Combine with other marketing data for unified reporting.

---

## API Documentation Overview

### Authentication

**API Key (Simple)**
```
curl -X POST https://api.linkforge.io/v1/links \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"long_url": "https://example.com/page"}'
```

**OAuth 2.0 (For User-Facing Apps)**
- Authorization endpoint: `https://linkforge.io/oauth/authorize`
- Token endpoint: `https://api.linkforge.io/oauth/token`
- Scopes: `links:read`, `links:write`, `analytics:read`, `account:read`

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/links` | POST | Create a new short link |
| `/v1/links` | GET | List all links (paginated) |
| `/v1/links/{id}` | GET | Get link details |
| `/v1/links/{id}` | PATCH | Update link (destination, settings) |
| `/v1/links/{id}` | DELETE | Delete a link |
| `/v1/links/{id}/qr` | GET | Generate QR code for link |
| `/v1/links/{id}/analytics` | GET | Get click analytics |
| `/v1/qr-codes` | POST | Create a QR code |
| `/v1/domains` | GET | List branded domains |
| `/v1/groups` | GET | List folders/groups |

### Create Link Example

**Request**
```json
POST /v1/links
{
  "long_url": "https://example.com/very-long-page-url",
  "domain": "go.yourbrand.com",
  "slug": "summer-promo",
  "title": "Summer 2024 Promotion",
  "tags": ["campaign:summer", "channel:email"],
  "expires_at": "2024-09-01T00:00:00Z"
}
```

**Response**
```json
{
  "id": "lnk_abc123",
  "short_url": "https://go.yourbrand.com/summer-promo",
  "long_url": "https://example.com/very-long-page-url",
  "title": "Summer 2024 Promotion",
  "tags": ["campaign:summer", "channel:email"],
  "created_at": "2024-06-01T10:30:00Z",
  "expires_at": "2024-09-01T00:00:00Z",
  "clicks": 0
}
```

### Webhooks

**Supported Events**
- `link.created` — New link created
- `link.updated` — Link destination or settings changed
- `link.deleted` — Link deleted
- `link.clicked` — Link received a click (configurable threshold)
- `qr.scanned` — QR code scanned

**Webhook Payload Example**
```json
{
  "event": "link.clicked",
  "timestamp": "2024-06-15T14:22:33Z",
  "data": {
    "link_id": "lnk_abc123",
    "short_url": "https://go.brand.com/promo",
    "click_count": 1000,
    "milestone": true
  }
}
```

### Rate Limits

| Plan | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 60 | 1,000 |
| Core | 300 | 10,000 |
| Growth | 600 | 50,000 |
| Enterprise | Custom | Custom |

---

## Admin & Controls

### API Key Management
- **Multiple keys**: Create separate keys for different applications
- **Key permissions**: Restrict keys to specific scopes (read-only, links-only, etc.)
- **Key rotation**: Generate new keys without disrupting active integrations
- **Usage monitoring**: See which keys are making the most requests

### Integration Governance
- **Approval workflows**: Require admin approval for new integration connections
- **Audit logs**: Track who enabled which integrations and when
- **IP allowlisting**: Restrict API access to specific IP addresses
- **Data flow controls**: Choose what data each integration can access

### Developer Resources
- **API status page**: Real-time API health and incident communication
- **Change log**: Notification of upcoming API changes and deprecations
- **Developer support**: Priority support channel for integration issues
- **Community forum**: Connect with other developers building on LinkForge

---

## FAQs

**Q1: Do I need to code to use integrations?**
No. Native integrations (like Zapier, HubSpot) require no coding. Just click "Connect" and configure. The API is for custom development needs.

**Q2: What's the difference between API keys and OAuth?**
API keys are for server-to-server communication where you control both sides. OAuth is for building apps where users authorize access to their own LinkForge accounts.

**Q3: Can I create a white-label solution with the API?**
Yes. Enterprise plans support white-label configurations where you use the API but present your own branding to end users.

**Q4: What happens if I hit rate limits?**
You'll receive a `429 Too Many Requests` response. Implement exponential backoff and retry. Contact us if you consistently need higher limits.

**Q5: Can I test integrations without affecting production?**
Yes. Use our sandbox environment with test API keys. Sandbox data is isolated and reset regularly.

**Q6: How do webhooks handle failures?**
We retry failed webhook deliveries with exponential backoff for up to 24 hours. You can view failed deliveries in your dashboard.

**Q7: Are there official SDKs?**
Yes. We provide official SDKs for Python, JavaScript/Node.js, PHP, Ruby, and Go. Community SDKs exist for other languages.

**Q8: Can I use the API to bulk create links?**
Yes. Use the batch endpoint (`POST /v1/links/batch`) to create up to 1,000 links in a single request.

**Q9: How do I get notified of API changes?**
Subscribe to our developer newsletter and check the API changelog. We provide at least 6 months notice before breaking changes.

**Q10: Is there a cost for API access?**
API access is included in all paid plans. Rate limits vary by plan. Free plans have limited API access.

---

## Limitations & Best Practices

### Technical Limitations
- **Batch size**: Maximum 1,000 links per batch request
- **Webhook timeout**: Your endpoint must respond within 10 seconds
- **Payload size**: Maximum 1MB per API request
- **Concurrent connections**: Maximum 100 simultaneous connections per account

### Integration Best Practices
- **Error handling**: Always implement proper error handling and retries
- **Idempotency**: Use idempotency keys for critical operations to prevent duplicates
- **Logging**: Log API responses for debugging and audit purposes
- **Monitoring**: Set up alerts for error rate spikes and latency issues

### Security Best Practices
- **Key storage**: Never commit API keys to code repositories
- **Key rotation**: Rotate keys regularly (at least quarterly)
- **Least privilege**: Create keys with only the permissions they need
- **IP restrictions**: Limit API access to known server IPs when possible

### Webhook Best Practices
- **Verify signatures**: Always verify webhook signatures to prevent spoofing
- **Respond quickly**: Return 200 OK immediately, then process asynchronously
- **Idempotent processing**: Handle potential duplicate webhook deliveries gracefully
- **Retry logic**: Implement your own retry logic for critical downstream operations

---

## UI Microcopy (For App Screens)

### Button Labels
- "Connect Integration"
- "Disconnect"
- "Generate API Key"
- "Revoke Key"
- "View Documentation"
- "Test Connection"
- "Configure Webhook"
- "View Logs"

### Empty States
- **No integrations connected**: "Connect your favorite tools to automate link creation and data sync."
- **No API keys**: "Generate an API key to start building custom integrations."
- **No webhooks configured**: "Set up webhooks to receive real-time notifications when events occur."

### Tooltips
- **API Key**: "Use this key to authenticate API requests. Keep it secret."
- **OAuth scope**: "Permissions this integration will have. Only approve scopes you're comfortable with."
- **Webhook URL**: "The endpoint where we'll send event notifications. Must be HTTPS."
- **Rate limit**: "Maximum number of API requests allowed per time period."

### Helper Text
- **API key name**: "Give this key a descriptive name so you remember what it's for."
- **Webhook URL**: "Enter the HTTPS URL where you want to receive event notifications."
- **OAuth redirect URI**: "The URL where users will be sent after authorizing your app."
- **IP allowlist**: "Only allow API requests from these IP addresses. Leave empty to allow all."

### Alert Messages
- "Integration connected successfully."
- "API key generated. Copy it now—you won't be able to see it again."
- "Webhook test sent. Check your endpoint for the test payload."
- "Connection failed. Please check your credentials and try again."
- "This integration requires admin approval. Request sent."

---
