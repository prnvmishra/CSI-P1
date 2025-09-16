# Portfolio Analyzer

A Next.js application with Firebase integration for portfolio analysis and theming.

## Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm or yarn
- Firebase project
- Google reCAPTCHA v3 site key
- Google Gemini API key (for portfolio analysis)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Gemini API
GEMINI_API_KEY=your-gemini-api-key
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push your code to a Git repository
2. Import the repository into Vercel
3. Add all the environment variables from `.env.local` to Vercel's environment variables
4. Deploy!

## Features

- Authentication with Firebase
- Theme customization
- Portfolio analysis using Gemini AI
- Analytics dashboard
- Achievement system
