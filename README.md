# PrimePlus+ Platform

A modern content creation and sharing platform built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Content Creation
- **Text Posts**: Share thoughts and updates
- **Media Posts**:
  - Images (up to 2GB)
  - Videos (up to 10GB)
  - Custom thumbnails for videos (up to 100MB)
- **VR Experiences**: Create and share VR content
- **360° Content**: Upload and view 360-degree content
- **Live Streaming**: Go live with your audience

### Post Management
- Description/caption support
- Allow/disable comments
- Tip settings for monetization
- Creator verification system

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React Hooks
- **Media Handling**: Custom MediaUpload component
- **Icons**: Heroicons

## Project Structure

```
primePlus-clean/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── (authenticated)/
│   │   │       ├── feed/
│   │   │       ├── profile/
│   │   │       └── settings/
│   │   ├── components/
│   │   │   ├── feed/
│   │   │   ├── shared/
│   │   │   ├── vr/
│   │   │   ├── 360/
│   │   │   └── live/
│   │   └── lib/
├── backend/
└── docs/
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Visit `http://localhost:3000`

## Documentation

- [UI/UX Design Guidelines](./docs/DESIGN.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [API Documentation](./docs/API.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

## Contributing

Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
