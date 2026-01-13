import { Star, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import exampleImage from 'figma:asset/f7d6d44386b41c9f47dae3ede1a054b67df3075e.png';

export function StoreBanner() {
  const tabs = [
    'Home',
    'New Arrivals',
    'Best Sellers',
    'Categories',
    'Coupons',
    'VIP Zone',
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Store Info */}
        <div className="flex items-start gap-6 mb-6">
          {/* Baby Photo */}
          <div className="flex-shrink-0">
            <img
              src={typeof exampleImage === 'string' ? exampleImage : exampleImage.src}
              alt="Цагаан сарын цахим экспо"
              className="w-24 h-24 rounded-lg object-cover"
            />
          </div>

          {/* Store Details */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-gray-900">Цагаан сарын цахим экспо</h1>
              <Badge className="bg-pink-500 hover:bg-pink-500">Official</Badge>
              <Badge variant="outline" className="border-[#912F56] text-[#912F56]">
                Official Store
              </Badge>
            </div>

            <div className="flex items-center gap-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-[#912F56] text-[#912F56]"
                    />
                  ))}
                </div>
                <span className="text-sm">4.9</span>
              </div>

              {/* Followers */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">1M Followers</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div>
                  <span className="text-gray-500">Sales: </span>
                  <span className="text-[#912F56]">TOP1</span>
                </div>
                <div>
                  <span className="text-gray-500">Region: </span>
                  <span>Hangzhou, China</span>
                </div>
              </div>
            </div>

            {/* Additional Tags */}
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50">
                Factory Direct
              </Badge>
              <Badge variant="secondary" className="bg-orange-50 text-orange-600 hover:bg-orange-50">
                Ships in 1 Hour
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
                Highly Rated
              </Badge>
              <Badge variant="secondary" className="bg-purple-50 text-purple-600 hover:bg-purple-50">
                Repeat Buyer Rating 4.8+
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-100 pt-4">
          <nav className="flex items-center gap-8">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`pb-2 transition-colors ${
                  index === 0
                    ? 'border-b-2 border-[#912F56] text-[#912F56]'
                    : 'text-gray-600 hover:text-[#912F56]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
