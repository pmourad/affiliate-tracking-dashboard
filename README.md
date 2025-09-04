# Harold's Smart Redirect - Affiliate Link Tracking System

A fast, privacy-focused affiliate link tracking system built with Next.js 14 and Supabase.

## 🚀 Features

- **⚡ Lightning-fast redirects** - Edge runtime for <150ms response times
- **📊 Real-time analytics** - Track clicks by client, service, industry, and channel
- **🔒 Privacy-first** - IP addresses are hashed, never stored raw
- **🛡️ Secure admin panel** - Basic Auth protection for statistics
- **🔗 Link builder tool** - Easy-to-use form for creating tracking URLs
- **📱 Mobile-friendly** - Responsive design for all devices

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Edge Runtime
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Validation**: Zod for type-safe input validation
- **Security**: SHA-256 IP hashing, Basic Auth

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account
- Vercel account (for deployment)

## 🛠️ Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo>
   cd tracking-system
   npm install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL from `supabase.sql` in the SQL Editor
   - Get your Project URL and Service Role Key

3. **Configure environment variables:**
   Create `.env.local` with:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   IP_HASH_SALT=your_random_salt_string
   ADMIN_USER=harold
   ADMIN_PASS=your_secure_password
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔗 Usage

### Creating Tracking Links

**Option 1: Use the Link Builder**
- Visit `/builder` 
- Fill out the form with your campaign details
- Copy the generated tracking URL

**Option 2: Manual URL Format**
```
/api/r?client=CLIENT&service=SERVICE&industry=INDUSTRY&channel=CHANNEL&campaign=CAMPAIGN&dest=DESTINATION_URL
```

**Required Parameters:**
- `client` - Client identifier (e.g., "superboats")
- `service` - Service name (e.g., "boat-trip-lisbon") 
- `industry` - Industry category (e.g., "boats", "real-estate")
- `channel` - Traffic source (e.g., "tiktok", "instagram")
- `dest` - Final destination URL (URL-encoded)

**Optional Parameters:**
- `campaign` - Campaign name (e.g., "summer-2024")

### Example Tracking Links

```bash
# Boat tour from TikTok
/api/r?client=superboats&service=sunset-cruise&industry=boats&channel=tiktok&dest=https%3A%2F%2Fexample.com

# Real estate from Instagram  
/api/r?client=remax&service=luxury-villa&industry=real-estate&channel=instagram&campaign=summer2024&dest=https%3A%2F%2Fremax.com

# Car rental from email
/api/r?client=luxurycars&service=ferrari-rental&industry=automotive&channel=email&dest=https%3A%2F%2Fluxurycars.com
```

## 📊 Analytics & Admin Panel

Visit `/admin` to view:
- **Total clicks** in date range
- **Top clients** by click volume  
- **Top channels** by performance
- **Individual click records** with full metadata
- **Date range filtering** for custom periods

**Default Login:**
- Username: `harold` (configurable via `ADMIN_USER`)
- Password: Set via `ADMIN_PASS` environment variable

## 🔒 Security Features

- **IP Privacy**: Raw IP addresses are never stored - only SHA-256 hashes
- **Basic Auth**: Admin panel protected with HTTP Basic Authentication
- **Input Validation**: All parameters validated with Zod schemas
- **Edge Runtime**: Fast, secure serverless functions
- **No Client Secrets**: Database credentials never exposed to browser

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
2. **Connect to Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy!**

### Environment Variables for Production

Set these in your Vercel dashboard:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  
IP_HASH_SALT=your_random_salt_string
ADMIN_USER=harold
ADMIN_PASS=your_secure_password
```

## 🏃‍♂️ API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/r` - Main redirect endpoint (tracks clicks)
- `GET /api/postback` - Conversion tracking stub (future feature)
- `GET /admin` - Analytics dashboard (Basic Auth required)
- `GET /builder` - Link builder tool

## 📈 Future Enhancements

- **Conversion tracking** via `/api/postback` endpoint
- **Geolocation** from IP addresses  
- **Custom domains** for branded short links
- **Webhook notifications** for real-time alerts
- **A/B testing** capabilities
- **Bulk link generation** API

## 🐛 Troubleshooting

**"Missing required parameters" error:**
- Ensure all required fields are provided: client, service, industry, channel, dest

**"Database connection failed":**
- Check your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Verify your Supabase project is active

**"Authentication required" on /admin:**
- Check your `ADMIN_USER` and `ADMIN_PASS` environment variables

**Redirects not working:**
- Ensure `dest` parameter is properly URL-encoded
- Check that destination URL includes http:// or https://

## 📄 License

Private project for Harold's affiliate tracking needs.

---

**Built with ❤️ for fast, privacy-focused affiliate link tracking.**