# IP Marketplace Infrastructure Frontend

A modern React TypeScript application for the IP Authorization & Secondary Creation Marketplace Platform. This platform enables creators to license their intellectual property, allows secondary creators to build authentic products, and provides buyers with verified authentic products through blockchain-based authorization chains.

## 🚀 Features

### Core Functionality
- **Multi-language Support**: English and Traditional Chinese with i18next
- **User Authentication**: JWT-based authentication with role-based access control
- **IP Asset Management**: Browse, register, and license intellectual property
- **Product Marketplace**: Shop for verified authentic products
- **Verification System**: Blockchain-based product authenticity verification
- **Admin Dashboard**: Comprehensive platform management tools

### User Types
- **IP Creators**: Register and license original content
- **Secondary Creators**: License IP and create authentic products  
- **Buyers**: Purchase verified products with authenticity guarantees
- **Administrators**: Manage platform operations and content moderation

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **API Integration**: RESTful API with mock data fallback
- **State Management**: React Query for server state, Context API for global state
- **Modern React**: Hooks, Suspense, Error Boundaries
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Code splitting, lazy loading, optimized images

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **State Management**: React Query + Context API + Zustand
- **Internationalization**: react-i18next
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **Git**: For version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd imi
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and configure your variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1
VITE_USE_MOCK_DATA=true

# Application Settings
VITE_APP_NAME=IPMarket
VITE_DEFAULT_LANGUAGE=en

# Feature Flags
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_ANALYTICS=false
```

### 4. Start Development Server

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── atoms/           # Basic building blocks
│   ├── molecules/       # Component combinations
│   ├── organisms/       # Complex components
│   └── templates/       # Page layouts
├── contexts/            # React contexts
├── data/                # Mock data and constants
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization
│   ├── locales/         # Translation files
│   └── index.ts         # i18n configuration
├── pages/               # Page components
├── routes/              # Routing configuration
├── services/            # API services
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── App.tsx              # Main app component
```

## 🌍 Internationalization

The app supports multiple languages:

- **English** (default): `en`
- **Traditional Chinese**: `zh-TW`

### Adding New Languages

1. Create translation file in `src/i18n/locales/[locale].json`
2. Add language configuration in `src/contexts/LanguageContext.tsx`
3. Update the `LANGUAGES` constant with new locale

### Translation Keys Structure

```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error"
  },
  "navigation": {
    "home": "Home",
    "browse": "Browse"
  }
}
```

## 🔐 Authentication

The app uses JWT-based authentication with role-based access control:

### User Roles
- `creator`: Can register IP and manage licenses
- `secondary_creator`: Can license IP and create products
- `buyer`: Can purchase products and verify authenticity
- `admin`: Full platform management access

### Demo Mode

In development, you can quickly switch between user types using the demo selector at the top of the page.

## 🎨 Design System

### Colors
- **Primary**: Blue (`#2563EB`)
- **Success**: Green (`#10B981`)
- **Warning**: Orange (`#F59E0B`)
- **Error**: Red (`#EF4444`)

### Typography
- **Font**: Inter
- **Heading 1**: 36px, Bold
- **Heading 2**: 24px, Semibold
- **Body**: 16px, Regular

### Components

All components follow atomic design principles:
- **Atoms**: Button, Input, Badge, etc.
- **Molecules**: SearchBar, UserMenu, etc.
- **Organisms**: Header, ProductGrid, etc.
- **Templates**: Layout, DashboardLayout, etc.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API service testing
- **E2E Tests**: User flow testing (future implementation)

## 🔧 Development Tools

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Pre-commit Hooks

The project uses Husky for pre-commit hooks:
- ESLint checks
- Prettier formatting
- TypeScript compilation
- Test validation

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Environment Variables for Production

```env
VITE_API_URL=https://api.yourproduction.com/api/v1
VITE_USE_MOCK_DATA=false
VITE_ENABLE_DEMO_MODE=false
VITE_ENABLE_ANALYTICS=true
```

### Deployment Options

- **Netlify**: Connect your repo and deploy automatically
- **Vercel**: Zero-config deployment
- **AWS S3 + CloudFront**: For scalable hosting
- **Docker**: Use the included Dockerfile

## 🔧 Configuration

### API Integration

The app can work with mock data or a real backend API:

```typescript
// Toggle between mock and real API
const USE_MOCK_DATA = process.env.VITE_USE_MOCK_DATA === 'true';
```

### Feature Flags

Control features via environment variables:

```env
VITE_ENABLE_DEMO_MODE=true    # Show user type switcher
VITE_ENABLE_ANALYTICS=false  # Enable analytics tracking
VITE_ENABLE_PWA=true         # Progressive Web App features
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **Module resolution errors**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **TypeScript errors**
   ```bash
   # Restart TypeScript service in VS Code
   Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"
   ```
## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the coding standards
4. **Test your changes**: Ensure all tests pass
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Coding Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow the configured rules
- **Prettier**: Auto-format on save
- **Conventional Commits**: Use semantic commit messages
- **Component naming**: PascalCase for components
- **File naming**: camelCase for utilities, PascalCase for components

### Pull Request Guidelines

- Provide clear description
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed
- Keep PRs focused and atomic

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and code comments
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: contact@imi.infoecos.ai

## 🗺️ Roadmap

### Phase 1 - MVP (Current)
- [x] Basic authentication
- [x] IP asset browsing
- [x] Product marketplace  
- [x] User dashboard
- [x] Internationalization

### Phase 2 - Enhanced Features
- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Social features (following, reviews)
- [ ] Mobile app (React Native)

### Phase 3 - Enterprise
- [ ] Advanced analytics
- [ ] Bulk operations
- [ ] API rate limiting
- [ ] Enterprise SSO
- [ ] White-label solutions

## 🙏 Acknowledgments

- **Design System**: Inspired by Tailwind UI
- **Icons**: Lucide React icon library
- **Authentication**: JWT best practices
- **Internationalization**: react-i18next community
- **State Management**: React Query patterns

---

**Built with ❤️ for the creator economy**