<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Rules (Quick)

## Folder Tree (High-Level)

```
src/
  app/                      # Routes only (thin). No UI logic here.
    page.tsx                # imports from src/components/pages
    (dashboard)/.../page.tsx
    health/route.ts         # /health endpoint
    layout.tsx              # server: reads NEXT_LOCALE cookie, passes initialLocale
    providers.tsx           # client providers wrapper
    globals.css             # Tailwind v4 + shadcn tokens (light only)

  components/
    pages/                  # UI pages (HomePage, DashboardPage, ...)
    layouts/                # AppShell/Header/Footer
    forms/                  # Form components (login-form, ...)
    modal/                  # Feature modals (login-modal, modal-root)
    ui/                     # shadcn/ui components (DO NOT edit manually)

  providers/                # Cross-cutting providers (auth-bootstrap, intl-provider, query-provider)
  store/                    # Zustand stores (auth, modal, locale, app)
  services/                 # API services (AuthService, UserService, ...)
  lib/                      # Shared utilities (axios, base-api, locale cookies, cn/utils)
  locales/                  # next-intl messages (vi.json, en.json)
  constants/                # routes, api endpoints, cookies, locales
  enums/                    # enum-like constants
  types/                    # shared types
  utils/                    # misc helpers (tokens, permissions)
```

## Core Conventions

- App Router separation: `src/app/` chỉ khai báo route, UI nằm ở `src/components/pages/`.
- TypeScript strict: không dùng `any`. Nếu chưa rõ type, tạo type/interface đúng hoặc dùng `unknown` rồi narrow.
- Hooks: hạn chế `useEffect`/`useWatch` nếu không thật sự cần. Ưu tiên state derivation, `useMemo`, store selectors.
- UI: ưu tiên dùng shadcn/ui. Không tự viết “custom component” khi shadcn có sẵn.
- UI components policy: không sửa code trong `src/components/ui/*`.
  - Nếu thiếu component: liệt kê rõ component cần dùng trước (ví dụ: `dialog`, `card`, `input`, `label`, `separator`), rồi yêu cầu user chạy `yarn shadcn add ...` hoặc agent mới chạy sau khi user đồng ý.

## i18n (next-intl)

- Text UI không hardcode: dùng `useTranslations()` và key trong `src/locales/{vi,en}.json`.
- Locale source of truth: cookie `NEXT_LOCALE` + `src/store/locale.store.ts`.
- SSR hydration: `src/app/layout.tsx` đọc cookie và pass `initialLocale` xuống `AppProviders` → `IntlProvider(locale=...)` để server/client khớp text.

## Theming

- Light-only: không triển khai dark mode.

## API & Auth

- HTTP client: `src/lib/axios.ts` + `src/lib/base-api.ts`; gọi API qua `src/services/*`.
- Auth state: `src/store/auth.store.ts` (user/roles/permissions) + token cookies trong `src/utils/tokens.ts`.

## Env Rules

- Client env phải có prefix `NEXT_PUBLIC_` và truy cập bằng key tĩnh (không truy cập `process.env[name]` kiểu dynamic).
