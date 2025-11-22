# Phase 1: Foundational Setup & Architecture

## Overview
Establish a robust, scalable foundation for the Engineering Hub platform with modern tooling, TypeScript support, and monorepo structure.

## Objectives
- Convert to TypeScript for type safety
- Implement monorepo structure
- Set up comprehensive development tooling
- Establish coding standards and automation

## Technology Stack

### Core Technologies
- **Language**: TypeScript 5.x
- **Monorepo Tool**: Turborepo or Nx
- **Package Manager**: pnpm (for efficient workspace management)
- **Node.js**: v20.x LTS

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **lint-staged**: Pre-commit validation
- **commitlint**: Commit message standards

## Implementation Steps

### 1. Project Restructuring

```
engineering-hub/
├── packages/
│   ├── frontend/           # Next.js application
│   ├── backend/            # Express API
│   ├── shared/             # Shared types and utilities
│   ├── ui/                 # Component library
│   └── config/             # Shared configs (ESLint, TS, etc.)
├── apps/
│   └── docs/               # Documentation site (optional)
├── turbo.json              # Turborepo configuration
├── package.json            # Root package.json
├── pnpm-workspace.yaml     # pnpm workspace config
└── tsconfig.base.json      # Base TypeScript config
```

### 2. TypeScript Configuration

**Root tsconfig.base.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
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
```

**Frontend tsconfig.json (Next.js):**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Backend tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "commonjs",
    "target": "ES2022",
    "paths": {
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 3. Turborepo Configuration

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

### 4. ESLint Configuration

**packages/config/eslint-preset.js:**
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'import'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': { 'order': 'asc' }
    }]
  },
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {}
    }
  }
};
```

### 5. Prettier Configuration

**.prettierrc:**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 6. Husky Setup

**.husky/pre-commit:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm lint-staged
```

**package.json (root):**
```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 7. Commitlint Configuration

**commitlint.config.js:**
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Code refactoring
        'perf',     // Performance improvement
        'test',     // Tests
        'chore',    // Maintenance
        'ci',       // CI/CD changes
        'build'     // Build system
      ]
    ]
  }
};
```

### 8. Shared Package Structure

**packages/shared/src/types/index.ts:**
```typescript
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  tags: string[];
  author: Author;
  featuredImage: string;
  publishedAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  categories: string[];
  emailNotifications: boolean;
}
```

### 9. Root Package Scripts

**package.json:**
```json
{
  "name": "engineering-hub",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "turbo run type-check",
    "test": "turbo run test",
    "prepare": "husky install",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "@commitlint/cli": "^18.4.3",
    "@commitlint/config-conventional": "^18.4.3",
    "@typescript-eslint/eslint-plugin": "^6.13.2",
    "@typescript-eslint/parser": "^6.13.2",
    "eslint": "^8.55.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "prettier": "^3.1.0",
    "turbo": "^1.11.2",
    "typescript": "^5.3.3"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.12.0"
}
```

### 10. pnpm Workspace Configuration

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

## Migration Steps

1. **Install pnpm globally:**
   ```bash
   npm install -g pnpm
   ```

2. **Initialize new structure:**
   ```bash
   mkdir -p packages/{frontend,backend,shared,ui,config}
   ```

3. **Move existing code:**
   ```bash
   mv frontend packages/frontend
   mv backend packages/backend
   ```

4. **Install dependencies:**
   ```bash
   pnpm install
   ```

5. **Run type checking:**
   ```bash
   pnpm type-check
   ```

6. **Test development:**
   ```bash
   pnpm dev
   ```

## Testing & Validation

- ✅ All packages build without errors
- ✅ Type checking passes across all packages
- ✅ ESLint rules enforced
- ✅ Prettier formatting applied
- ✅ Git hooks functioning
- ✅ Commit messages validated
- ✅ Development servers start correctly

## Benefits

1. **Type Safety**: TypeScript catches errors at compile time
2. **Code Quality**: Automated linting and formatting
3. **Faster Builds**: Turborepo caching and parallel execution
4. **Shared Code**: Common types and utilities
5. **Scalability**: Easy to add new packages
6. **Developer Experience**: Consistent tooling and standards

## Next Phase

Once Phase 1 is complete, proceed to **Phase 2: Advanced UI/UX and Design System** to build the Interesting Engineering lookalike interface.
