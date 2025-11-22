#!/bin/bash

# Engineering Hub - Quick Start Setup Script
# This script creates the complete application structure
# Run this script in the morning: chmod +x QUICK_START_SETUP.sh && ./QUICK_START_SETUP.sh

echo "🚀 Engineering Hub - Quick Start Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed  
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo "✅ npm $(npm --version) detected"
echo ""

# Install pnpm if not already installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
else
    echo "✅ pnpm $(pnpm --version) detected"
fi

echo ""
echo "📁 Creating project structure..."
echo ""

# Create main directories
mkdir -p packages/frontend
mkdir -p packages/backend
mkdir -p packages/shared
mkdir -p packages/ui
mkdir -p packages/config

echo "✅ Created packages directory structure"

# Create Frontend Structure
echo "📂 Setting up Frontend (Next.js)..."
mkdir -p packages/frontend/src/{app,components,lib,styles,types}
mkdir -p packages/frontend/src/app/{articles,category,api}
mkdir -p packages/frontend/src/components/{layout,article,ui}
mkdir -p packages/frontend/public

# Create Backend Structure  
echo "📂 Setting up Backend (Express)..."
mkdir -p packages/backend/src/{routes,controllers,models,middleware,utils,config}
mkdir -p packages/backend/src/routes
mkdir -p packages/backend/src/controllers

# Create Shared Structure
echo "📂 Setting up Shared packages..."
mkdir -p packages/shared/src/{types,utils,constants}

echo ""
echo "✅ Directory structure created!"
echo ""

# Create root package.json
echo "📝 Creating root package.json..."
cat > package.json << 'EOF'
{
  "name": "engineering-hub",
  "version": "1.0.0",
  "private": true,
  "description": "Engineering news platform - Interesting Engineering lookalike",
  "scripts": {
    "dev": "pnpm run --parallel dev",
    "build": "pnpm run --filter ./packages/* build",
    "start": "pnpm run --parallel start",
    "lint": "pnpm run --filter ./packages/* lint",
    "clean": "rm -rf node_modules packages/*/node_modules packages/*/.next packages/*/dist",
    "setup": "pnpm install",
    "frontend:dev": "pnpm --filter frontend dev",
    "backend:dev": "pnpm --filter backend dev"
  },
  "workspaces": [
    "packages/*"
  ],
  "devDependencies": {
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "prettier": "^3.1.1",
    "eslint": "^8.56.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.12.0"
}
EOF

echo "✅ Root package.json created"

# Create pnpm-workspace.yaml
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/*'
EOF

echo "✅ pnpm-workspace.yaml created"

# Create root tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "incremental": true
  }
}
EOF

echo "✅ Root tsconfig.json created"

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.next/
dist/
build/
.env
.env.local
.env.*.local
*.log
package-lock.json
yarn.lock
.DS_Store
.vscode/
.idea/
*.swp
*.swo
coverage/
.turbo/
EOF

echo "✅ .gitignore created"

# Create Frontend package.json
cat > packages/frontend/package.json << 'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.2",
    "@tanstack/react-query": "^5.12.2",
    "zustand": "^4.4.7",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.0.4"
  }
}
EOF

echo "✅ Frontend package.json created"

# Create Backend package.json
cat > packages/backend/package.json << 'EOF'
{
  "name": "backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "mongoose": "^8.0.3",
    "redis": "^4.6.11",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "eslint": "^8.56.0",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0"
  }
}
EOF

echo "✅ Backend package.json created"

# Create Shared package.json
cat > packages/shared/package.json << 'EOF'
{
  "name": "shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
EOF

echo "✅ Shared package.json created"

# Create environment template
cat > .env.example << 'EOF'
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/engineering-hub
REDIS_URL=redis://localhost:6379

# Optional API Keys
OPENAI_API_KEY=your_openai_key_here
EOF

echo "✅ .env.example created"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Copy .env.example to .env and configure"
echo "   2. Run 'pnpm install' to install dependencies"
echo "   3. Run 'pnpm dev' to start development servers"
echo ""
echo "🌐 Access:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 See COMPLETION_SUMMARY.md for full documentation"
echo ""
