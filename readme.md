# TwisterJS Documentation

A collection of high-quality JavaScript/TypeScript packages for modern web development.

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Available Packages](#available-packages)
- [Project Structure](#project-structure)
- [Development](#development)
- [Package Development Workflow](#package-development-workflow)
- [Architecture Decisions](#architecture-decisions)
- [Publishing](#publishing)
- [License](#license)

## Quick Start

### 🚀 Get Started in 3 Steps

#### 1. Install Dependencies

```bash
npm install
```

#### 2. See the Demo

```bash
cd examples/chat-form
npm run dev
```

Open http://localhost:5173 to see the chat-form component in action!

#### 3. Use in Your Project

```bash
npm install @twister-js/chat-form
```

```tsx
import { useChatForm } from '@twister-js/chat-form';

function MyApp() {
  const chat = useChatForm({
    template: [
      {
        output: {
          text: "Hello! What's your name?",
        },
      },
      {
        input: {
          type: 'text',
          name: 'name',
        },
      },
      {
        output: {
          text: ctx => `Nice to meet you, ${ctx.getFirstFromName('name')}!`,
        },
      },
    ],
  });

  return (
    <div>
      <div>
        {chat.messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type='text'
        disabled={chat.inputDisabled}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLInputElement;
            chat.send(target.value);
            target.value = '';
          }
        }}
        placeholder='Type your message...'
      />
    </div>
  );
}
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Available Packages

- **@twister-js/chat-form** - A flexible and customizable React chat form hook with TypeScript support. Create interactive chat-based forms with validation, conditional logic, and dynamic content.

## Project Structure

```
twister-js/
├── .changeset/                    # Changeset configuration for version management
│   └── config.json
├── .vscode/                       # VS Code workspace configuration
│   └── tasks.json
├── examples/                      # Example applications
│   └── chat-form/                 # Demo app for @twister-js/chat-form
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
├── packages/                      # All packages in the monorepo
│   └── chat-form/                 # @twister-js/chat-form package
│       ├── src/
│       │   ├── hooks/
│       │   │   └── chat-form.ts   # Main useChatForm hook
│       │   ├── index.ts           # Package exports
│       │   └── types.ts           # TypeScript interfaces
│       ├── eslint.config.mjs
│       ├── package.json
│       ├── readme.md
│       ├── rollup.config.js
│       └── tsconfig.json
├── .gitignore
├── .prettierrc
├── package.json                   # Root package.json with workspace config
├── README.md
├── tsconfig.json                  # Root TypeScript configuration
└── turbo.json                     # Turborepo configuration
```

### Key Technologies

- **npm Workspaces**: For managing multiple packages in a single repository
- **Turborepo**: For build optimization and task orchestration
- **TypeScript**: Full TypeScript support across all packages
- **Rollup**: For building and bundling packages
- **ESLint**: For code linting
- **Prettier**: For code formatting
- **Changesets**: For version management and publishing

### Package Structure

Each package follows this structure:

```
packages/[package-name]/
├── src/
│   ├── index.ts
│   └── ...
├── package.json
├── tsconfig.json
├── README.md
└── ...
```

## Development

This project uses [Turborepo](https://turbo.build/) for build system and task orchestration.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/twister-js/twister-js.git
cd twister-js
npm install
```

### 🛠️ Development Commands

```bash
npm run build        # Build all packages
npm run dev          # Development mode for all packages
npm run lint         # Lint all packages
npm run type-check   # Type check all packages
npm run format       # Format code with Prettier
```

### Demo Application

```bash
cd examples/chat-form
npm run dev          # Starts on http://localhost:5173
```

## Package Development Workflow

### Adding a New Package

1. Create a new directory under `packages/`
2. Follow the existing package structure (see chat-form as template)
3. Add the package reference to root `tsconfig.json`
4. Run `npm install` to link workspaces

### Creating a New Package

1. Create a new directory under `packages/`
2. Follow the existing package structure
3. Add the package reference to the root `tsconfig.json`
4. Run `npm install` to link the workspace

## Architecture Decisions

### npm Workspaces vs Yarn/pnpm

- Chose npm workspaces for broad compatibility and standard tooling
- No additional package manager dependencies

### Turborepo vs Lerna/Nx

- Turborepo for excellent caching and build performance
- Simpler configuration compared to Nx
- Better incremental builds

### Rollup vs webpack/esbuild

- Rollup for library bundling (tree-shaking friendly)
- Multiple output formats (CJS, ESM)
- Smaller bundle sizes for libraries

### Package Scoping

- All packages use `@twister-js/` scope
- Consistent naming and discovery
- Professional package namespace

## Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Publishing Workflow

1. Make changes to packages
2. Create changeset: `npm run changeset`
3. Version packages: `npm run version-packages`
4. Publish: `npm run release`

### Publishing Commands

```bash
# Add a changeset
npm run changeset

# Version packages
npm run version-packages

# Publish to npm
npm run release
```

## 🎯 Next Steps

1. **Add a new package**: Copy the `packages/chat-form` structure
2. **Customize the demo**: Edit `examples/chat-form/src/App.tsx`
3. **Publish packages**: Use `npm run changeset` then `npm run release`

## Available Scripts

From the root directory:

- `npm run build` - Build all packages
- `npm run dev` - Start development mode for all packages
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run format` - Format code with Prettier
- `npm run changeset` - Create a changeset for version management
- `npm run version-packages` - Version packages based on changesets
- `npm run release` - Build and publish packages

## License

MIT © TwistByte

---

Happy coding! 🎉
