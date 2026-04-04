# QStack Frontend

> **Ask. Solve. Grow Together.**

A modern developer Q&A platform built with Next.js, enabling developers to ask technical questions, share knowledge, vote on content, build reputation, and maintain personalized feeds based on preferred tags.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Authentication** — Sign up, sign in, email verification, forgot/reset password flows
- **Question Management** — Create, read, update, delete questions with rich text editor and tags
- **Answer System** — Post, edit, delete answers with accepted answer highlighting
- **Comment System** — Add, edit, delete comments on answers
- **Voting System** — Upvote/downvote questions and track reputation
- **Personalized Feed** — AI-powered feed based on user preferences and activity
- **Search & Filtering** — Debounced search, tag filtering, and sorting options
- **User Profiles** — Profile management with activity history and settings
- **Community** — Browse community members and view public profiles
- **Dark Theme** — GitHub-inspired design system with CSS custom properties

---

## Tech Stack

| Category              | Technology                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------- |
| **Framework**         | [Next.js 14.2.35](https://nextjs.org/) (App Router)                                         |
| **Language**          | [TypeScript 5](https://www.typescriptlang.org/) (strict mode)                               |
| **UI Library**        | [React 18](https://react.dev/)                                                              |
| **Component Library** | [Ant Design 6](https://ant.design/)                                                         |
| **Styling**           | [Tailwind CSS 3](https://tailwindcss.com/) + CSS Variables                                  |
| **State Management**  | [Redux Toolkit](https://redux-toolkit.js.org/) + [React-Redux](https://react-redux.js.org/) |
| **Rich Text Editor**  | [TipTap](https://tiptap.dev/) (with syntax highlighting & image upload)                     |
| **Markdown**          | react-markdown, @uiw/react-md-editor                                                        |
| **Font**              | Geist Sans + Geist Mono                                                                     |

---

## Project Structure

```
qstack-frontend/
├── app/                    # Next.js App Router (pages & layouts)
│   ├── layout.tsx          # Root layout with providers, navbar, sidebar
│   ├── page.tsx            # Landing page (public)
│   ├── home/               # Main question feed (authenticated)
│   ├── feed/               # Personalized feed with pagination
│   ├── profile/            # User profile with tabs
│   ├── question/[id]/      # Question detail view
│   ├── users/              # Community members listing
│   └── ...                 # Auth pages (reset-password, verify-email)
├── components/             # React components
│   ├── answer/             # Answer-related components
│   ├── auth/               # Authentication components
│   ├── comment/            # Comment-related components
│   ├── common/             # Shared components (navbar, sidebar, editor)
│   ├── landing/            # Landing page components
│   ├── profile/            # Profile page components
│   └── question/           # Question-related components
├── api/                    # API client functions
│   ├── auth.ts             # Authentication endpoints
│   ├── question.ts         # Question endpoints
│   ├── answer.ts           # Answer endpoints
│   ├── comment.ts          # Comment endpoints
│   └── user.ts             # User endpoints
├── store/                  # Redux Toolkit state management
│   ├── index.ts            # Store configuration
│   ├── hooks.ts            # Typed Redux hooks
│   ├── auth/               # Auth slice & thunks
│   ├── question/           # Question slices
│   └── user/               # User slice & thunks
├── types/                  # TypeScript interfaces
├── utils/                  # Helper utilities
├── public/                 # Static assets
└── ...                     # Config files
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Backend API** running (see [Environment Configuration](#-environment-configuration))

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd qstack-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## Available Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## Environment Configuration

The application requires the following environment variable:

| Variable                   | Description          | Example                        |
| -------------------------- | -------------------- | ------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:8080/api/v1` |

> **Note:** The application uses HTTP-only cookies for authentication. Ensure your backend API sets cookies correctly on the same domain or configures CORS with credentials.

### Expected Backend API Endpoints

The frontend expects the following API endpoints:

**Authentication**

- `POST /auth/login`
- `POST /auth/signup`
- `POST /auth/logout`
- `POST /auth/verify-email`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/change-password`
- `GET /users/me`

**Questions**

- `GET /questions`
- `POST /questions`
- `GET /questions/{id}`
- `PUT /questions/{id}`
- `DELETE /questions/{id}`
- `GET /questions/my`
- `GET /questions/my-feed`
- `POST /questions/{id}/vote`

**Tags & Community**

- `GET /tags/popular`
- `GET /users/community/stats`

**Answers**

- `GET /answers/question/{questionId}`
- `POST /answers`
- `PUT /answers/{id}`
- `DELETE /answers/{id}`
- `POST /answers/{id}/accept`

**Comments**

- `GET /comments/answer/{answerId}`
- `POST /comments`
- `PUT /comments/{id}`
- `DELETE /comments/{id}`

**Users**

- `GET /users`
- `GET /users/{id}/profile`
- `PUT /users/profile`
- `GET /users/{id}/activity`
- `POST /users/profile/image`
- `POST /upload`

---

## Design System

The application features a **GitHub-inspired dark theme** built with CSS custom properties:

- **Semantic tokens** for backgrounds, surfaces, borders, and text
- **Status colors** for success, warning, error, and info states
- **Interaction states** for hover, active, focus, and disabled
- **Ant Design component overrides** for consistent styling

Customize the theme by modifying `app/globals.css` and `tailwind.config.ts`.

---

## Authentication

The application uses **cookie-based authentication** with HTTP-only cookies:

1. On app load, `AuthInitializer` checks authentication by calling `/users/me`
2. All mutating requests and session-checking requests use `credentials: "include"`
3. Auth state is managed in Redux (`authSlice`)

---

## State Management

State is managed using **Redux Toolkit** with the following slices:

- **`auth`** — User authentication state and async thunks
- **`questionFeed`** — Main question feed with pagination
- **`questionVote`** — Question voting state
- **`myQuestions`** — User's questions with pagination
- **`user`** — User profile and async thunks

Typed hooks (`useAppDispatch`, `useAppSelector`) are provided in `store/hooks.ts`.

---

## Deployment

The application can be deployed to any platform that supports Next.js:

- **[Vercel](https://vercel.com/)** — Recommended for Next.js apps
- **[Netlify](https://www.netlify.com/)**
- **[AWS](https://aws.amazon.com/)**
- **[Docker](https://www.docker.com/)**

### Build for Production

```bash
npm run build
npm run start
```

Ensure `NEXT_PUBLIC_API_BASE_URL` is set to your production backend URL.

---

## Future Improvements

The following enhancements are planned for future releases:

- **Logout State Management** — Resolve logout state synchronization issues to ensure consistent behavior across all components
- **Profile Image Integration** — Replace avatar placeholders with actual user profile images throughout the application for a more personalized experience

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For support, please open an issue in the repository or contact the development team.

---

**Built with Next.JS**
