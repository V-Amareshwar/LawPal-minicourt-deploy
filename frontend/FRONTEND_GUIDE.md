# LawPal Frontend - Modern AI Legal Assistant UI

A sophisticated, production-ready React + TypeScript + Vite frontend with professional glass morphism design.

## 🎯 Features

### 1. **Landing Page** (`/`)
- Hero section with compelling value propositions
- Feature showcase (Chatbot, Mini Court, Legal Database)
- How it works section
- Call-to-action sections
- Responsive design with animations
- Professional gradient text effects

### 2. **Authentication** (`/login`, `/signup`)
- Modern split-panel design
- Email/password authentication
- Sign-up with display name
- Password visibility toggle
- Form validation and error handling
- Remember me functionality
- Smooth animations and transitions

### 3. **Dashboard** (`/dashboard`)
- Sticky sidebar navigation
- Quick access to all features
- User profile section
- Responsive layout
- Professional color scheme

### 4. **Chatbot UI** (Legal RAG Assistant)
- Message history with sessions management
- Real-time chat streaming
- Quick suggestion buttons for common queries
- Session creation and management
- Copy-paste friendly responses
- Typing indicators
- Smart message formatting

**Features:**
- 💬 Ask legal questions in natural language
- 📚 Get answers powered by Indian legal RAG model
- 💾 Save conversations for future reference
- 🔄 Switch between multiple chat sessions
- ⏱️ Real-time streaming responses

### 5. **Mini Court Room** (AI Judge Simulation)
- Case description input with character counter
- AI-powered trial simulation
- Win probability gauge (animated SVG)
- Judge verdict analysis
- Critical warnings
- Petitioner vs Respondent arguments
- Save verdict functionality
- Professional layout

**Features:**
- ⚖️ Simulate court proceedings
- 📊 See win probability predictions
- 📝 Get comprehensive verdict analysis
- 🎯 Understand strengths/weaknesses

### 6. **User Profile** (Modal)
- Avatar management
- Display name editing
- Email viewing
- Member since date
- Security settings
- Password change option (placeholder)
- Update profile functionality

## 🎨 Design System

### Glass Morphism Architecture
```css
/* Core glass effect */
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}
```

### Color Palette
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Accent**: `#ec4899` (Pink)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)

### Dark Theme
- **Background Primary**: `#0f172a`
- **Background Secondary**: `#1e293b`
- **Text Primary**: `#f1f5f9`
- **Text Secondary**: `#cbd5e1`

## 📁 Project Structure

```
src/
├── pages/
│   ├── LandingPage.tsx          # Landing page with features
│   ├── LandingPage.css          # Landing page styles
│   ├── LoginPage.tsx            # Login authentication
│   ├── SignUpPage.tsx           # Account creation
│   ├── Dashboard.tsx            # Main dashboard layout
│   └── Dashboard.css            # Dashboard styles
├── components/
│   ├── ChatBot.tsx              # RAG chatbot component
│   ├── ChatBot.css              # Chatbot styles
│   ├── MiniCourt.tsx            # AI Judge component
│   ├── MiniCourt.css            # Mini court styles
│   ├── ProfileSheet.tsx         # User profile modal
│   └── ProfileSheet.css         # Profile styles
├── styles/
│   └── globals.css              # Global styles & glass morphism
├── App.tsx                       # Main app with routing
├── App.css                       # App styles
├── main.tsx                      # Entry point
└── index.css                     # Base styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16.0+
- npm or yarn
- Backend server running on `http://localhost:3007`
- Python RAG backend on `http://localhost:7860`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

The frontend connects to the backend API at `http://localhost:3007`. No `.env` configuration needed for local development.

## 🔐 Authentication Flow

```
User Registration/Login
       ↓
POST /api/auth/register or /api/auth/login
       ↓
Receive JWT Token
       ↓
Store in localStorage
       ↓
Include in API requests via Authorization header
       ↓
Access Dashboard (Protected Route)
```

## 📡 API Integration

### Authentication Endpoints
```javascript
POST /api/auth/register    // Create account
POST /api/auth/login       // Login
GET  /api/auth/profile     // Get user profile
PATCH /api/auth/profile    // Update profile
```

### Chat Endpoints
```javascript
GET  /api/chat/sessions           // List chat sessions
POST /api/chat/sessions           // Create new session
PATCH /api/chat/sessions/:id      // Rename session
DELETE /api/chat/sessions/:id     // Delete session
GET  /api/chat/sessions/:id/messages // Get messages
POST /api/chat/                   // Send message (SSE stream)
GET  /api/chat/suggestions        // Get suggestions
```

