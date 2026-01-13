'use client';

import { Facebook, Instagram, Mail, Phone, MapPin, CreditCard, Truck, Shield, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="hidden sm:block bg-white border-t border-gray-200 mt-12">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 py-8 sm:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-gray-900 mb-4">Цагаан сарын цахим экспо</h3>
            <p className="text-sm text-gray-600 mb-4">
              Цагаан сарын цахим экспо
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 mb-4">Үйлчилгээ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Захиалгын дэлгэрэнгүй
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Хүргэлтийн мэдээлэл
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Буцаах болон солих
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Баталгаат үйл��илгээ
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Түгээмэл асуулт
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 mb-4">Холбоосууд</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Бидний тухай
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Дэлгүүрийн байршил
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Үйлчилгээний нөхцөл
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Нууцлалын бодлого
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  Холбоо барих
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 mb-4">Холбогдох</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">+976 7777-7777</p>
                  <p className="text-xs text-gray-500">Даваа - Баасан 9:00-18:00</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">info@tsagaan-sar.mn</p>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">Улаанбаатар хот, Сүхбаатар дүүрэг</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-gray-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-900">Үнэгүй хүргэлт</p>
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