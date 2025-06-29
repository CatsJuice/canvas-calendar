# Canvas Calendar

A high-performance, infinite-scroll calendar component built with React and HTML5 Canvas. This project demonstrates advanced canvas rendering techniques for smooth scrolling through years of calendar data.

## 🚀 Features

- **Infinite Scroll**: Seamlessly scroll through years of calendar data
- **High Performance**: Canvas-based rendering for smooth 60fps scrolling
- **Virtual Scrolling**: Only renders visible months for optimal performance
- **Touch & Mouse Support**: Native touch gestures and mouse interactions
- **Inertia Scrolling**: Smooth momentum-based scrolling with physics
- **Dark/Light Theme**: Automatic theme switching based on system preferences
- **Responsive Design**: Adapts to different screen sizes
- **Today Highlighting**: Visual indication of current date

## 🛠 Tech Stack

### Core Technologies
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Konva.js** - 2D canvas library for React
- **Day.js** - Lightweight date manipulation library

### State Management & Architecture
- **Jotai** - Atomic state management
- **Jotai Scope** - Scoped state management for complex components

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Custom Properties** - Dynamic theming support

### Development Tools
- **Biome** - Fast linter and formatter
- **ESLint** - Code quality and consistency
- **pnpm** - Fast, disk space efficient package manager

## 🏗 Architecture & Implementation

### Core Rendering Engine
The calendar uses a sophisticated virtual scrolling system:

1. **Month Calculation**: Pre-calculates month heights and positions
2. **Visible Range Detection**: Only renders months within the viewport + preload buffer
3. **Dynamic Loading**: Extends the month cache as user scrolls
4. **Canvas Optimization**: Efficient Konva.js rendering with proper cleanup

### Key Components

#### `CanvasCalendar.tsx`
- Main calendar component with canvas rendering logic
- Handles scroll events, touch interactions, and viewport calculations
- Manages month data and rendering lifecycle

#### `AutoScroller.tsx`
- Custom inertia scrolling implementation
- Physics-based momentum with configurable friction
- Smooth deceleration for natural feel

#### `core.ts`
- Pure functions for calendar calculations
- Day positioning, month row counting, and date utilities
- Mathematical foundation for the rendering system

### Performance Optimizations

1. **Virtual Scrolling**: Only renders visible months (typically 2-3 months at a time)
2. **Canvas Layer Management**: Efficient Konva layer updates and cleanup
3. **Throttled Events**: Optimized scroll and resize event handling
4. **Memory Management**: Proper cleanup of canvas objects and event listeners

## 🎯 Implementation Challenges & Solutions

### Challenge 1: Smooth Infinite Scrolling
**Problem**: Traditional DOM-based calendars become slow with large datasets.

**Solution**: 
- Implemented virtual scrolling with canvas rendering
- Pre-calculated month heights for instant scroll positioning
- Used Konva.js for efficient 2D graphics rendering

### Challenge 2: Touch Gesture Support
**Problem**: Need native-feeling touch interactions across devices.

**Solution**:
- Built custom `AutoScroller` class with physics-based inertia
- Implemented proper touch event handling with momentum calculation
- Added configurable friction coefficients for natural feel

### Challenge 3: Performance with Large Datasets
**Problem**: Rendering thousands of days causes performance issues.

**Solution**:
- Virtual rendering: only draw visible months
- Efficient month height caching
- Optimized canvas object lifecycle management

### Challenge 4: Responsive Design
**Problem**: Calendar needs to adapt to different screen sizes.

**Solution**:
- Dynamic day width calculation based on container size
- Responsive padding and gap adjustments
- Resize observer integration for real-time updates

### Challenge 5: Theme Switching
**Problem**: Seamless dark/light theme transitions.

**Solution**:
- CSS custom properties for dynamic color switching
- Theme-aware color utilities
- System preference detection with manual override

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd canvas-calendar

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production
```bash
pnpm build
pnpm preview
```

## 📁 Project Structure

```
canvas-calendar/
├── packages/
│   └── app/                    # Main React application
│       ├── src/
│       │   ├── components/
│       │   │   └── calendar/   # Calendar components
│       │   │       ├── CanvasCalendar.tsx    # Main calendar component
│       │   │       ├── AutoScroller.tsx      # Inertia scrolling
│       │   │       ├── core.ts              # Calendar calculations
│       │   │       └── store.ts             # State management
│       │   ├── hooks/          # Custom React hooks
│       │   └── utils/          # Utility functions
│       └── package.json
├── package.json               # Root package.json
└── README.md
```

## 🤖 AI-Assisted Development

This project was primarily developed using **AI-assisted coding** with Claude Sonnet 4. The development process involved:

- **Architecture Design**: AI helped design the virtual scrolling system and component structure
- **Performance Optimization**: AI suggested canvas rendering optimizations and memory management strategies
- **Physics Implementation**: AI assisted with the inertia scrolling physics calculations
- **Code Generation**: Large portions of the core logic were generated with AI guidance
- **Problem Solving**: AI helped debug complex scrolling and rendering issues

The AI was particularly valuable for:
- Complex mathematical calculations for calendar positioning
- Canvas rendering optimization techniques
- Touch gesture handling and physics simulation
- Performance profiling and optimization strategies

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*Built with ❤️ and AI assistance*
