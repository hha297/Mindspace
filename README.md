<div align="center">

<img src="./public/logo.png" alt="Mindspace Logo" width="40" height="40">

# Mindspace

</div>

## 📋 Table of Contents

- [📖 About MindSpace](#-about-mindspace)
- [🚀 Key Features](#-key-features)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Getting Started](#-getting-started)
- [📦 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📖 About MindSpace

**MindSpace** is a comprehensive mental health platform specifically designed for students and young adults. We understand the unique pressures and challenges that come with academic life, and we're here to provide the support you need to thrive both mentally and academically.

### 🎯 **Our Mission**

We believe that mental health support should be accessible, personalized, and stigma-free. MindSpace empowers students to take control of their mental well-being through a combination of self-help tools, professional resources, and AI-powered support.

### 🌟 **What Makes Us Different**

- **Student-Focused**: Designed specifically for the unique challenges faced by students and young adults
- **Evidence-Based**: All tools and resources are grounded in proven mental health practices
- **Privacy-First**: Your mental health data is encrypted and completely private
- **AI-Powered**: Intelligent support system that adapts to your needs
- **Community-Driven**: Connect with peers who understand your journey

---

## 🚀 Key Features

### 📊 **Mood Tracking & Analytics**

- Daily mood logging with detailed emotion tracking
- Visual analytics to identify patterns and trends
- Personalized insights based on your data
- Progress tracking with achievement system

### 🛠️ **Self-Help Tools**

- **Breathing Exercises**: Guided meditation and relaxation techniques
- **Journaling Tool**: Structured prompts for reflection and self-discovery
- **Self-Assessment Quizzes**: Mental health screening tools
- **Motivational Quotes**: Daily inspiration and encouragement

### 🤖 **AI Chat Support**

- 24/7 compassionate AI assistant trained specifically for student mental health
- Crisis intervention and safety protocols
- Personalized coping strategies and techniques
- Professional resource recommendations

### 📚 **Educational Resources**

- Curated articles on mental health topics
- Video content from mental health professionals
- Interactive exercises and worksheets
- Crisis resources and emergency contacts

### 👥 **Community Features**

- Safe, moderated peer support groups
- Anonymous sharing options
- Community challenges and activities
- Professional moderation and guidance

### 🔒 **Privacy & Security**

- End-to-end encryption for all personal data
- HIPAA-compliant data handling
- Complete user control over data sharing
- Anonymous usage options available

---

### 🌟 Key Highlights

- **🔒 Security First** — Environment variables for sensitive credentials
- **⚡ Performance Optimized** — SSR/SSG with Next.js 15.5 + Turbopack
- **🎨 Modern UI** — Tailwind CSS + Shadcn/ui components
- **📱 Mobile Ready** — Responsive design with React 19.1
- **🛡️ Type Safety** — Full TypeScript implementation
- **🤖 AI-Powered** — OpenAI GPT-3.5 for intelligent chat support
- **🖼️ Media Management** — Cloudinary for image hosting & optimization
- **♿ Accessibility** — Shadcn/ui components with built-in accessibility
- **📝 Form Management** — React Hook Form with Zod validation

---

## 🛠 Tech Stack

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth-green?style=for-the-badge&logo=auth0&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/ui](https://img.shields.io/badge/Shadcn/ui-black?style=for-the-badge&logo=react&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-pink?style=for-the-badge&logo=react&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-orange?style=for-the-badge&logo=lucide&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-blue?style=for-the-badge&logo=cloudinary&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-green?style=for-the-badge&logo=openai&logoColor=white)
![Shield.io](https://img.shields.io/badge/Shield.io-red?style=for-the-badge&logo=shield&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-purple?style=for-the-badge&logo=eslint&logoColor=white)

</div>

---

## 🏗️ System Architecture

```
mindspace/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── admin/                     # Admin Dashboard
│   │   │   ├── journaling/            # Admin journaling management
│   │   │   ├── quizzes/               # Admin quiz management
│   │   │   ├── resources/             # Admin resource management
│   │   │   ├── settings/              # Admin settings
│   │   │   ├── users/                 # User management
│   │   │   ├── layout.tsx             # Admin layout
│   │   │   └── page.tsx               # Admin dashboard
│   │   ├── api/                       # API Routes
│   │   │   ├── admin/                 # Admin API endpoints
│   │   │   ├── auth/                  # Authentication
│   │   │   ├── chat/                  # AI Chat system
│   │   │   ├── journal/               # Journal CRUD
│   │   │   ├── mood/                  # Mood tracking CRUD
│   │   │   ├── resources/             # Resource management
│   │   │   ├── stress-assessment/     # Stress assessment API
│   │   │   ├── upload/                # File upload
│   │   │   └── user/                  # User management
│   │   ├── chat/                      # Chat page
│   │   ├── dashboard/                 # User dashboard
│   │   ├── profile/                   # User profile
│   │   ├── resources/                 # Resources page
│   │   ├── sign-in/                   # Sign in page
│   │   ├── sign-up/                   # Sign up page
│   │   ├── tools/                     # Self-help tools
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Home page
│   ├── components/                    # Reusable UI components
│   │   ├── admin/                     # Admin-specific components
│   │   ├── chat/                      # Chat components
│   │   ├── dashboard/                 # Dashboard components
│   │   ├── profile/                   # Profile components
│   │   ├── resources/                 # Resource components
│   │   └── ui/                        # Shadcn/ui components
│   ├── hooks/                         # Custom React hooks
│   │   └── use-mobile.ts              # Mobile detection hook
│   ├── lib/                           # Utility functions
│   │   ├── models/                    # Mongoose schemas
│   │   ├── stress-quiz-data.ts        # Stress quiz data
│   │   ├── db.ts                      # MongoDB connection
│   │   └── utils.ts                   # Helper functions
│   └── types/                         # TypeScript type definitions
│       └── next-auth.d.ts             # NextAuth type extensions
├── public/                            # Static assets
├── middleware.ts                      # Route protection
└── package.json                       # Dependencies
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# External Services
CLOUDINARY_URL=your_cloudinary_url
OPENAI_API_KEY=your_openai_api_key
```

> ⚠️ **Important**: Never commit your `.env.local` file to version control!

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- MongoDB Atlas account (or local MongoDB)
- GitHub OAuth app
- Google OAuth app
- Cloudinary account (for image hosting)
- OpenAI API key (for AI chat features)
- TypeScript knowledge (recommended)
- Basic understanding of React and Next.js

### Installation

1. **Clone the repository**

      ```bash
      git clone https://github.com/mindspace-tech/Mindspace.git
      cd Mindspace
      ```

2. **Install dependencies**

      ```bash
      npm install
      # or
      yarn install
      ```

3. **Configure environment variables**

      - Copy `.env.example` to `.env.local`
      - Fill in all required environment variables

4. **Run the development server**

      ```bash
      npm run dev
      # or
      yarn dev
      ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

      ```bash
      git add .
      git commit -m "Initial commit"
      git push origin main
      ```

2. **Connect to Vercel**

      - Visit [Vercel Dashboard](https://vercel.com/dashboard)
      - Import your GitHub repository
      - Configure build settings (auto-detected for Next.js)

3. **Add Environment Variables**

      - Go to Project Settings → Environment Variables
      - Add all variables from your `.env.local` file

4. **Deploy**
      - Vercel will automatically deploy on every push to main branch
      - Your app will be available at `https://your-project.vercel.app`

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### 🚀 Quick Start

1. **Fork the repository**

      ```bash
      # Click the Fork button on GitHub
      ```

2. **Create a feature branch**

      ```bash
      git checkout -b feature/amazing-feature
      ```

3. **Make your changes**

      - Write clean, documented code
      - Follow existing code style
      - Add tests if applicable

4. **Commit your changes**

      ```bash
      git commit -m "Add amazing feature"
      ```

5. **Push to your branch**

      ```bash
      git push origin feature/amazing-feature
      ```

6. **Open a Pull Request**
      - Describe your changes clearly
      - Reference any related issues
      - Wait for review and feedback

### 📋 Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add documentation for new features
- Test your changes thoroughly
- Update README if needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by the Mindspace Team**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/mindspace-tech/Mindspace)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://mindspace-three.vercel.app/)

</div>
