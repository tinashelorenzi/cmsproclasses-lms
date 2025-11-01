# CMS Frontend

React + TypeScript frontend for Capital Mathematics Studies LMS.

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Development server runs on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Build output will be in `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v3** - Utility-first CSS framework
- **Radix UI** - Headless UI primitives
- **lucide-react** - Icon library
- **class-variance-authority** - Component variant management
- **clsx + tailwind-merge** - Conditional class utilities

## Project Structure

```
Frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images, icons, etc.
│   ├── components/  # React components
│   ├── lib/         # Utility functions
│   ├── ui/          # Reusable UI components
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # Entry point
│   └── index.css    # Global styles + Tailwind imports
├── index.html       # HTML template
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## Tailwind Custom Colors

The project uses custom Tailwind colors for brand consistency:

- `cms-primary` - `#0178c5` (Blue)
- `cms-secondary` - `#ffcf00` (Gold/Yellow)
- `cms-dark` - `#000004` (Near Black)
- `cms-white` - `#ffffff` (White)

Use them in your components like:
```tsx
<div className="bg-cms-primary text-white">...</div>
```

## Component Utilities

The project uses utility functions for better developer experience:

- `cn()` - Utility function from `@/lib/utils` for merging Tailwind classes
- Path alias `@/` - Refers to `./src` directory

Example:
```tsx
import { cn } from "@/lib/utils"

<div className={cn("base-classes", condition && "conditional-classes")}>
  Content
</div>
```

## API Integration

Backend API endpoints are at `http://localhost:8000/api/`. Configure API base URL as needed.