### Trial Endpoint
```javascript
POST /api/simulate-trial          // Run trial simulation
```

## 🎭 Component Details

### ChatBot Component
**Props**: None (uses localStorage for auth)

**State**:
- `sessions`: ChatSession[]
- `currentSession`: ChatSession | null
- `messages`: Message[]
- `input`: string
- `isLoading`: boolean

**Features**:
- Automatic message streaming
- Session management
- Quick suggestions
- Typing indicators

### MiniCourt Component
**Props**: None

**State**:
- `caseDescription`: string
- `verdict`: Verdict | null
- `isLoading`: boolean
- `error`: string

**Features**:
- Form validation
- Win probability gauge
- Verdict analysis
- Arguments display

### ProfileSheet Component
**Props**:
- `user`: User
- `onClose`: () => void
- `onUpdate`: (user: User) => void

**State**:
- `displayName`: string
- `avatarUrl`: string
- `isLoading`: boolean

## 🎨 Styling & Animations

### Key Animations
- `fadeIn`: 0.6s ease-out
- `slideInLeft/Right`: 0.6s ease-out
- `slideUp`: 0.6s ease-out
- `pulse`: 2s cubic-bezier infinite
- `float`: 3s ease-in-out infinite

### Responsive Breakpoints
- **Desktop**: 1200px+
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px

## 🔧 Development

### Code Standards
- **Language**: TypeScript
- **Style**: CSS Modules + Global CSS
- **Formatting**: 2-space indentation
- **Linting**: ESLint with React hooks

### Development Commands
```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## 🐛 Common Issues

### Issue: "Cannot find module 'axios'"
**Solution**: Run `npm install axios react-router-dom zustand`

### Issue: API calls failing with 401
**Solution**: Ensure JWT token is valid and stored in localStorage

### Issue: Styling not applied
**Solution**: Check that global.css is imported in main.tsx

### Issue: Chat not streaming
**Solution**: Verify Flask backend is running on port 7860

## 📱 Mobile Responsiveness

The UI is fully responsive with:
- Mobile-first approach
- Touch-friendly button sizes
- Optimized sidebar navigation
- Flexible grid layouts
- Readable typography at all sizes

**Mobile Features**:
- Hamburger navigation (future)
- Full-width inputs
- Simplified profile sheet
- Optimized chart sizes

## 🔒 Security

### Implemented
- JWT token authentication
- Secure header inclusion
- Protected routes
- localStorage token management
- Password field masking

### Recommended (Future)
- HTTPS only in production
- Secure cookies (httpOnly)
- CORS configuration
- Token refresh mechanism
- Input sanitization

## 🎯 Usage Examples

### Using Chatbot
1. Click "Chatbot" in sidebar
2. Select existing session or create new
3. Type legal question
4. Wait for RAG response
5. Continue conversation or switch sessions

### Using Mini Court
1. Click "Mini Court" in sidebar
2. Enter detailed case description
3. Click "Simulate Trial"
4. Review verdict and analysis
5. Save or start new simulation

### Managing Profile
1. Click profile button (avatar)
2. Edit display name and avatar URL
3. Click "Save Changes"
4. Changes sync to all sessions

## 📚 File Sizes (Optimized)

```
Global CSS:          ~15 KB
App Components:      ~8 KB
Chat Component:      ~6 KB
MiniCourt Component: ~5 KB
Landing Page:        ~4 KB
Auth Pages:          ~7 KB
Total (gzipped):     ~20 KB
```

## 🚀 Performance Optimizations

- Code splitting by routes
- Lazy loading components
- Image optimization
- CSS minification
- Tree shaking
- Fast refresh HMR

**Lighthouse Scores Target**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## 🤝 Contributing

When adding new features:
1. Follow TypeScript strict mode
2. Use glass morphism for new cards
3. Add animations for interactions
4. Ensure mobile responsiveness
5. Update this README

## 📄 License

Part of LawPal Project - All Rights Reserved

## 🎉 Future Features

- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Document upload
- [ ] Verdicts export (PDF)
- [ ] Chat history search
- [ ] Collaborative cases
- [ ] Advanced filters
- [ ] Voice input
- [ ] Accessibility improvements

---

**Last Updated**: April 18, 2024
**Version**: 1.0.0
**Build Tool**: Vite
**Framework**: React 19 + TypeScript
