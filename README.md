
<div align="center">

# 🛡️ AUTHENEX
### Reality Recoded | AI-Powered Deepfake Detection & Content Authentication

[![Node.js](https://img.shields.io/badge/Node.js-18.0%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-13.6.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**🏆 National Level Hackathon Project**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution Overview](#-solution-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation & Setup](#-installation--setup)
- [API Keys & Environment Variables](#-api-keys--environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Workflows & Processes](#-workflows--processes)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Problem Statement

In the digital age, the proliferation of deepfakes, AI-generated content, and digital fraud poses severe threats to:
- **Individual Privacy**: Unauthorized use of personal images/videos
- **Digital Trust**: Erosion of confidence in online media authenticity
- **Legal Rights**: Lack of content ownership verification systems
- **Financial Security**: AI-powered scams and digital arrests

**Statistics & Impact:**
- 95% increase in deepfake scams in India (2024-2025)
- ₹5000+ Crore lost to digital arrest scams annually
- Exponential growth in AI-generated fraudulent content

---

## 💡 Solution Overview

**AUTHENEX** is a comprehensive AI-powered platform that combats digital fraud through:

1. **Multi-Modal Deepfake Detection**: Analyzes images, videos, audio, and documents using advanced AI models
2. **Content Protection System**: Blockchain-inspired fingerprinting to register and protect original content
3. **Real-time Fraud Intelligence**: Live news feed of latest deepfake scams and digital fraud cases
4. **Forensic Analysis**: Detailed artifact detection and manipulation identification
5. **Legal Documentation**: Automated report generation for legal proceedings

---

## ✨ Features

### 🔍 **AI-Powered Detection Engine**

#### Multi-Modal Analysis
- **Image Detection**: SHA-256 hashing, perceptual hashing (pHash), AI pattern recognition
- **Video Analysis**: Frame-by-frame deepfake detection with temporal consistency checks
- **Audio Forensics**: Voice cloning and audio manipulation detection
- **Document Verification**: PDF and text document authenticity validation

#### Detection Capabilities
- ✅ Face swap detection
- ✅ Voice synthesis identification
- ✅ GAN-generated content recognition
- ✅ AI artifact detection (lighting inconsistencies, blur patterns, pixel anomalies)
- ✅ Metadata analysis and EXIF data verification
- ✅ Temporal coherence analysis for videos

### 🛡️ **Authenex Protect** - Content Protection System

#### Registration & Fingerprinting
```
Upload Content → Generate Fingerprints (SHA-256, pHash, Embedding) 
→ Blockchain-Style Registration → Issue Case ID → Timestamp & User Verification
```

**Features:**
- **Multi-Layer Fingerprinting**:
  - SHA-256: Exact duplicate detection
  - Perceptual Hash (pHash): Visual similarity matching (5-bit threshold)
  - AI Embeddings: Semantic content understanding via Google Gemini

- **Ownership Verification**:
  - Legal declaration with IP address logging
  - Timestamp-based proof of ownership
  - Terms of Service agreement enforcement

- **Duplicate Prevention**:
  - Real-time check against protected content database
  - Automatic flagging of suspicious registrations
  - Manual review system for edge cases

#### Verification System
```
Submit Suspicious Content → Fingerprint Generation → Database Comparison 
→ Exact Match (SHA-256) OR Visual Match (pHash ≤5) → Alert Owner + Evidence Report
```

**Capabilities:**
- Exact duplicate detection (100% match)
- Near-duplicate detection (visual similarity)
- Infringement notification system
- Evidence package generation for legal action

#### Dispute Resolution
- Case-by-case review system
- Evidence submission portal
- Admin dashboard for conflict resolution
- Legal compliance tracking

### 📊 **Dashboard & Analytics**

#### User Dashboard
- **Live Statistics**: Total scans, real vs fake ratio, suspicious content count
- **Neural Marker Flux Chart**: Real-time visualization with 3D tilt effects
- **Analysis History Vault**: Searchable archive with thumbnails
- **Credit Management**: Credit purchase system with admin approval workflow

#### Admin Panel
```
Admin Dashboard Features:
├── User Management
│   ├── View all registered users
│   ├── Credit allocation & approval
│   └── Account status management
├── Analytics
│   ├── Platform usage statistics
│   ├── Detection accuracy metrics
│   └── Content protection insights
├── Alert Management
│   ├── Real-time fraud alerts
│   ├── Bot detection logs
│   └── Suspicious activity monitoring
└── Credit Request System
    ├── View pending requests
    ├── Approve/Reject requests
    └── Transaction logging
```

### 📰 **AI News Intelligence Feed**

**Real-time News Aggregation:**
- Integration with NewsData.io API
- Curated feed of deepfake scams, digital arrests, AI fraud cases
- Geographic filtering (India/Global)
- Source verification with live URL validation
- Auto-refresh every 24 hours

**Categories Tracked:**
- Deepfake incidents
- Digital arrest scams
- AI-powered fraud cases
- Cybersecurity threats
- Legal actions and regulations

### 🤖 **AI Chatbot Assistant**

**Powered by OpenAI GPT-4 with Gemini Fallback**

Features:
- Interactive fraud detection consultation
- Voice synthesis (Text-to-Speech via OpenAI TTS)
- Multi-language support (English, Hindi, Spanish, French, German, Japanese, Chinese)
- Real-time assistance for deepfake analysis
- Educational content about digital security

### 📄 **Legal & Compliance**

- **Forensic Methodology Documentation**: Detailed explanation of detection algorithms
- **Privacy Policy**: GDPR-compliant data handling
- **Terms of Service**: User rights and platform rules
- **White Paper**: Technical deep-dive into detection mechanisms
- **PDF Report Generation**: Court-ready evidence packages with timestamps

---

## 🛠 Tech Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black) | 19.2.4 | UI Framework |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white) | 5.8.2 | Type Safety |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white) | 6.2.0 | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white) | 3.x | Styling |
| ![Framer Motion](https://img.shields.io/badge/-Framer_Motion-0055FF?logo=framer&logoColor=white) | 12.34.0 | Animations |
| ![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=black) | 12.9.0 | Authentication |
| ![Google AI](https://img.shields.io/badge/-Google_GenAI-4285F4?logo=google&logoColor=white) | 1.38.0 | Client-side AI |

**Key Libraries:**
- `jspdf` + `jspdf-autotable`: PDF report generation
- `vite-plugin-pwa`: Progressive Web App support

### **Backend**

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white) | 18.0+ | Runtime |
| ![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white) | 5.2.1 | Web Framework |
| ![Firebase Admin](https://img.shields.io/badge/-Firebase_Admin-FFCA28?logo=firebase&logoColor=black) | 13.6.1 | Database & Auth |
| ![Google Gemini](https://img.shields.io/badge/-Gemini_AI-4285F4?logo=google&logoColor=white) | 0.24.1 | AI Analysis |
| ![OpenAI](https://img.shields.io/badge/-OpenAI-412991?logo=openai&logoColor=white) | 6.18.0 | Chat & TTS |

**Key Dependencies:**
- `sharp`: Image processing and fingerprinting
- `blockhash-core`: Perceptual hashing
- `uuid`: Unique identifier generation
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management

### **AI Models & APIs**

```
Detection Pipeline:
├── Google Gemini 2.5 Flash (Primary)
│   └── Fallback: Gemini 2.5 Pro
│       └── Fallback: Gemini 2.0 Flash
├── OpenAI GPT-4o-mini (Chatbot)
│   └── Fallback: Gemini 2.0 Flash
└── NewsData.io API (News Feed)
```

### **Database & Storage**

- **Firestore**: User data, analysis history, protected content registry
- **Firebase Authentication**: Google OAuth, Email/Password
- **Collections Structure**:
  ```
  ├── users/
  ├── analyses/
  ├── protected_content/
  ├── alerts/
  ├── credit_requests/
  └── duplicate_attempt_logs/
  ```

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React + TypeScript (Vite)                               │  │
│  │  ┌─────────────┬─────────────┬──────────────────────┐   │  │
│  │  │  Landing    │  Dashboard  │  Protect System      │   │  │
│  │  │  Page       │  + Lab      │  + Verification      │   │  │
│  │  └─────────────┴─────────────┴──────────────────────┘   │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │  Authentication (Firebase Client SDK)             │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────────┘
                        │ HTTPS/REST
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER (Node.js)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express Server (Port 3001)                              │  │
│  │  ┌────────────┬────────────┬─────────────┬────────────┐ │  │
│  │  │ Auth       │ Deepfake   │ Protect     │ Admin      │ │  │
│  │  │ Middleware │ Detection  │ Registry    │ Routes     │ │  │
│  │  └────────────┴────────────┴─────────────┴────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Fingerprint Service                                     │  │
│  │  ├── SHA-256 Hasher                                      │  │
│  │  ├── Perceptual Hash (pHash)                             │  │
│  │  └── AI Embedding Generator                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────┬────────────────────┬────────────────────┬──────────────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│   Firebase   │   │  Google Gemini   │   │   OpenAI API        │
│   Firestore  │   │  AI Platform     │   │   (GPT-4 + TTS)     │
│              │   │  - 2.5 Flash     │   │                     │
│   - Users    │   │  - 2.5 Pro       │   │  NewsData.io API    │
│   - History  │   │  - 2.0 Flash     │   │  (News Feed)        │
│   - Content  │   │  - File Manager  │   │                     │
└──────────────┘   └──────────────────┘   └─────────────────────┘
```

### **Detection Workflow**

```
User Uploads Media
        ↓
[Frontend Validation]
        ↓
Convert to Base64 + Metadata
        ↓
POST /api/gemini/generate
        ↓
[Backend Processing]
├── Large File? → Upload to Gemini File Manager
├── Generate Forensic Prompt
└── Cascade Model Selection
        ↓
[Gemini AI Analysis]
├── Face/Body Detection
├── Lighting Analysis
├── Pixel Artifact Detection
├── Temporal Consistency (Video)
└── Audio Frequency Analysis
        ↓
[Response Generation]
├── Verdict: REAL / DEEPFAKE / SUSPICIOUS
├── Confidence Score (0-100%)
├── AI Percentage / Human Percentage
├── Detailed Findings Array
└── Forensic Summary
        ↓
[Save to Firestore + Deduct Credits]
        ↓
Display Results to User
```

### **Content Protection Workflow**

```
User Uploads Original Content
        ↓
[Frontend: Ownership Declaration]
        ↓
POST /api/protect/register
        ↓
[Backend Fingerprint Generation]
├── SHA-256: Cryptographic Hash
├── pHash: 64-bit Perceptual Hash
└── Embedding: 768-dim AI Vector (Gemini)
        ↓
[Duplicate Check - Layer 1: SHA-256]
├── Exact Match Found? → Block Registration
└── No Match → Continue
        ↓
[Similarity Check - Layer 2: pHash]
├── Hamming Distance ≤ 5? → Flag for Review
└── No Match → Auto-Approve
        ↓
[Store in Firestore]
├── Case ID: UUID
├── Timestamp: ISO 8601
├── Fingerprints: SHA-256, pHash, Embedding
├── Ownership Declaration: IP, TOS Agreement
└── Status: 'active' or 'pending_review'
        ↓
Return Case ID to User
```

### **Verification Workflow**

```
User Suspects Content Misuse
        ↓
Uploads Suspicious Content
        ↓
POST /api/protect/verify
        ↓
[Generate Fingerprints of Suspicious Content]
        ↓
[Database Scan]
├── Exact Match (SHA-256)? → 100% Infringement
├── Visual Match (pHash Distance ≤ 5)? → Likely Infringement
└── No Match → Original or Unregistered
        ↓
[If Match Found]
├── Retrieve Original Owner Details
├── Generate Evidence Report
│   ├── Original Registration Timestamp
│   ├── Case ID
│   ├── Fingerprint Comparison
│   └── Legal Notice
└── Notify Content Owner
        ↓
Display Verification Result
```

---

## 📦 Installation & Setup

### **Prerequisites**

Ensure you have the following installed:
- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **Git**: For cloning the repository

**Verify Installation:**
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 8.0.0
```

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/juned/authenex1.git
cd authenex1
```

### **Step 2: Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Dependencies installed:
# - express (5.2.1)
# - cors (2.8.6)
# - dotenv (17.2.4)
# - firebase-admin (13.6.1)
# - @google/generative-ai (0.24.1)
# - openai (6.18.0)
# - sharp (0.34.5)
# - blockhash-core (0.1.0)
# - uuid (9.0.1)
# - node-fetch (3.3.2)
```

### **Step 3: Frontend Setup**

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Dependencies installed:
# - react (19.2.4)
# - react-dom (19.2.4)
# - typescript (5.8.2)
# - vite (6.2.0)
# - @vitejs/plugin-react (5.0.0)
# - firebase (12.9.0)
# - @google/genai (1.38.0)
# - framer-motion (12.34.0)
# - jspdf (4.1.0)
# - jspdf-autotable (5.0.7)
# - vite-plugin-pwa (1.2.0)
```

---

## 🔑 API Keys & Environment Variables

### **Required API Keys**

You need to obtain the following API keys:

| Service | Purpose | How to Obtain |
|---------|---------|---------------|
| **Google Gemini API** | Deepfake detection & AI analysis | [Get API Key](https://makersuite.google.com/app/apikey) |
| **OpenAI API** | Chatbot (GPT-4) & Text-to-Speech | [Get API Key](https://platform.openai.com/api-keys) |
| **Firebase** | Authentication & Database | [Create Project](https://console.firebase.google.com/) |
| **NewsData.io API** | Real-time news feed | [Get API Key](https://newsdata.io/register) |

---

### **Backend Environment Configuration**

Create a `.env` file in the `backend/` directory:

```bash
# Navigate to backend directory
cd backend

# Create .env file
touch .env  # On Windows: type nul > .env
```

**Paste the following content into `backend/.env`:**

```env
# ==============================================
# SERVER CONFIGURATION
# ==============================================
PORT=3001
NODE_ENV=development

# ==============================================
# API KEYS
# ==============================================

# Google Gemini AI API Key
# Get from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API Key (for ChatBot & TTS)
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# NewsData.io API Key (for News Feed)
# Get from: https://newsdata.io/register
NEWSDATA_API_KEY=your_newsdata_api_key_here

# ==============================================
# FIREBASE CONFIGURATION
# ==============================================

# Firebase Service Account JSON
# Instructions:
# 1. Go to Firebase Console: https://console.firebase.google.com/
# 2. Select your project
# 3. Go to Project Settings > Service Accounts
# 4. Click "Generate New Private Key"
# 5. Copy the entire JSON content
# 6. Stringify it (remove all newlines) and paste below
# Format: {"type":"service_account","project_id":"...","private_key_id":"...",...}
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}

# Firebase Client Configuration
# Get from: Firebase Console > Project Settings > General > Your Apps
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

### **Firebase Setup (Detailed)**

#### **Step 1: Create Firebase Project**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add Project"**
3. Enter project name (e.g., `authenex-project`)
4. Enable Google Analytics (optional)
5. Click **"Create Project"**

#### **Step 2: Enable Authentication**

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get Started"**
3. Enable **Sign-in methods**:
   - ✅ Email/Password
   - ✅ Google
4. Save changes

#### **Step 3: Create Firestore Database**

1. Go to **Build > Firestore Database**
2. Click **"Create Database"**
3. Select **"Start in Production Mode"**
4. Choose a location (e.g., `us-central1`)
5. Click **"Enable"**

#### **Step 4: Get Firebase Client Configuration**

1. Go to **Project Settings** (⚙️ icon)
2. Scroll to **"Your apps"** section
3. Click **"Web"** icon (`</>`)
4. Register your app with a nickname (e.g., `authenex-web`)
5. Copy the `firebaseConfig` object values
6. Paste into `backend/.env` as shown above

#### **Step 5: Generate Service Account Key**

1. In Firebase Console, go to **Project Settings > Service Accounts**
2. Click **"Generate New Private Key"**
3. Click **"Generate Key"** (a JSON file will download)
4. Open the JSON file
5. **Stringify the JSON** (remove newlines):
   ```bash
   # On Linux/Mac:
   cat serviceAccountKey.json | jq -c .
   
   # Or use online tool: https://www.text-utils.com/json-formatter/
   ```
6. Paste the stringified JSON into `FIREBASE_SERVICE_ACCOUNT` in `.env`

---

### **Frontend Environment Configuration**

The frontend fetches Firebase config from the backend via `/api/firebase-config`, so **no `.env` file is required** for the frontend. 

However, if you want to override this behavior, create `frontend/.env.local`:

```env
# Optional: Frontend-specific overrides (not required)
# The app fetches these from backend by default
```

---

### **Firestore Security Rules (Important!)**

In Firebase Console > Firestore Database > Rules, update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Analyses collection
    match /analyses/{analysisId} {
      allow read, write: if request.auth != null;
    }
    
    // Protected content
    match /protected_content/{caseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Admin-only collections
    match /alerts/{alertId} {
      allow read: if request.auth != null;
    }
    
    match /credit_requests/{requestId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🚀 Running the Application

### **Development Mode (Local)**

You need to run both frontend and backend simultaneously.

#### **Terminal 1: Start Backend Server**

```bash
# From project root
cd backend

# Start server
npm start

# Expected Output:
# Backend Server running on http://localhost:3001
# --- SERVER RELOADED WITH MEMORY SORT FIX ---
```

**Backend will be available at:** `http://localhost:3001`

---

#### **Terminal 2: Start Frontend Development Server**

```bash
# From project root (open new terminal)
cd frontend

# Start dev server
npm run dev

# Expected Output:
# VITE v6.2.0  ready in XXX ms
# ➜  Local:   http://localhost:5173/
# ➜  Network: use --host to expose
```

**Frontend will be available at:** `http://localhost:5173`

---

### **Access the Application**

1. Open your browser
2. Navigate to: **http://localhost:5173**
3. You should see the Authenex landing page
4. Click **"Enter"** to access the application

---

### **Production Build**

#### **Build Frontend**

```bash
cd frontend
npm run build

# Output: dist/ folder with optimized production files
```

#### **Serve Production Build**

```bash
# Option 1: Preview with Vite
npm run preview

# Option 2: Deploy to hosting service
# The backend serves the frontend from backend/public/ or ../frontend/dist
```

#### **Deploy to Google Cloud (Optional)**

```bash
# Ensure backend serves frontend
cd backend

# Deploy to App Engine
gcloud app deploy app.yaml

# Script available: deploy_google.ps1 (PowerShell)
```

---

### **Complete Startup Commands Summary**

```bash
# 1. Clone and Setup
git clone https://github.com/juned/authenex1.git
cd authenex1

# 2. Install Backend Dependencies
cd backend
npm install

# 3. Configure Backend .env (see API Keys section above)
# Create backend/.env and add all API keys

# 4. Install Frontend Dependencies
cd ../frontend
npm install

# 5. Start Backend (Terminal 1)
cd ../backend
npm start

# 6. Start Frontend (Terminal 2)
cd ../frontend
npm run dev

# 7. Open Browser
# Visit: http://localhost:5173
```

---

## 📁 Project Structure

```
authenex-antigravity/
│
├── backend/                      # Node.js Express Backend
│   ├── server_new.js            # Main server file (Entry Point)
│   ├── firebase.js              # Firebase Admin SDK initialization
│   ├── package.json             # Backend dependencies
│   ├── .env                     # Environment variables (API keys)
│   ├── serviceAccountKey.json   # Firebase service account (DO NOT COMMIT)
│   │
│   ├── utils/
│   │   └── fingerprint.js       # SHA-256, pHash, Embedding generation
│   │
│   ├── public/                  # Static frontend files (production)
│   │   └── (frontend build output)
│   │
│   └── test files/              # Debug & test scripts
│       ├── test-firebase-init.js
│       ├── test-news.js
│       ├── test_protect_logic.js
│       └── ...
│
├── frontend/                    # React + TypeScript Frontend
│   ├── index.html               # HTML entry point
│   ├── index.tsx                # React entry point
│   ├── App.tsx                  # Main application component
│   ├── index.css                # Global styles
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── tsconfig.json            # TypeScript configuration
│   │
│   ├── components/              # Reusable UI components
│   │   ├── LandingPage.tsx      # Landing page
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── BottomNav.tsx        # Bottom navigation bar
│   │   ├── DashboardStats.tsx   # Statistics dashboard
│   │   ├── ResultDisplay.tsx    # Detection results UI
│   │   ├── NewsFeed.tsx         # AI news feed
│   │   ├── ChatBot.tsx          # AI assistant
│   │   ├── ForensicMethodology.tsx
│   │   ├── CreditPurchase.tsx
│   │   ├── SplashScreen.tsx
│   │   ├── Testimonials.tsx
│   │   └── TiltCard.tsx         # 3D tilt effect component
│   │
│   ├── pages/                   # Main application pages
│   │   ├── Auth.tsx             # Login/Register page
│   │   ├── Profile.tsx          # User profile
│   │   ├── AdminDashboard.tsx   # Admin panel
│   │   ├── Notifications.tsx    # Notifications center
│   │   ├── ProtectLanding.tsx   # Protect system landing
│   │   ├── ProtectRegister.tsx  # Content registration
│   │   ├── MyProtectedContent.tsx # User's protected items
│   │   ├── VerifySuspicious.tsx # Content verification
│   │   ├── ProtectDisputes.tsx  # Dispute management
│   │   ├── PrivacyPolicy.tsx    # Privacy policy
│   │   ├── TermsOfService.tsx   # Terms of service
│   │   └── WhitePaper.tsx       # Technical white paper
│   │
│   ├── services/                # API & Service layer
│   │   ├── firebase.ts          # Firebase client SDK
│   │   ├── gemini.ts            # Gemini AI integration
│   │   ├── db.ts                # Database operations
│   │   └── api.ts               # Backend API calls
│   │
│   ├── utils/
│   │   └── reportGenerator.ts   # PDF report generation
│   │
│   ├── types.ts                 # TypeScript type definitions
│   ├── translations.ts          # Multi-language support
│   │
│   └── dist/                    # Production build output
│
├── .git/                        # Git repository
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── deploy_google.ps1            # Google Cloud deployment script
```

---

## 🔌 API Documentation

### **Base URLs**
- **Development**: `http://localhost:3001`
- **Production**: `https://your-app-engine-url.com`

---

### **Authentication Endpoints**

#### **Get Firebase Configuration**
```http
GET /api/firebase-config
```
**Response:**
```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "...",
  "measurementId": "..."
}
```

---

### **User Management**

#### **Create/Update User**
```http
POST /api/user
Authorization: Bearer {idToken}
```
**Body:**
```json
{
  "id": "user_uid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "plan": "Pro",
  "credits": 1000,
  "totalCredits": 1000,
  "riskScore": 0,
  "createdAt": "2026-02-13T10:00:00.000Z"
}
```

#### **Get User**
```http
GET /api/user/{userId}
Authorization: Bearer {idToken}
```

#### **Update Credits**
```http
POST /api/user/{userId}/credits
Authorization: Bearer {idToken}
```
**Body:**
```json
{
  "credits": 500
}
```

---

### **Deepfake Detection**

#### **Analyze Media**
```http
POST /api/gemini/generate
Content-Type: application/json
```
**Body:**
```json
{
  "model": "gemini-2.5-flash",
  "contents": [
    {
      "role": "user",
      "parts": [
        {
          "inlineData": {
            "mimeType": "image/jpeg",
            "data": "base64_encoded_image_data"
          }
        },
        {
          "text": "Analyze this image for deepfake artifacts..."
        }
      ]
    }
  ],
  "config": {
    "temperature": 0.4,
    "topP": 0.95
  }
}
```

**Response:**
```json
{
  "text": "{\"aiPercentage\":85,\"humanPercentage\":15,\"confidence\":92,\"verdict\":\"DEEPFAKE\",\"summary\":\"High probability of AI generation...\",\"findings\":[...]}",
  "candidates": [...]
}
```

---

### **Analysis History**

#### **Save Analysis**
```http
POST /api/analysis
Authorization: Bearer {idToken}
```
**Body:**
```json
{
  "userId": "user_uid",
  "result": { /* Detection result object */ },
  "fileBase64": "compressed_thumbnail_base64",
  "mimeType": "image/jpeg"
}
```

#### **Get User History**
```http
GET /api/history/{userId}
Authorization: Bearer {idToken}
```

#### **Clear History**
```http
DELETE /api/analysis/{userId}
Authorization: Bearer {idToken}
```

---

### **Content Protection**

#### **Register Content**
```http
POST /api/protect/register
Authorization: Bearer {idToken}
```
**Body:**
```json
{
  "fileBase64": "base64_image_data",
  "mimeType": "image/jpeg",
  "metadata": {
    "title": "My Artwork",
    "description": "Original digital art",
    "tags": ["art", "digital"]
  },
  "ownershipDeclaration": {
    "agreedToTos": true,
    "confirmedOwnership": true,
    "statement": "I confirm I own this content"
  }
}
```

**Response:**
```json
{
  "success": true,
  "caseId": "uuid-v4-case-id",
  "timestamp": "2026-02-13T10:00:00.000Z",
  "status": "active",
  "message": "Content protected successfully"
}
```

#### **List Protected Content**
```http
GET /api/protect/list/{userId}
Authorization: Bearer {idToken}
```

#### **Verify Suspicious Content**
```http
POST /api/protect/verify
Authorization: Bearer {idToken}
```
**Body:**
```json
{
  "fileBase64": "suspicious_content_base64",
  "mimeType": "image/jpeg"
}
```

**Response:**
```json
{
  "isMatch": true,
  "confidence": 95,
  "matchType": "exact",
  "originalCase": {
    "caseId": "...",
    "timestamp": "...",
    "ownerEmail": "original.owner@example.com"
  },
  "evidence": {
    "sha256Match": true,
    "pHashDistance": 2,
    "visualSimilarity": 98
  }
}
```

---

### **Admin Endpoints**

#### **Get All Users**
```http
GET /api/admin/users
Authorization: Bearer {adminToken}
```

#### **Get Alerts**
```http
GET /api/admin/alerts
Authorization: Bearer {adminToken}
```

#### **Get Credit Requests**
```http
GET /api/admin/credit-requests
Authorization: Bearer {adminToken}
```

#### **Approve Credit Request**
```http
POST /api/admin/credit-requests/{requestId}/approve
Authorization: Bearer {adminToken}
```

#### **Reject Credit Request**
```http
POST /api/admin/credit-requests/{requestId}/reject
Authorization: Bearer {adminToken}
```

---

### **AI Services**

#### **ChatBot (OpenAI/Gemini)**
```http
POST /api/chat
```
**Body:**
```json
{
  "messages": [
    { "role": "system", "content": "You are an AI expert..." },
    { "role": "user", "content": "What is a deepfake?" }
  ],
  "model": "gpt-4o-mini"
}
```

#### **Text-to-Speech**
```http
POST /api/speech
```
**Body:**
```json
{
  "input": "Hello, how can I help you?",
  "voice": "alloy"
}
```
**Response:** Audio stream (audio/mpeg)

#### **News Feed**
```http
GET /api/news
```
**Response:**
```json
[
  {
    "title": "New deepfake scam targets users...",
    "summary": "Authorities warn of new AI-powered fraud...",
    "date": "2026-02-13",
    "location": "India",
    "sourceUrl": "https://...",
    "sourceName": "News Source",
    "imageSearchTerm": "https://..."
  }
]
```

---

## 🔄 Workflows & Processes

### **1. User Registration Flow**

```
User Access Landing Page
        ↓
Click "Enter" → Redirect to Auth Page
        ↓
Choose Registration Method:
├── Email/Password
│   ├── Enter email + password
│   ├── Firebase creates user account
│   └── Email verification sent (optional)
│
└── Google OAuth
    ├── Redirect to Google sign-in
    ├── User grants permissions
    └── Firebase receives OAuth token
        ↓
[Backend] onAuthStateChanged Triggered
        ↓
Check if user exists in Firestore
├── Exists: Load user data (credits, plan, history)
└── New User: Create user document
    ├── Default Plan: Pro
    ├── Initial Credits: 1000
    ├── Risk Score: 0
    └── Save to Firestore /users/{uid}
        ↓
Update Frontend State
├── isLoggedIn = true
├── user = { ...userData }
└── Redirect to Dashboard
```

---

### **2. Deepfake Detection Process**

```
User Navigates to Lab (+ icon)
        ↓
Select Modality: Image / Video / Audio / Document
        ↓
Upload File → File Reader converts to Base64
        ↓
Preview Display + Metadata (name, size)
        ↓
User Clicks "START SCAN"
        ↓
[Frontend Validation]
├── User logged in? (Check user.id)
├── Sufficient credits? (≥10 credits)
└── File staged? (Base64 data exists)
        ↓
initiateAnalysis() Function
        ↓
[Backend] POST /api/gemini/generate
├── Check file size
│   ├── > 15MB → Upload to Gemini File Manager
│   │   ├── Create temp file
│   │   ├── Upload via GoogleAIFileManager
│   │   ├── Wait for processing (if video)
│   │   └── Replace inlineData with fileUri
│   └── ≤ 15MB → Send as inlineData (base64)
│
├── Generate Forensic Prompt
│   ├── Modality-specific instructions
│   ├── Detection checklist (faces, lighting, pixels)
│   └── JSON response structure
│
└── Model Cascade
    ├── Try: gemini-2.5-flash (Primary)
    ├── Fallback: gemini-2.5-pro
    └── Final Fallback: gemini-2.0-flash
        ↓
[Gemini AI Processing]
├── Computer Vision Analysis
│   ├── Face detection & alignment
│   ├── Skin texture analysis
│   ├── Lighting consistency check
│   ├── Shadow pattern analysis
│   └── Pixel-level artifact detection
│
├── (Video) Temporal Analysis
│   ├── Frame-by-frame consistency
│   ├── Motion smoothness
│   └── Audio-visual sync
│
└── (Audio) Frequency Analysis
    ├── Spectral irregularities
    ├── Pitch consistency
    └── Background noise patterns
        ↓
[Response Generation]
├── Parse JSON response
├── Calculate Confidence (0-100%)
├── Determine Verdict: REAL / DEEPFAKE / SUSPICIOUS
├── Generate Findings Array
│   ├── { label, severity, description }
│   └── Examples: "Unnatural Skin Texture", "Inconsistent Lighting"
└── Create Summary Paragraph
        ↓
[Save to Database]
├── Compress image thumbnail (300px, 70% quality)
├── POST /api/analysis
│   ├── userId, result, thumbnail, mimeType
│   └── Response timeout: 15 seconds
├── Deduct 10 credits
│   └── POST /api/user/{userId}/credits
└── Add to local history state
        ↓
[Display Results]
├── Render ResultDisplay Component
│   ├── Verdict Badge (color-coded)
│   ├── Confidence Gauge
│   ├── AI/Human Percentage
│   ├── Forensic Findings List
│   ├── Summary Text
│   └── PDF Export Button
│
└── User Actions
    ├── Download PDF Report (jsPDF)
    ├── Reset and upload new file
    └── View in History Vault
```

---

### **3. Content Protection & Verification**

#### **Registration Process**
```
User: Navigate to Protect → Register Content
        ↓
Upload Original Content (Image)
        ↓
Fill Metadata:
├── Title (optional)
├── Description (optional)
└── Tags (optional)
        ↓
Ownership Declaration:
├── ✅ I confirm I own this content
├── ✅ I agree to Terms of Service
└── Additional statement (optional)
        ↓
Click "Register & Protect"
        ↓
[Backend] POST /api/protect/register
        ↓
Generate Fingerprints:
├── SHA-256: 64-char hex hash (exact match)
├── pHash: 64-bit perceptual hash (visual similarity)
└── Embedding: 768-dim vector via Gemini
        ↓
Duplicate Check (Layer 1):
├── Query: WHERE sha256 == computed_sha256
├── Match Found + Different Owner?
│   ├── Log to duplicate_attempt_logs
│   └── Return 409 Conflict Error
└── No Match → Continue
        ↓
Similarity Check (Layer 2):
├── Fetch ALL protected_content (optimize in production)
├── For each item:
│   ├── Calculate Hamming Distance (pHash)
│   └── Distance ≤ 5?
│       ├── Yes: Flag for Review
│       │   ├── status = 'pending_review'
│       │   └── flagReason = "Similar to Case XYZ"
│       └── No: Continue
└── Default: status = 'active'
        ↓
Store in Firestore:
├── Collection: protected_content
├── Document ID: caseId (UUID v4)
├── Fields:
│   ├── userId, caseId, timestamp
│   ├── sha256, pHash, embedding
│   ├── metadata (title, description, tags)
│   ├── status ('active' or 'pending_review')
│   ├── ownership_declaration {
│   │     confirmed, timestamp, ip_address,
│   │     agreedToTos, statement
│   │   }
│   └── flagReason (if pending)
        ↓
Response to User:
├── Status 200: "Content protected successfully"
│   └── Show Case ID, Timestamp
└── Status 202: "Pending Review"
    └── Show warning about similarity
```

#### **Verification Process**
```
User: Navigate to Verify Suspicious Content
        ↓
Upload Suspicious Image
        ↓
Click "Verify Ownership"
        ↓
[Backend] POST /api/protect/verify
        ↓
Generate Fingerprints (same as registration)
        ↓
Exact Match Check:
├── Query: WHERE sha256 == suspicious_sha256
├── Match Found?
│   ├── Yes: 100% Infringement Detected
│   │   └── Retrieve original case details
│   └── No: Continue to Visual Check
        ↓
Visual Similarity Check:
├── Fetch ALL protected_content
├── For each item:
│   ├── Calculate Hamming Distance (pHash)
│   └── Distance ≤ 5?
│       └── Yes: Likely Infringement (95%+ confidence)
└── No matches → "No match found"
        ↓
[If Match Found] Generate Evidence Report:
├── Original Case ID
├── Registration Timestamp
├── Owner Email (masked: j***@example.com)
├── Fingerprint Comparison:
│   ├── SHA-256: Exact / Mismatch
│   ├── pHash Distance: X bits
│   └── Visual Similarity: Y%
├── Legal Notice Template
└── Recommended Actions
        ↓
Response to User:
├── Display Match Result
│   ├── Confidence Level
│   ├── Match Type (Exact / Visual)
│   └── Evidence Details
│
├── Notify Original Owner (optional future feature)
│   └── Email alert with evidence
│
└── Export PDF Evidence Report
```

---

### **4. Credit Purchase Workflow**

```
User: Dashboard → Credit Purchase Section
        ↓
Select Credit Pack:
├── Starter: 100 credits - ₹99
├── Power User: 500 credits - ₹399
├── Professional: 1000 credits - ₹699
└── Enterprise: 5000 credits - ₹2999
        ↓
Click "Request Purchase"
        ↓
[Frontend] Validate logged in
        ↓
POST /api/credits/request
Body: {
  userId, userEmail, amount, packLabel, price
}
        ↓
[Backend] Create Request:
├── Collection: credit_requests
├── Document: {
│     userId, userEmail, amount,
│     packLabel, price, timestamp,
│     status: 'pending'
│   }
└── Return success + request ID
        ↓
User receives confirmation:
"Request sent for [Pack Name]. Admin will review shortly."
        ↓
[Admin Process]
Admin: Navigate to Admin Dashboard → Credit Requests
        ↓
View Pending Requests:
├── User Email
├── Pack Details (amount, price)
├── Request Timestamp
└── Actions: [Approve] [Reject]
        ↓
Admin Clicks "Approve"
        ↓
POST /api/admin/credit-requests/{id}/approve
        ↓
[Backend Transaction]
├── Start Firestore Transaction
├── Get request document
│   └── Validate status == 'pending'
├── Get user document
├── Update user:
│   ├── credits += requested_amount
│   └── totalCredits += requested_amount
├── Update request:
│   ├── status = 'approved'
│   └── processedAt = timestamp
└── Commit transaction
        ↓
User's credits updated in real-time
└── User can now use credits for analysis
```

---

### **5. Admin Monitoring Flow**

```
Admin Login → Dashboard → Settings Tab
        ↓
Admin Dashboard Loads:
        ↓
[Fetch Data]
├── GET /api/admin/users → All registered users
├── GET /api/admin/alerts → Fraud alerts
└── GET /api/admin/credit-requests → Pending requests
        ↓
Display Panels:
├── User Management
│   ├── List all users (name, email, plan, credits)
│   ├── Sort by credits / risk score
│   └── Action: Block user (future feature)
│
├── Real-time Alerts
│   ├── Bot-like typing detected
│   ├── Camera stream injection attempts
│   ├── Suspicious registration patterns
│   └── Timestamp + User Email
│
└── Credit Request Management
    ├── View pending requests
    ├── User details + pack info
    └── Approve/Reject actions
        ↓
Admin Actions:
├── Approve credit request → User credits updated
├── Review alerts → Flag users for investigation
└── Monitor platform usage → Analytics dashboard
```

---

## 🔒 Security Features

### **Authentication & Authorization**
- ✅ Firebase Authentication (Google OAuth + Email/Password)
- ✅ JWT Token verification on all protected routes
- ✅ User ID validation (req.user.uid === params.userId)
- ✅ Admin-only endpoints with email whitelist

### **Data Protection**
- ✅ API keys stored in environment variables (never in code)
- ✅ Firebase Admin SDK for secure server-side operations
- ✅ CORS configured for specific origins
- ✅ HTTPS enforcement in production
- ✅ Service account credentials never exposed to frontend

### **Content Security**
- ✅ SHA-256 cryptographic hashing (irreversible)
- ✅ Original files never stored (only fingerprints)
- ✅ IP address logging for ownership claims
- ✅ Timestamp-based proof of registration
- ✅ Duplicate prevention system

### **Rate Limiting & Abuse Prevention**
- ✅ Credit-based system (10 credits per scan)
- ✅ Admin approval for credit purchases
- ✅ Duplicate attempt logging
- ✅ Firebase security rules for database access

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Code Style**
- Use TypeScript for all new frontend code
- Follow ESLint rules
- Add comments for complex logic
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Authenex Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 Contact

### **Team Authenex**

- **GitHub**: [@juned](https://github.com/juned)
- **Project Repository**: [Authenex on GitHub](https://github.com/juned/authenex1)
- **Email**: support@authenex.com (placeholder)

### **Hackathon Information**
- **Event**: National Level Hackathon 2026
- **Category**: AI & Cybersecurity
- **Theme**: Digital Fraud Prevention

---

## 🙏 Acknowledgments

- **Google Gemini AI**: Advanced AI models for deepfake detection
- **OpenAI**: GPT-4 and TTS for chatbot functionality
- **Firebase**: Robust authentication and database services
- **NewsData.io**: Real-time news aggregation
- **React & Vite**: Modern web development framework
- **TailwindCSS**: Beautiful, responsive UI design

---

## 📊 Project Status

- ✅ **Core Detection**: Fully functional
- ✅ **Content Protection**: Operational
- ✅ **Admin Dashboard**: Complete
- ✅ **News Feed**: Live integration
- ✅ **Multi-language Support**: 7 languages
- ✅ **PWA Support**: Installable on mobile devices
- 🚧 **Advanced Analytics**: In development
- 🚧 **Blockchain Integration**: Planned for v2.0

---

<div align="center">

**Made with ❤️ by Team Authenex**

⭐ **Star this repo if you found it helpful!** ⭐

[![GitHub Stars](https://img.shields.io/github/stars/juned/authenex1?style=social)](https://github.com/juned/authenex1)
[![GitHub Forks](https://img.shields.io/github/forks/juned/authenex1?style=social)](https://github.com/juned/authenex1/fork)

</div>
