'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  CheckCircle2,
  ArrowLeft,
  Info,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

interface FormData {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  facebook?: string;
  instagram?: string;
}

export default function OpenStorePage() {
  const router = useRouter();
  const [step, setStep] = useState<'guide' | 'form'>('guide');
  const [formData, setFormData] = useState<FormData>({
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    facebook: '',
    instagram: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Phone number validation: only numbers, max 8 digits
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      const limitedValue = digitsOnly.slice(0, 8);
      setFormData({
        ...formData,
        phone: limitedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Дэлгүүрийн нэрийг оруулна уу';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Эзэмшлийн нэрийг оруулна уу';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Имэйл хаягийг оруулна уу';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Зөв имэйл хаяг оруулна уу';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Утасны дугаарыг оруулна уу';
    } else if (formData.phone.length !== 8) {
      newErrors.phone = 'Утасны дугаар 8 оронтой тоо байх ёстой';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Хаягийг оруулна уу';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Дэлгүүрийн тайлбарыг оруулна уу';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Тайлбар хамгийн багадаа 50 тэмдэгт байх ёстой';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          storeName: '',
          ownerName: '',
          email: '',
          phone: '',
          address: '',
          description: '',
          facebook: '',
          instagram: '',
        });
        setStep('guide');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onMenuClick={() => {}}
        onStoreListClick={() => router.push('/stores')}
        onCartClick={() => {}}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Буцах</span>
        </button>

        {/* Step Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setStep('guide')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              step === 'guide'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Заавар
          </button>
          <button
            onClick={() => setStep('form')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              step === 'form'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Дэлгүүр нээх хүсэлт
          </button>
        </div>

        {/* Guide Step */}
        {step === 'guide' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl text-gray-900">
                Дэлгүүр нээх заавар
              </h1>
            </div>

            <div className="space-y-6">
              <div className="prose max-w-none">
                <h2 className="text-xl text-gray-900 mb-4">Дэлгүүр нээх шаардлага</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Дэлгүүрийн нэр, тайлбар</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Эзэмшлийн мэдээлэл (нэр, утас, имэйл)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Хаяг мэдээлэл</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Сошиал медиа хаягууд (сонголттой)</span>
                  </li>
                </ul>

                <h2 className="text-xl text-gray-900 mt-8 mb-4">Хэрхэн ажилладаг вэ?</h2>
                <ol className="space-y-4 text-gray-700 list-decimal list-inside">
                  <li className="pl-2">
                    <strong>Хүсэлт илгээх:</strong> Дэлгүүрийн мэдээлэл бүрэн бөглөнө
                  </li>
                  <li className="pl-2">
                    <strong>Шалгалт:</strong> Бид таны хүсэлтийг шалгаж, баталгаажуулна
                  </li>
                  <li className="pl-2">
                    <strong>Баталгаажуулалт:</strong> Имэйл эсвэл утасаар танд мэдэгдэх болно
                  </li>
                  <li className="pl-2">
                    <strong>Дэлгүүр нээх:</strong> Баталгаажсны дараа таны дэлгүүр идэвхжнэ
                  </li>
                </ol>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">
                        Анхаар
                      </h3>
                      <p className="text-sm text-blue-800">
                        Хүсэлт илгээсний дараа 1-2 ажлын өдрийн дотор танд хариу өгөх болно. 
                        Бүх мэдээлэл зөв, бүрэн байх ёстой.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setStep('form')}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Дэлгүүр нээх хүсэлт илгээх
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl text-gray-900 mb-2">Хүсэлт амжилттай илгээгдлээ!</h2>
                <p className="text-gray-600 mb-6">
                  Бид таны хүсэлтийг шалгаж, 1-2 ажлын өдрийн дотор танд хариу өгөх болно.
                </p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setStep('guide');
                  }}
                  variant="outline"
                >
                  Буцах
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl text-gray-900">
                    Дэлгүүр нээх хүсэлт
                  </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Store Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" />
                      Дэлгүүрийн нэр <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleInputChange}
                      placeholder="Жишээ: Миний дэлгүүр"
                      required
                      className={errors.storeName ? 'border-red-500' : ''}
                    />
                    {errors.storeName && (
                      <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>
                    )}
                  </div>

                  {/* Owner Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Эзэмшлийн нэр <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Жишээ: Батбаяр"
                      required
                      className={errors.ownerName ? 'border-red-500' : ''}
                    />
                    {errors.ownerName && (
                      <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      Имэйл хаяг <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      required
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Утасны дугаар <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="99991111"
                      required
                      maxLength={8}
                      pattern="[0-9]{8}"
                      inputMode="numeric"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    )}
                    {formData.phone && formData.phone.length !== 8 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Утасны дугаар 8 оронтой тоо байх ёстой
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Хаяг <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Дэлгэрэнгүй хаяг оруулна уу"
                      required
                      rows={3}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Дэлгүүрийн тайлбар <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Дэлгүүрийн тайлбар, үйлчилгээний тайлбар оруулна уу (хамгийн багадаа 50 тэмдэгт)"
                      required
                      rows={5}
                      className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                        errors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.description.length}/50 тэмдэгт
                    </p>
                  </div>

                  {/* Social Media (Optional) */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">
                      Сошиал медиа хаягууд (сонголттой)
                    </h3>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Facebook
                      </label>
                      <Input
                        name="facebook"
                        type="url"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Instagram
                      </label>
                      <Input
                        name="instagram"
                        type="url"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep('guide')}
                      className="flex-1"
                    >
                      Буцах
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      {isSubmitting ? 'Илгээж байна...' : 'Хүсэлт илгээх'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

