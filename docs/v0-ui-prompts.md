# AI Frontend Generation Prompts for AI Notes

This document contains optimized prompts for AI-driven frontend development tools (v0, Lovable, etc.) based on the AI Notes UI/UX specification. Each prompt follows the structured framework for optimal code generation.

## 🎯 Prompt Structure Framework

All prompts follow this four-part structure for best results:
1. **High-Level Goal** - Clear, concise summary of the objective
2. **Detailed, Step-by-Step Instructions** - Granular, numbered list of actions
3. **Code Examples, Data Structures & Constraints** - Concrete examples and what NOT to do
4. **Define a Strict Scope** - Explicit boundaries and file modification limits

---

## Prompt 1: Dashboard Overview Screen

```
**High-Level Goal**: Create a professional AI Notes dashboard that serves as the central hub for content creation, recent activity monitoring, and storage management with responsive design and AI-specific interaction patterns.

**Detailed, Step-by-Step Instructions**:
1. Create a responsive dashboard layout using Next.js 15 with App Router and TypeScript
2. Implement a top navigation bar with "AI Notes" logo/title, global search input, and user avatar dropdown
3. Add a quick action toolbar with three primary buttons: "Create Note", "Upload Document", "Start Recording"
4. Create a recent activity feed showing mixed content types (notes, documents, voice recordings) with timestamps and content previews
5. Build a storage usage visualization component showing notes count, documents count, total storage with color-coded progress bars
6. Include a collapsible sidebar with folder hierarchy, tags, and navigation to main sections
7. Implement proper loading states, empty states, and error handling for all data sections
8. Add keyboard navigation support and accessibility features (ARIA labels, proper focus management)
9. Use responsive breakpoints: mobile (320-767px), tablet (768-1023px), desktop (1024px+)

**Tech Stack & Design Constraints**:
- Framework: Next.js 15 with App Router and TypeScript
- Styling: Tailwind CSS with Shadcn-ui component library
- State Management: TanStack Query for data fetching, React hooks for local state
- Icons: Lucide React with 24px standard size
- Color Palette: Primary #2563eb, Success #10b981, Warning #f59e0b, Error #ef4444
- Typography: Inter font family, 16px base body text, 1.6 line height
- Spacing: 8px base unit system (4px, 8px, 16px, 24px, 32px)
- Accessibility: WCAG 2.1 AA compliance, 4.5:1 contrast ratios, keyboard navigation

**Component Structure & API Integration**:
```typescript
// Expected data structure for recent activity
interface ActivityItem {
  id: string;
  type: 'note' | 'document' | 'voice';
  title: string;
  preview: string;
  timestamp: Date;
  aiProcessed: boolean;
  processingStatus?: 'processing' | 'completed' | 'failed';
}

// Storage usage data structure
interface StorageUsage {
  notesCount: number;
  documentsCount: number;
  voiceCount: number;
  totalStorageUsed: number; // in bytes
  totalStorageLimit: number; // in bytes
}
```

**Strict Scope & Restrictions**:
- Create only the main dashboard page component and its child components
- Do NOT implement actual API calls - use mock data with realistic content
- Do NOT create authentication logic - assume user is logged in
- Focus on UI/UX implementation, not backend integration
- Ensure all components are accessible and responsive
- Use Shadcn-ui patterns for consistency with existing design system
- Include proper TypeScript types for all props and data structures
```

---

## Prompt 2: Note Editor with AI Panel

```
**High-Level Goal**: Build a rich-text note editor with an expandable AI assistance panel that provides contextual AI actions while maintaining focus on the writing experience and professional usability.

**Detailed, Step-by-Step Instructions**:
1. Create a full-screen note editor layout with clean, distraction-free design
2. Implement a rich-text editor using a modern library (TipTap or similar) with formatting toolbar
3. Add an AI actions sidebar that starts collapsed and expands when AI features are triggered
4. Include these AI actions: "Summarize", "Extract Insights", "Generate Tags", "Find Action Items"
5. Show real-time word count, character count, and auto-save status indicators
6. Add a floating action button for AI summarization that appears after user types content
7. Implement progressive AI features - show basic actions first, advanced ones after content reaches threshold
8. Create smooth animations for AI panel expansion and content appearance
9. Add keyboard shortcuts for common actions (Cmd/Ctrl+S for save, Cmd/Ctrl+K for AI panel)
10. Include proper loading states for AI processing with cancel options

**Tech Stack & AI Interaction Patterns**:
- Rich Text Editor: TipTap with React integration or similar modern editor
- AI Processing Animation: Subtle breathing animation (2000ms ease-in-out)
- Content Appearance: Fade-in with slight upward movement (300ms cubic-bezier)
- AI Panel Expansion: Slide-in animation (400ms cubic-bezier easing)
- Mobile Adaptation: Full-screen editor, collapsible formatting toolbar, gesture-friendly
- Typography Scale: H1 36px/700, H2 30px/600, H3 24px/600, Body 16px/400
- AI Status Indicators: Processing pulse, success confirmation, error handling

**Component Architecture & Data Flow**:
```typescript
// Note data structure
interface Note {
  id: string;
  title: string;
  content: string; // Rich text HTML or markdown
  aiSummary?: string;
  aiTags?: string[];
  aiInsights?: string[];
  aiActionItems?: string[];
  lastSaved: Date;
  wordCount: number;
  processingStatus?: 'idle' | 'summarizing' | 'analyzing' | 'completed';
}

