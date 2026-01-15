'use client';

import { CreditCard, Truck, Shield, Award, Phone, Mail, MapPin } from 'lucide-react';
import logoImage from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="hidden sm:block bg-white border-t border-gray-200 mt-12">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-8 sm:py-12">
        {/* Logo and Contact Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={typeof logoImage === 'string' ? logoImage : logoImage.src}
              alt="Цагаан сарын цахим экспо"
              className="h-12 sm:h-16 object-cover"
            />
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Цагаан сарын цахим экспо</h2>
              <p className="text-sm text-gray-500">Онлайн дэлгүүр</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Утас</p>
                <p className="text-sm text-gray-900">99429967</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Имэйл</p>
                <p className="text-sm text-gray-900">dsukhochir@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Хаяг</p>
                <p className="text-sm text-gray-900">Улаанбаатар хот</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-gray-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Шуурхай хүргэлт</p>
              <p className="text-xs text-gray-500">50,000₮-с дээш</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Найдвартай төлбөр</p>
              <p className="text-xs text-gray-500">100% аюулгүй</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Баталгаат чанар</p>
              <p className="text-xs text-gray-500">Албан ёсны бүтээгдэхүүн</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Олон төлбөрийн хэрэгсэл</p>
              <p className="text-xs text-gray-500">Карт, Qpay, Данс</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© 2026 Цагаан сарын цахим экспо. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
              alt="Visa"
              className="h-6 object-contain opacity-60"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
              alt="Mastercard"
              className="h-6 object-contain opacity-60"
            />
            <div className="px-3 py-1 border border-gray-300 rounded text-xs text-gray-600">
              QPay
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
