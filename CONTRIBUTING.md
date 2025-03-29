# Contributing to PrimePlus+

We love your input! We want to make contributing to PrimePlus+ as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`:
```bash
git clone https://github.com/Nokui8i/PrimePlus-clean.git
cd PrimePlus-clean
git checkout -b feature/your-feature-name
```

2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use Tailwind CSS for styling
- Keep components small and focused
- Write descriptive commit messages

## Component Guidelines

1. Create components in appropriate directories:
   - `components/common/` for shared UI components
   - `components/layouts/` for layout components
   - `components/[feature]/` for feature-specific components

2. Follow naming conventions:
   - Use PascalCase for component names
   - Use camelCase for functions and variables
   - Use kebab-case for file names

3. Component Structure:
   ```typescript
   // Imports
   import React from 'react';
   
   // Types/Interfaces
   interface Props {
     // ...
   }
   
   // Component
   export default function ComponentName({ prop1, prop2 }: Props) {
     // ...
   }
   ```

## Styling Guidelines

1. Use Tailwind CSS classes
2. Follow mobile-first approach
3. Support dark mode with `dark:` variants
4. Use consistent spacing and sizing
5. Follow the design system

## Project Structure

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── feed/          # Feed components
│   │   ├── layouts/       # Layout components
│   │   ├── profile/       # Profile components
│   │   └── ui/            # Reusable UI components
│   ├── pages/
│   │   ├── api/          # API routes
│   │   ├── profile/      # Profile pages
│   │   └── settings/     # Settings pages
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
└── public/               # Static assets
```

### Backend Structure
```
backend/
├── src/
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
└── tests/              # Test files
```

## Feature Implementation Guidelines

### Content Access Features
When implementing content access features:
- Always validate pricing (minimum $0.99)
- Implement both individual and subscription access
- Include proper access validation
- Add clear user feedback
- Implement proper error handling

### VR Features
When implementing VR features:
- Follow WebXR best practices
- Optimize 3D assets
- Implement proper controls
- Handle device compatibility
- Add loading states

### Live Streaming Features
When implementing streaming features:
- Use WebRTC best practices
- Implement proper error handling
- Add connection status indicators
- Handle bandwidth constraints
- Implement chat features

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md with your changes
3. The PR will be merged once you have the sign-off of maintainers

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/Nokui8i/PrimePlus-clean/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/Nokui8i/PrimePlus-clean/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License
By contributing, you agree that your contributions will be licensed under its MIT License. 