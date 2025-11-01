#!/bin/bash
# Build script for Vercel deployment

# Install dependencies
npm install

# Build the application
npm run build

# Output build info
echo "Build completed successfully!"
ls -la dist/