// AI action types
interface AIAction {
  type: 'summarize' | 'insights' | 'tags' | 'actions';
  label: string;
  description: string;
  processingTime?: number; // estimated seconds
}
```

**Mobile-First Responsive Design**:
- Mobile: Full-screen editor, floating AI button, swipe to reveal panel
- Tablet: Split view with content on left, AI panel on right
- Desktop: Persistent sidebar option, hover states, right-click context menus
- Wide Screens: Multi-column layout option, side-by-side content comparison

**Strict Scope & Implementation Notes**:
- Create the note editor page and AI panel components only
- Use mock AI responses with realistic delays (2-5 seconds)
- Implement proper error states and retry mechanisms for AI failures
- Focus on smooth interactions and professional polish
- Include accessibility features: keyboard navigation, screen reader support
- Maintain 60fps animations, provide reduced motion alternatives
- Do NOT implement actual AI API calls - simulate with setTimeout and mock responses
```

---

## Prompt 3: Document Upload & Processing Interface

```
**High-Level Goal**: Create an intuitive document upload interface with transparent AI processing feedback that builds user trust through clear status communication and handles various file types professionally.

**Detailed, Step-by-Step Instructions**:
1. Build a drag-and-drop upload zone with visual feedback for hover and active states
2. Add a traditional file browser button as alternative to drag-and-drop
3. Implement file validation with clear error messaging for unsupported formats
4. Create a multi-stage progress indicator: Upload → Extract Text → AI Analysis → Complete
5. Show real-time progress with file details (name, size, type) and estimated time remaining
6. Display incremental results as they become available (extracted text preview, then AI insights)
7. Add cancel and retry options for each processing stage
8. Include a processing queue for multiple file uploads
9. Show final results in a clean document viewer with AI insights panel
10. Implement error handling for various failure scenarios (network, file corruption, AI service issues)

**File Processing & Status Management**:
```typescript
// Document processing states
interface DocumentUpload {
  id: string;
  file: File;
  status: 'uploading' | 'extracting' | 'analyzing' | 'completed' | 'failed';
  progress: number; // 0-100
  extractedText?: string;
  aiSummary?: string;
  aiInsights?: string[];
  error?: string;
  estimatedTimeRemaining?: number; // seconds
}

