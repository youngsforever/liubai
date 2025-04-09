# Technical Context

## Development Environment

### Required Software
- Node.js (Latest LTS version)
- pnpm (Package manager)
- Git (Version control)
- VS Code (Recommended IDE)
- ffmpeg (For media processing)

### IDE Setup
1. VS Code Extensions
   - TypeScript Vue Plugin
   - ESLint
   - Prettier
   - Volar
   - Biome

2. Development Tools
   - Vue DevTools
   - Browser DevTools
   - IndexedDB Browser

## Technology Stack

### Frontend (liubai-web)
```
Vue 3.x
├── TypeScript (Type safety)
├── Vite (Build tool)
├── VueUse (Composition utilities)
├── Dexie.js (IndexedDB wrapper)
├── TipTap (Rich text editor)
└── PWA capabilities
```

### Backend (liubai-laf)
```
Laf Cloud Functions
├── MongoDB (Database)
├── TypeScript
├── Cloud Storage
└── AI Models Integration
```

### VS Code Extension
```
VS Code Extension API
├── TypeScript
├── esbuild (Bundling)
└── Web Extension Support
```

## Dependencies Management

### Package Management
- pnpm workspaces for monorepo
- Dependency versioning strategy
- Lock file maintenance
- Security updates process

### Build Tools
- Vite configuration
- esbuild setup
- TypeScript configuration
- PWA manifest

## Technical Constraints

### Browser Support
- Modern browsers (last 2 versions)
- PWA compatibility required
- IndexedDB support needed
- Service Worker support

### Performance Requirements
- Initial load under 3s
- Offline functionality
- Smooth animations (60fps)
- Responsive design

### Security Requirements
- HTTPS only
- Secure data storage
- Authentication tokens
- Input validation

## Development Workflow

### Local Development
```bash
# Frontend
cd liubai-frontends/liubai-web
pnpm i
pnpm dev

# VS Code Extension
cd liubai-frontends/liubai-vscode-extension
pnpm i
pnpm watch

# Backend
cd liubai-backends/liubai-laf
pnpm i
# Deploy to Laf
```

### Testing Strategy
- Unit tests
- Integration tests
- E2E testing
- Performance testing

### Deployment Process
1. Version bump
2. Build assets
3. Run tests
4. Deploy frontend
5. Deploy backend
6. Publish extension

## Tool Usage Patterns

### Version Control
- Feature branches
- Pull request workflow
- Semantic versioning
- Conventional commits

### Code Quality
- ESLint configuration
- TypeScript strict mode
- Biome formatting
- Code review process

### Documentation
- VitePress for docs
- JSDoc comments
- API documentation
- Changelog maintenance

## Integration Points

### Third-Party Services
- WeChat integration
- DingTalk integration
- Cloud storage providers
- AI service providers

### API Endpoints
- Authentication endpoints
- Data synchronization
- File operations
- AI processing

### Extension Integration
- VS Code API
- Command palette
- Context menus
- Status bar items