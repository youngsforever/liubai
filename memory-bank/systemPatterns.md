# System Patterns

## Architecture Overview

### 1. Frontend Architecture (liubai-web)
- **Framework**: Vue 3.x with TypeScript
- **Build System**: Vite
- **State Management**: Vue Composition API + stores
- **Data Storage**: IndexedDB via Dexie.js
- **UI Components**: Custom components + TipTap editor
- **PWA Features**: Service Worker for offline capability

### 2. Backend Architecture (liubai-laf)
- **Platform**: Laf Cloud Functions
- **Database**: MongoDB
- **API Layer**: RESTful endpoints
- **Authentication**: Multi-provider auth system
- **File Storage**: Cloud storage integration
- **AI Integration**: Multiple AI model support

### 3. VS Code Extension (liubai-vscode-extension)
- **Build System**: esbuild
- **Distribution**: VS Code Marketplace
- **Integration**: VS Code Extension API
- **Compatibility**: VS Code Web support

## Key Design Patterns

### 1. Offline-First Architecture
```
User Action → IndexedDB → Sync Queue → Cloud Sync
                   ↑            ↓
            Offline Cache ← Network Status
```

### 2. Data Synchronization
- Optimistic updates
- Conflict resolution
- Queue-based sync
- Delta updates

### 3. State Management
- Composition API based stores
- Local state persistence
- Cross-component communication
- Reactive updates

### 4. Cloud Integration
- Authentication flow
- API request handling
- File upload/download
- Real-time updates

## Critical Implementation Paths

### 1. Data Flow
```
User Input → Local Store → Sync Queue → Cloud Functions → MongoDB
     ↑          ↓             ↓              ↓
  UI Update ← Local Cache ← Sync Status ← Cloud Events
```

### 2. Authentication Flow
```
User → OAuth Provider → Backend Validation → Token Generation
  ↑          ↓              ↓                    ↓
Login UI ← Redirect ← Session Management ← Token Storage
```

### 3. File Handling
```
File Selection → Local Processing → Upload Queue → Cloud Storage
      ↓              ↓                ↓              ↓
Local Cache ← Optimization ← Download Queue ← CDN Delivery
```

## Component Relationships

### 1. Frontend Components
- Views (layout containers)
- Pages (route components)
- Common UI components
- Business logic controllers
- State management stores

### 2. Backend Services
- Authentication service
- Data persistence
- File management
- AI processing
- Third-party integrations

### 3. Extension Components
- VS Code commands
- Context menu items
- Status bar items
- WebView panels

## Technical Decisions

### 1. Framework Choices
- Vue 3 for reactive UI and performance
- Vite for fast development and building
- TypeScript for type safety
- PWA for offline capabilities

### 2. Storage Strategy
- IndexedDB for local storage
- MongoDB for cloud storage
- File system for extension data
- Cache management system

### 3. Build Process
- pnpm for package management
- esbuild for extension bundling
- Continuous integration workflow
- Multi-platform deployment

## Security Patterns

### 1. Data Security
- End-to-end encryption
- Secure token management
- Data validation
- Input sanitization

### 2. Authentication Security
- OAuth integration
- Token-based auth
- Session management
- Permission system

### 3. Extension Security
- VS Code security policies
- Web extension isolation
- Secure storage access
- Command validation