# Next.js Migration Guide

## Шилжилтийн тойм

React SPA → Next.js 14 App Router бүтэц рүү шилжүүлсэн.

## Гол өөрчлөлтүүд

### 1. Файлын бүтэц

**Өмнө:**
```
/App.tsx                    # Main entry
/components/**              # All components
/styles/globals.css        # Global styles
```

**Одоо:**
```
/app/                       # Next.js App Router
  ├── layout.tsx           # Root layout
  ├── page.tsx             # Home page
  ├── products/[id]/
  │   └── page.tsx         # Dynamic route
  └── stores/
      └── page.tsx         # Static route
/components/**              # Shared components
/styles/globals.css        # Global styles
```

### 2. Routing

**Өмнө (Client-side state):**
```tsx
const [currentPage, setCurrentPage] = useState('home');

if (currentPage === 'productDetail') {
  return <ProductDetailPage />;
}
```

**Одоо (File-based routing):**
```tsx
// app/page.tsx - Home
// app/products/[id]/page.tsx - Product Detail
// app/stores/page.tsx - Store List

router.push('/products/123');
```

### 3. Navigation

**Өмнө:**
```tsx
setCurrentPage('productDetail');
setSelectedProduct(product);
```

**Одоо:**
```tsx
import { useRouter } from 'next/navigation';

const router = useRouter();
router.push(`/products/${product.id}`);
```

### 4. State Management

**Өмнө (Component state):**
```tsx
const [storeFilter, setStoreFilter] = useState(null);
```

**Одоо (URL-based state):**
```tsx
// Set filter
router.push(`/?storeId=1&storeName=StoreName`);

// Read filter
const searchParams = useSearchParams();
const storeId = searchParams.get('storeId');
```

### 5. Import Paths

**Өмнө:**
```tsx
import { Header } from './components/Header';
import { Button } from './components/ui/button';
```

**Одоо:**
```tsx
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
```

### 6. Client/Server Components

**Default Server Component:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return <html>...</html>;
}
```

**Client Component (interactive):**
```tsx
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [state, setState] = useState(null);
  // ...
}
```

## Давуу талууд

### 1. **SEO Optimization**
- Server-side rendering
- Metadata management
- Better crawlability

### 2. **Performance**
- Automatic code splitting
- Image optimization
- Font optimization
- Streaming SSR

### 3. **Developer Experience**
- File-based routing
- Better TypeScript support
- Built-in optimizations
- API routes support

### 4. **Scalability**
- Easy to add new pages
- Organized file structure
- Clear separation of concerns

## Хэрэглэх команд

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## Шинэ features нэмэх

### Шинэ хуудас нэмэх:

1. Create file: `app/new-page/page.tsx`
```tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

2. Navigate:
```tsx
router.push('/new-page');
```

### Dynamic route нэмэх:

1. Create: `app/categories/[slug]/page.tsx`
```tsx
export default function CategoryPage({ params }) {
  const { slug } = params;
  return <div>Category: {slug}</div>;
}
```

2. Navigate:
```tsx
router.push('/categories/calendars');
```

### API route нэмэх:

1. Create: `app/api/products/route.ts`
```tsx
export async function GET() {
  return Response.json({ products: [] });
}
```

## Environment Variables

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```

Access in code:
```tsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other platforms
```bash
npm run build
# Upload .next/, public/, etc.
```

## Тэмдэглэл

1. **Client Components** (`'use client'`) шаардлагатай:
   - useState, useEffect ашиглах үед
   - Browser APIs (window, localStorage)
   - Event handlers (onClick, onChange)
   - Custom hooks

2. **Server Components** (default):
   - Data fetching
   - Database queries
   - Sensitive information
   - Large dependencies

3. **Metadata:**
```tsx
export const metadata = {
  title: 'Page Title',
  description: 'Page description',
};
```

## Troubleshooting

### "use client" алдаа
```tsx
// Add at top of file
'use client';
```

### Import path алдаа
```tsx
// Use @ alias
import { Component } from '@/components/Component';
```

### Hydration алдаа
- Server/client rendering ялгаа байна
- useEffect ашиглаж client-side л рендерлэ

## Next Steps

- [ ] API routes нэмэх
- [ ] Database холболт
- [ ] Authentication
- [ ] Image optimization
- [ ] Internationalization (i18n)
- [ ] Analytics
- [ ] Error boundaries
- [ ] Loading states
- [ ] Middleware