// Supported file types and limits
const SUPPORTED_TYPES = ['.pdf', '.doc', '.docx', '.txt'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_CONCURRENT_UPLOADS = 3;
```

**Visual Design & Interaction Patterns**:
- Upload Zone: Dashed border, subtle background, clear call-to-action text
- Progress Indicators: Multi-step progress bar with stage labels and icons
- File Preview: Show file icon, name, size, and processing status
- AI Results: Distinct visual styling for AI-generated content vs. extracted text
- Error States: Clear error messages with specific guidance and retry options
- Success States: Brief success animation with clear next steps

**Mobile Responsiveness & Accessibility**:
- Mobile: Full-screen upload interface, thumb-friendly touch targets
- File Picker: Native file input integration for mobile photo/document selection
- Progress Communication: Voice-over announcements for status changes
- Keyboard Navigation: Tab through upload options, space/enter to trigger actions
- Screen Reader Support: Detailed ARIA labels for all processing states
- Color Contrast: Ensure all status indicators meet WCAG contrast requirements

**Strict Scope & File Handling**:
- Create upload interface, progress tracking, and results display components
- Use File API for client-side file handling and validation
- Simulate text extraction and AI processing with realistic delays
- Do NOT implement actual file parsing or AI API integration
- Include comprehensive error handling for all upload scenarios
- Focus on user trust-building through transparent communication
- Ensure all file operations are secure and properly validated
```

---

## Prompt 4: Smart Search Interface

```
**High-Level Goal**: Develop an intelligent search interface that provides instant, contextual results across all content types (notes, documents, voice recordings) with AI-powered suggestions and advanced filtering capabilities.

**Detailed, Step-by-Step Instructions**:
1. Create a prominent search input with global scope and AI-powered autocomplete
2. Implement instant search results with debounced input (300ms delay)
3. Show mixed content type results with clear visual indicators for each type
4. Add search filters: content type, date range, tags, folders, AI-generated vs. user content
5. Include search result highlighting for matching terms within content
6. Display search suggestions based on content analysis and user history
7. Create saved searches functionality with easy access and management
8. Implement advanced search with natural language query support
9. Add recent searches dropdown with quick re-access
10. Show empty states, loading states, and error recovery for all search scenarios

**Search Architecture & Data Structures**:
```typescript
// Search result interface
interface SearchResult {
  id: string;
  type: 'note' | 'document' | 'voice';
  title: string;
  content: string;
  highlightedContent: string; // With search terms highlighted
  relevanceScore: number;
  matchedTerms: string[];
  createdAt: Date;
  tags: string[];
  folder?: string;
  aiGenerated: boolean;
}

// Search filters
interface SearchFilters {
  contentTypes: Array<'note' | 'document' | 'voice'>;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  folders?: string[];
  includeAIGenerated: boolean;
  includeUserContent: boolean;
}

// Search suggestions
interface SearchSuggestion {
  query: string;
  type: 'content' | 'tag' | 'folder' | 'recent';
  resultCount?: number;
}
```

**AI-Enhanced Search Features**:
- Natural Language Processing: Support queries like "meeting notes from last week"
- Content Understanding: Search by concepts, not just keywords
- Smart Suggestions: Based on content analysis and user behavior patterns
- Contextual Filters: Auto-suggest relevant filters based on search context
- Search Intent Recognition: Distinguish between finding, creating, and organizing content

**Responsive Search Experience**:
- Mobile: Full-screen search overlay, voice search option, recent searches
- Tablet: Split view with filters sidebar, grid/list toggle for results
- Desktop: Persistent search with live results, advanced filters panel
- Wide Screen: Multi-column results, preview pane for quick content review

**Performance & User Experience Optimizations**:
- Instant Search: Results appear within 100ms of typing
- Virtual Scrolling: Handle large result sets efficiently
- Search History: Remember and suggest previous successful searches
- Keyboard Navigation: Arrow keys to navigate results, enter to open
- Escape to Clear: Quick way to exit search and return to previous context

**Strict Scope & Search Implementation**:
- Create search input, results display, and filter components
- Implement client-side search simulation with realistic data
- Use mock search results with proper relevance scoring
- Do NOT implement actual full-text search or AI query processing
- Focus on search UX patterns and result presentation
- Include comprehensive keyboard and accessibility support
- Ensure search performance feels instant and responsive
```

---

## Prompt 5: Voice Recording Interface

```
**High-Level Goal**: Create an intuitive voice recording interface with real-time audio visualization, AI transcription feedback, and seamless integration with the notes system while handling browser permissions gracefully.

**Detailed, Step-by-Step Instructions**:
1. Build a voice recording control panel with start/stop/pause/resume buttons
2. Implement microphone permission request with clear user guidance
3. Add real-time audio waveform visualization during recording
4. Show recording duration timer and audio level indicators
5. Create AI transcription status with live updates as speech is converted to text
6. Display transcribed text in real-time with confidence indicators
7. Add playback controls for recorded audio with timeline scrubbing
8. Include AI enhancement options: summarize transcript, extract action items, generate tags
9. Provide save options: save as note, save as audio file, save transcript only
10. Handle error scenarios: no microphone, permission denied, AI service unavailable

**Audio Recording & Web APIs**:
```typescript
// Recording state management
interface RecordingState {
  status: 'idle' | 'requesting_permission' | 'recording' | 'paused' | 'processing' | 'completed';
  duration: number; // seconds
  audioLevel: number; // 0-100
  audioBlob?: Blob;
  transcript: string;
  transcriptionConfidence: number; // 0-1
  aiProcessing: boolean;
}

// Browser compatibility and permissions
interface AudioCapabilities {
  hasMediaRecorder: boolean;
  hasUserMedia: boolean;
  microphonePermission: 'granted' | 'denied' | 'prompt';
  supportedFormats: string[];
}

// Voice note data structure
interface VoiceNote {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  duration: number;
  aiSummary?: string;
  aiTags?: string[];
  aiActionItems?: string[];
  recordedAt: Date;
}
```

**Real-time Audio Visualization**:
- Waveform Display: Live audio visualization using Web Audio API
- Audio Level Meter: Visual feedback showing microphone input levels
- Recording Timer: Clean, prominent duration display (mm:ss format)
- Status Indicators: Clear visual feedback for all recording states
- Browser Compatibility: Graceful fallback for unsupported browsers

**AI Transcription Integration**:
- Live Transcription: Show text appearing as user speaks
- Confidence Scoring: Visual indicators for transcription accuracy
- Error Handling: Clear messaging when transcription fails
- Processing Feedback: Loading states for AI analysis
- Edit Capability: Allow users to correct transcription errors

**Mobile-First Audio Experience**:
- Mobile: Large, thumb-friendly recording button, native audio controls
- Permission Handling: Clear explanation of microphone access needs
- Gesture Support: Tap to record, long-press options
- Notification: Background recording indicators when app is minimized
- Battery Awareness: Show recording impact on device battery

**Strict Scope & Audio Handling**:
- Create voice recording interface and transcription display components
- Use MediaRecorder API for audio capture and Web Audio API for visualization
- Simulate AI transcription with realistic delays and accuracy simulation
- Do NOT implement actual speech-to-text API integration
- Focus on recording UX and user trust during audio processing
- Include comprehensive error handling for microphone and browser issues
- Ensure accessibility for users who cannot use voice features
```

---

## 🚀 Usage Instructions for AI Code Generation Tools

### Best Practices:

1. **Start Small**: Use one prompt at a time, don't try to generate the entire application
2. **Provide Context**: Include relevant sections from `front-end-spec.md` with your prompts
3. **Iterate Incrementally**: Use initial generation as foundation, refine with follow-up prompts
4. **Test Mobile First**: Always verify responsive behavior starts with mobile design
5. **Validate Accessibility**: Check keyboard navigation and screen reader compatibility

### Recommended Workflow:

1. **Choose a Component**: Start with Dashboard or Note Editor for core functionality
2. **Copy-Paste Prompt**: Use the complete prompt including all code examples
3. **Generate Initial Version**: Let the AI create the foundational component
4. **Test and Refine**: Check responsive behavior, accessibility, and interactions
5. **Enhance with Follow-ups**: Add specific refinements with targeted prompts

### Common Follow-up Prompts:

```
"Add comprehensive error boundaries and better loading states"
"Improve accessibility with proper ARIA labels and keyboard navigation"
"Optimize performance with React.memo and proper dependency arrays"
"Add more realistic mock data that represents actual user content"
"Enhance animations to feel more organic and less mechanical"
"Add proper TypeScript error handling for all async operations"
```

### Component Integration Order:

1. **Dashboard** - Central hub and navigation foundation
2. **Note Editor** - Core content creation experience
3. **Search Interface** - Content discovery and organization
4. **Document Upload** - File processing and AI integration
5. **Voice Recording** - Advanced multimodal input

### Tech Stack Compatibility:

All prompts are optimized for:
- **Next.js 15** with App Router
- **TypeScript** with strict type checking
- **Tailwind CSS** with Shadcn-ui components
- **TanStack Query** for data management
- **Lucide React** for iconography

### ⚠️ Important Reminders:

- **AI-generated code requires human review** for production readiness
- **Test accessibility** with keyboard navigation and screen readers
- **Validate responsive design** across all specified breakpoints
- **Mock AI responses** should have realistic processing times
- **Error handling** should be comprehensive and user-friendly
- **Performance optimization** may be needed for production deployment

### File Organization:

When implementing these components, organize files as:
```
src/
├── app/
│   ├── dashboard/
│   ├── notes/
│   ├── documents/
│   ├── search/
│   └── voice/
├── components/
│   ├── ui/ (Shadcn-ui components)
│   ├── dashboard/
│   ├── notes/
│   ├── documents/
│   ├── search/
│   └── voice/
└── lib/
    ├── types.ts
    ├── utils.ts
    └── mock-data.ts
```

## 📝 Additional Resources

- **Frontend Specification**: `docs/front-end-spec.md`
- **User Stories**: `docs/stories/1.*.md`
- **Architecture**: `docs/architecture.md`
- **Project Requirements**: `docs/prd.md`

These prompts are designed to work with the complete AI Notes project context. Reference the other documentation files for additional implementation details and requirements.