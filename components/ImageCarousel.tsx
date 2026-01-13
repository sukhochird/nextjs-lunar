'use client';

import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  onImageChange?: (index: number) => void;
  currentIndex?: number;
  selectedImage?: number;
  setSelectedImage?: (index: number) => void;
  discount?: number;
}

export function ImageCarousel({ 
  images, 
  alt = "Product image", 
  onImageChange, 
  currentIndex = 0,
  selectedImage,
  setSelectedImage,
  discount 
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(selectedImage !== undefined ? selectedImage : currentIndex);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedImage !== undefined) {
      setActiveIndex(selectedImage);
    } else {
      setActiveIndex(currentIndex);
    }
  }, [currentIndex, selectedImage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      goToNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      goToPrev();
    }
  };

  const goToNext = () => {
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    if (onImageChange) {
      onImageChange(newIndex);
    }
    if (setSelectedImage) {
      setSelectedImage(newIndex);
    }
  };

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    if (onImageChange) {
      onImageChange(newIndex);
    }
    if (setSelectedImage) {
      setSelectedImage(newIndex);
    }
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    if (onImageChange) {
      onImageChange(index);
    }
    if (setSelectedImage) {
      setSelectedImage(index);
    }
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0">
              <ImageWithFallback
                src={image}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex
                ? 'bg-primary scale-125'
                : 'bg-gray-300 hover:bg-primary/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Discount Badge */}
      {discount && (
        <Badge
          className="absolute top-3 left-3 z-20"
          color="red"
        >
          {discount}% off
        </Badge>
      )}
    </div>
  );
}