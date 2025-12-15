# 🎵 TripTunes AI - Road Trip Music Generator

Transform your road trip memories into personalized AI-generated songs. Document your journey, capture the moments, and let AI create a unique soundtrack for every stop along the way.

![TripTunes AI](https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop)

## ✨ Features

### 🎸 AI-Powered Music Generation
- **ElevenLabs Integration**: Generate unique, high-quality songs based on your travel stories
- **Multiple Genres**: Rock, Pop, Country, Electronic, Folk, Hip-Hop, Jazz, Indie, and custom styles
- **Personalized Lyrics**: Songs incorporate your actual experiences, people, and emotions

### 🎨 Visual Experience
- **AI Artwork Generation**: Each song gets unique album artwork via Google Gemini or beautiful placeholders
- **Beautiful UI**: Smooth animations, gradient effects, and polished design
- **Dark Theme**: Easy on the eyes during those late-night road trips

### 🎧 Advanced Audio Features
- **Full-Featured Player**: Play, pause, skip, shuffle, repeat modes
- **Queue Management**: Organize your road trip playlist
- **Download Songs**: Save your generated tracks for offline listening
- **Volume Control**: Fine-tune your listening experience

### 🚗 Trip Management
- **Trip Albums**: Organize songs by journey
- **Stop Documentation**: Capture stories, people, and memories at each location
- **Trip Sharing**: Share your musical journey with friends and family

### 💳 Credits System
- **Pay-Per-Song**: Purchase credits to generate songs
- **Stripe Integration**: Secure payment processing
- **Credit Management**: Track your balance and usage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- ElevenLabs API key
- Google Gemini API key (optional, for AI artwork)
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/road-tune-ai.git
cd road-tune-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ElevenLabs (required for music generation)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Google Gemini (optional, for AI artwork)
GEMINI_API_KEY=your_gemini_api_key

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

5. Run database migrations:
```bash
npx supabase db push
```

6. Start the development server:
```bash
npm run dev
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **AI Services**: ElevenLabs (music), Google Gemini (artwork)
- **Payments**: Stripe
- **Deployment**: Vercel/Netlify compatible

### Project Structure
```
road-tune-ai/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Audio, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Route pages
│   ├── styles/         # CSS and animations
│   └── utils/          # Helper functions
├── supabase/
│   ├── functions/      # Edge Functions for AI integration
│   └── migrations/     # Database schema
└── public/            # Static assets
```

## 📱 Features in Detail

### Song Generation Flow
1. **Create/Select Trip**: Start a new journey or continue an existing one
2. **Add Stop**: Document where you are and what happened
3. **Customize**: Choose genre, mood, and add personal details
4. **Generate**: AI creates a unique song based on your input
5. **Listen & Share**: Play your song, download it, or share with friends

### Credit System
- Songs cost 1 credit each to generate
- Regenerate songs for 1 credit
- Purchase credits in bundles through Stripe
- Credits never expire

### Sharing Features
- Public links for individual songs
- Share entire trip albums
- No login required for viewers

## 🔒 Security

- API keys stored securely in environment variables
- Row-level security on all database tables
- Secure payment processing via Stripe
- No storage of sensitive user data

## 🚧 Roadmap

- [ ] Mobile app (React Native)
- [ ] Collaborative trips (multiple users)
- [ ] Social features (like, comment, follow)
- [ ] Spotify/Apple Music integration
- [ ] Voice narration for stories
- [ ] Video montage generation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- ElevenLabs for amazing AI music generation
- Google Gemini for AI capabilities
- Supabase for the backend infrastructure
- The open-source community for incredible tools and libraries

---

Built with ❤️ for road trippers and music lovers everywhere.