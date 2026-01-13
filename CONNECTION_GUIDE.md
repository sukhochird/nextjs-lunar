# Frontend-Backend Connection Guide

This guide explains how the frontend is connected to the Django backend API.

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root of your Next.js project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 2. Start the Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### 3. Start the Frontend

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Connected Components

### ProductGrid
- **File**: `components/ProductGrid.tsx`
- **API Endpoint**: `GET /api/products/`
- **Features**: 
  - Fetches products on mount
  - Filters by storeId when provided
  - Shows loading and error states

### ProductDetailPage
- **File**: `app/products/[id]/page.tsx`
- **API Endpoint**: `GET /api/products/{id}/`
- **Features**:
  - Fetches product by ID or slug
  - Converts API response to frontend format
  - Handles loading and error states

### StoreListPage
- **File**: `components/StoreListPage.tsx`
- **API Endpoint**: `GET /api/stores/`
- **Features**:
  - Fetches all stores
  - Search functionality
  - Converts API response to frontend format

## API Client

The API client is located at `lib/api.ts` and provides:

- Type-safe API functions
- Data conversion utilities
- Error handling
- Consistent response formatting

## Data Flow

1. **Component mounts** → Calls API function from `lib/api.ts`
2. **API function** → Fetches data from Django backend
3. **Response** → Converted to frontend format using helper functions
4. **State update** → Component re-renders with new data

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
- Backend is running on `http://localhost:8000`
- Frontend is running on `http://localhost:3000`
- CORS settings in `backend/config/settings.py` include your frontend URL

### API Not Found
- Check that the backend server is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for exact error messages

### No Data Showing
- Check backend has data (use Django admin or create sample data)
- Verify API endpoints are working (test with curl or Postman)
- Check browser network tab for API responses

## Testing the Connection

1. Start backend: `python manage.py runserver`
2. Start frontend: `npm run dev`
3. Visit `http://localhost:3000`
4. Check browser console and network tab for API calls
5. Products should load from the backend

## Next Steps

- Add more API endpoints as needed
- Implement caching for better performance
- Add error boundaries for better error handling
- Consider using React Query or SWR for data fetching

