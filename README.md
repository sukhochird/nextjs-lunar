# TinyClub E-Commerce - Next.js Application

Календар, наалдац, дижитал хэвлэл зориулалттай Монголын онлайн дэлгүүр.

## 🚀 Технологи

- **Next.js 14** - App Router ашигласан
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.0** - Styling
- **Lucide React** - Icons

## 📁 Файлын бүтэц

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Нүүр хуудас
│   ├── products/
│   │   └── [id]/
│   │       └── page.tsx    # Бүтээгдэхүүний дэлгэрэнгүй хуудас
│   └── stores/
│       └── page.tsx        # Дэлгүүрийн жагсаалт
├── components/
│   ├── Header.tsx
│   ├── CategorySidebar.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductDetailPage.tsx
│   ├── StoreListPage.tsx
│   └── ui/                 # UI components (shadcn/ui)
├── styles/
│   └── globals.css
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🎯 Онцлог функцууд

### Нүүр хуудас (`/`)
- Бүтээгдэхүүний жагсаалт (4 багана)
- Категорийн sidebar (desktop), drawer (mobile)
- Дэлгүүрээр шүүх функц
- Responsive grid layout

### Дэлгүүрийн жагсаалт (`/stores`)
- 8 дэлгүүр
- Үнэлгээ, дагагч, борлуулалт мэдээлэл
- Хайлтын функц
- Дэлгүүр сонгоход нүүр хуудас руу filter-тэй буцна

### Бүтээгдэхүүний дэлгэрэнгүй (`/products/[id]`)
- Зургийн галлерей
- Хувилбар сонголт
- Тоо ширхэг
- Борлуулагчийн мэдээлэл
- Үнэлгээ, сэтгэгдэл
- Хүргэлтийн мэдээлэл

## 🛠️ Суулгах заавар

1. **Dependencies суулгах:**
```bash
npm install
```

2. **Development server ажиллуулах:**
```bash
npm run dev
```

3. **Вэб хөтөч дээр нээх:**
```
http://localhost:3000
```

## 📦 Build хийх

```bash
npm run build
npm start
```

## 🎨 Өнгөний схем

- **Primary:** `#912F56` (Burgundy)
- **Secondary:** Gray scale
- **Accent:** Pink, Blue, Orange

## 🔗 Routing бүтэц

- `/` - Нүүр хуудас
- `/stores` - Дэлгүүрийн жагсаалт
- `/products/[id]` - Бүтээгдэхүүний дэлгэрэнгүй
- `/?storeId=1&storeName=StoreName` - Дэлгүүрээр шүүсэн нүүр хуудас

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Mobile Support

- iOS Safari
- Chrome Mobile
- Samsung Internet

## 🔄 State Management

- React hooks (useState, useEffect)
- URL-based state for filters
- Next.js navigation

## ⚡ Performance

- Server Components (where possible)
- Client Components for interactivity
- Image optimization with Next.js Image
- Code splitting by route

## 🛣️ Migration Notes

Хуучин React бүтцээс Next.js рүү шилжсэн:

- ✅ App Router бүтэц
- ✅ File-based routing
- ✅ TypeScript configuration
- ✅ Path aliases (@/*)
- ✅ Client/Server components
- ✅ URL-based state management

## 📄 License

Private - TinyClub Brand Store
