# PrimePlus+ Frontend Installation Guide

This guide will help you set up and run the PrimePlus+ frontend application.

## Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)

## Installation Steps

### 1. Install Dependencies

Run the following command in the `frontend` directory:

```bash
npm install
```

This will install all required dependencies, including:
- Next.js for the frontend framework
- React for UI components
- Tailwind CSS for styling
- Other required packages

### 2. Install Tailwind CSS

For convenience, we've provided a script to install and configure Tailwind CSS:

```bash
# Windows
install-tailwind.bat

# Linux/Mac
chmod +x install-tailwind.sh
./install-tailwind.sh
```

This script will:
- Install tailwindcss, postcss, and autoprefixer
- Create the necessary configuration files
- Set up the CSS imports

### 3. Running the Development Server

Start the development server with:

```bash
npm run dev
```

This will start the Next.js development server on http://localhost:3000.

## Admin Access

For demo purposes, you can log in as an admin using:

- Email: admin@primeplus.com
- Password: Admin@PrimePlus2025

## Troubleshooting

### Duplicate Page Errors

If you see errors about duplicate pages, you may have both `.jsx` and `.tsx` files with the same name. 
To fix this:

1. Make sure only one version of each page exists (either `.jsx` or `.tsx`)
2. If needed, delete the duplicate `.tsx` files

### Module Not Found Errors

If you see "Module not found" errors:

1. Make sure all dependencies are installed by running `npm install`
2. Check that all import paths are correct (using correct path separators)
3. For specific modules like 'react-hook-form', install them with `npm install react-hook-form`

### CSS Not Loading

If Tailwind CSS styles aren't applying:

1. Make sure tailwind is installed: `npm install -D tailwindcss postcss autoprefixer`
2. Check that `postcss.config.js` and `tailwind.config.js` exist in the project root
3. Verify that `globals.css` includes the Tailwind directives

## Project Structure

- `/src/pages` - Next.js pages
- `/src/components` - Reusable React components
- `/src/context` - React context providers
- `/src/services` - API and other services
- `/src/styles` - CSS files

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://reactjs.org/docs)