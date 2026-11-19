import React, { useState, useEffect } from 'react';
import {
  CalendarPlus,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
  Scale,
  Clock,
  MapPin,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import {
  LaundryBooking,
  StudentProfile,
  BASE_PRICE_PER_KG,
  ScreenId,
} from '../types';
import {
  DGU_HOSTELS_AND_PGS,
  PICKUP_TIME_SLOTS,
  formatINR,
} from '../data/mockData';

interface BookPickupScreenProps {
  profile: StudentProfile;
  presetWeight?: number | null;
  onCreateBooking: (booking: LaundryBooking) => void;
  onNavigate: (screen: ScreenId) => void;
  onTrackOrder: (orderId: string) => void;
}

interface FormErrors {
  studentName?: string;
  mobileNumber?: string;
  hostelOrPgName?: string;
  pickupAddress?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  estimatedWeightKg?: string;
}

export const BookPickupScreen: React.FC<BookPickupScreenProps> = ({
  profile,
  presetWeight,
  onCreateBooking,
  onNavigate,
  onTrackOrder,
}) => {
  const todayStr = '2026-10-01';

  const [studentName, setStudentName] = useState(profile.studentName);
  const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber);
  const [hostelOrPgName, setHostelOrPgName] = useState(profile.hostelOrPgName);
  const [pickupAddress, setPickupAddress] = useState(profile.pickupAddress);
  const [pickupDate, setPickupDate] = useState(todayStr);
  const [pickupTimeSlot, setPickupTimeSlot] = useState(
    profile.preferredTimeSlot || PICKUP_TIME_SLOTS[2]
  );
  const [estimatedWeightKg, setEstimatedWeightKg] = useState<number>(
    presetWeight && presetWeight >= 1 ? presetWeight : 4
  );
  const [specialInstructions, setSpecialInstructions] = useState(
    profile.defaultFabricNotes || ''
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] =
    useState<LaundryBooking | null>(null);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

  useEffect(() => {
    if (presetWeight && presetWeight >= 1) {
      setEstimatedWeightKg(presetWeight);
    }
  }, [presetWeight]);

  const estimatedPrice = Math.round(estimatedWeightKg * BASE_PRICE_PER_KG);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!studentName.trim() || studentName.trim().length < 2) {
      newErrors.studentName = 'Please enter your full student name.';
    }

    const cleanedPhone = mobileNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      newErrors.mobileNumber =
        'Please enter a valid 10-digit Indian mobile number (starting with 6–9).';
    }

    if (!hostelOrPgName.trim()) {
      newErrors.hostelOrPgName = 'Please select your Hostel or PG.';
    }

    if (!pickupAddress.trim() || pickupAddress.trim().length < 4) {
      newErrors.pickupAddress =
        'Please enter your room number, floor, or block details.';
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Please select a preferred pickup date.';
    }

    if (!pickupTimeSlot) {
      newErrors.pickupTimeSlot = 'Please select an available pickup time slot.';
    }

    if (
      isNaN(estimatedWeightKg) ||
      estimatedWeightKg < 1 ||
      estimatedWeightKg > 30
    ) {
      newErrors.estimatedWeightKg =
        'Estimated clothes weight must be between 1 kg and 30 kg.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const now = new Date();
      const timeFormatted = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newBooking: LaundryBooking = {
        id: `QWC-2026-${randomNum}`,
        studentName: studentName.trim(),
        mobileNumber: mobileNumber.replace(/\D/g, ''),
        hostelOrPgName: hostelOrPgName.trim(),
        pickupAddress: pickupAddress.trim(),
        pickupDate,
        pickupTimeSlot,
        estimatedWeightKg: Number(estimatedWeightKg.toFixed(1)),
        pricePerKg: BASE_PRICE_PER_KG,
        estimatedPrice,
        specialInstructions: specialInstructions.trim(),
        status: 'Booking Confirmed',
        createdAt: `${pickupDate} ${timeFormatted}`,
        updatedAt: `${pickupDate} ${timeFormatted}`,
        isDemoOrder: false,
      };

      onCreateBooking(newBooking);
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
    }, 350);
  };

  const handleFillFromProfile = () => {
    setStudentName(profile.studentName);
    setMobileNumber(profile.mobileNumber);
    setHostelOrPgName(profile.hostelOrPgName);
    setPickupAddress(profile.pickupAddress);
    setPickupTimeSlot(profile.preferredTimeSlot || PICKUP_TIME_SLOTS[2]);
    setSpecialInstructions(profile.defaultFabricNotes || '');
    setErrors({});
  };

  const handleCopyWhatsAppText = () => {
    if (!confirmedBooking) return;
    const summary = `*QuickWash Campus — Booking Confirmed*\nBooking ID: ${confirmedBooking.id}\nStudent: ${confirmedBooking.studentName} (${confirmedBooking.mobileNumber})\nHostel/PG: ${confirmedBooking.hostelOrPgName}\nAddress: ${confirmedBooking.pickupAddress}\nPickup Slot: ${confirmedBooking.pickupDate} | ${confirmedBooking.pickupTimeSlot}\nEst. Weight: ${confirmedBooking.estimatedWeightKg} kg\nEst. Price: ${formatINR(confirmedBooking.estimatedPrice)} (@ ₹100/kg)\nStatus: ${confirmedBooking.status}`;
    navigator.clipboard?.writeText(summary);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-20">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Booking Confirmed · Added to My Orders</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Pickup Scheduled Successfully
              </h1>
              <p className="text-sm text-slate-600">
                Your laundry collection request has been registered with QuickWash Campus.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-slate-500">Unique Booking ID</p>
              <p className="text-lg font-bold font-mono-tabular text-sky-700">
                {confirmedBooking.id}
              </p>
            </div>
          </div>

          {/* Key Booking Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Student & Contact</p>
              <p className="font-semibold text-slate-900">
                {confirmedBooking.studentName}
              </p>
              <p className="text-slate-600 font-mono-tabular">
                +91 {confirmedBooking.mobileNumber}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500">Pickup Date & Time Window</p>
              <p className="font-semibold text-slate-900 font-mono-tabular">
                {confirmedBooking.pickupDate}
              </p>
              <p className="text-slate-600">{confirmedBooking.pickupTimeSlot}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500">Hostel / PG & Room Address</p>
              <p className="font-semibold text-slate-900">
                {confirmedBooking.hostelOrPgName}
              </p>
              <p className="text-slate-600">{confirmedBooking.pickupAddress}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500">
                Estimated Weight & Tariff (@ ₹100/kg)
              </p>
              <p className="font-semibold text-slate-900 font-mono-tabular">
                {confirmedBooking.estimatedWeightKg} kg ·{' '}
                <span className="text-sky-700">
                  {formatINR(confirmedBooking.estimatedPrice)}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                Final payable amount confirmed after weighing on digital scale at pickup.
              </p>
            </div>
          </div>

          {confirmedBooking.specialInstructions && (
            <div className="pt-4 border-t border-slate-100 text-sm">
              <p className="text-xs text-slate-500 mb-1">Special Instructions</p>
              <p className="text-slate-700">
                {confirmedBooking.specialInstructions}
              </p>
            </div>
          )}

          {/* WhatsApp-Style Booking Receipt Preview (MVP Feature) */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-700">
                WhatsApp-Style Booking Confirmation Format (MVP Workflow)
              </p>
              <button
                type="button"
                onClick={handleCopyWhatsAppText}
                className="px-3 py-1.5 min-h-[36px] text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {copiedWhatsApp ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied Receipt</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy WhatsApp Summary</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-xs font-mono-tabular text-slate-700 whitespace-pre-wrap leading-relaxed">
{`QuickWash Campus · Booking Confirmed
ID: ${confirmedBooking.id} · Status: ${confirmedBooking.status}
Student: ${confirmedBooking.studentName} (+91 ${confirmedBooking.mobileNumber})
Location: ${confirmedBooking.hostelOrPgName}, ${confirmedBooking.pickupAddress}
Pickup: ${confirmedBooking.pickupDate} · ${confirmedBooking.pickupTimeSlot}
Estimated Load: ${confirmedBooking.estimatedWeightKg} kg × ₹100/kg = ${formatINR(confirmedBooking.estimatedPrice)}`}
            </pre>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onTrackOrder(confirmedBooking.id)}
                className="px-5 py-3 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Track Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="px-4 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
              >
                View My Orders
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setConfirmedBooking(null);
                setEstimatedWeightKg(4);
              }}
              className="px-4 py-3 min-h-[44px] text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Book Another Pickup</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            DGU Hostel & Selaqui PG Laundry Collection
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Book a Laundry Pickup
          </h1>
        </div>
        <button
          type="button"
          onClick={handleFillFromProfile}
          className="px-3.5 py-2 min-h-[40px] text-xs font-medium text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer"
        >
          Auto-Fill from Saved Student Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
        {/* Left 7 Columns: Booking Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6"
        >
          {/* Student Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="student-name"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Student Full Name <span className="text-red-600">*</span>
              </label>
              <input
                id="student-name"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errors.studentName)
                    setErrors({ ...errors, studentName: undefined });
                }}
                placeholder="e.g. Aarav Sharma"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.studentName ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.studentName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.studentName}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mobile-number"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Mobile Number (WhatsApp Active){' '}
                <span className="text-red-600">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xs font-mono-tabular text-slate-600 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl">
                  +91
                </span>
                <input
                  id="mobile-number"
                  type="tel"
                  maxLength={10}
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value.replace(/\D/g, ''));
                    if (errors.mobileNumber)
                      setErrors({ ...errors, mobileNumber: undefined });
                  }}
                  placeholder="9876543210"
                  className={`w-full px-3.5 py-2.5 text-sm font-mono-tabular rounded-r-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    errors.mobileNumber ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.mobileNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* Hostel / PG Selection & Room Address */}
          <div className="space-y-5 pt-2 border-t border-slate-100">
            <div>
              <label
                htmlFor="hostel-select"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Hostel or PG Name <span className="text-red-600">*</span>
              </label>
              <select
                id="hostel-select"
                value={hostelOrPgName}
                onChange={(e) => {
                  setHostelOrPgName(e.target.value);
                  if (errors.hostelOrPgName)
                    setErrors({ ...errors, hostelOrPgName: undefined });
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.hostelOrPgName ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                {DGU_HOSTELS_AND_PGS.map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
              {errors.hostelOrPgName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.hostelOrPgName}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="pickup-address"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Pickup Address (Room No., Floor, Wing / Landmark){' '}
                <span className="text-red-600">*</span>
              </label>
              <input
                id="pickup-address"
                type="text"
                value={pickupAddress}
                onChange={(e) => {
                  setPickupAddress(e.target.value);
                  if (errors.pickupAddress)
                    setErrors({ ...errors, pickupAddress: undefined });
                }}
                placeholder="e.g. Room 304, 3rd Floor, Block A"
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.pickupAddress ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.pickupAddress && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.pickupAddress}</span>
                </p>
              )}
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            <div>
              <label
                htmlFor="pickup-date"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Preferred Pickup Date <span className="text-red-600">*</span>
              </label>
              <input
                id="pickup-date"
                type="date"
                min="2026-09-30"
                value={pickupDate}
                onChange={(e) => {
                  setPickupDate(e.target.value);
                  if (errors.pickupDate)
                    setErrors({ ...errors, pickupDate: undefined });
                }}
                className={`w-full px-3.5 py-2.5 text-sm font-mono-tabular rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.pickupDate ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.pickupDate && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.pickupDate}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="pickup-slot"
                className="block text-xs font-semibold text-slate-800 mb-1.5"
              >
                Available Pickup Time Slot <span className="text-red-600">*</span>
              </label>
              <select
                id="pickup-slot"
                value={pickupTimeSlot}
                onChange={(e) => {
                  setPickupTimeSlot(e.target.value);
                  if (errors.pickupTimeSlot)
                    setErrors({ ...errors, pickupTimeSlot: undefined });
                }}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  errors.pickupTimeSlot ? 'border-red-500' : 'border-slate-300'
                }`}
              >
                {PICKUP_TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.pickupTimeSlot && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.pickupTimeSlot}</span>
                </p>
              )}
            </div>
          </div>

          {/* Estimated Clothes Weight in kg */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label
                htmlFor="weight-input"
                className="text-xs font-semibold text-slate-800"
              >
                Estimated Clothes Weight (kg){' '}
                <span className="text-red-600">*</span>
              </label>
              <span className="text-xs font-mono-tabular font-semibold text-sky-700">
                {estimatedWeightKg} kg × ₹100 = {formatINR(estimatedPrice)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-8">
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={estimatedWeightKg}
                  onChange={(e) =>
                    setEstimatedWeightKg(parseFloat(e.target.value))
                  }
                  className="w-full accent-sky-600 cursor-pointer"
                  aria-label="Estimated clothes weight slider"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono-tabular mt-1">
                  <span>1 kg</span>
                  <span>5 kg</span>
                  <span>10 kg</span>
                  <span>15 kg</span>
                  <span>20 kg</span>
                </div>
              </div>

              <div className="sm:col-span-4 flex items-center gap-2">
                <input
                  id="weight-input"
                  type="number"
                  min={1}
                  max={30}
                  step={0.5}
                  value={estimatedWeightKg}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEstimatedWeightKg(isNaN(val) ? 1 : val);
                    if (errors.estimatedWeightKg)
                      setErrors({ ...errors, estimatedWeightKg: undefined });
                  }}
                  className="w-full px-3 py-2 text-sm font-mono-tabular font-semibold text-center rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs font-medium text-slate-600 shrink-0">
                  kg
                </span>
              </div>
            </div>

            {/* Interactive Quick Weight Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { label: '2 kg (Light · ~8 clothes)', kg: 2 },
                { label: '4 kg (Weekly · ~16 clothes)', kg: 4 },
                { label: '6 kg (Heavy + Bedsheet)', kg: 6 },
                { label: '8 kg (Roommate Shared)', kg: 8 },
              ].map((preset) => (
                <button
                  key={preset.kg}
                  type="button"
                  onClick={() => setEstimatedWeightKg(preset.kg)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    estimatedWeightKg === preset.kg
                      ? 'bg-sky-50 border-sky-300 text-sky-800 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {errors.estimatedWeightKg && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.estimatedWeightKg}</span>
              </p>
            )}
          </div>

          {/* Special Instructions */}
          <div className="pt-2 border-t border-slate-100">
            <label
              htmlFor="special-instructions"
              className="block text-xs font-semibold text-slate-800 mb-1.5"
            >
              Special Instructions (Optional)
            </label>
            <textarea
              id="special-instructions"
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Call when reaching Hostel Block A gate, wash white lab coat separately."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 min-h-[48px] bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Generating Booking ID & Scheduling Slot...</span>
              ) : (
                <>
                  <span>
                    Confirm Pickup Booking · {formatINR(estimatedPrice)} Est.
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right 5 Columns: Live Price Summary & Weight Confirmation Policy */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <p className="text-xs text-sky-300 font-medium">
                Live Booking Price Summary
              </p>
              <h2 className="text-lg font-bold mt-0.5">
                Transparent Pay-Per-Kg Estimate
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Standard Student Rate</span>
                <span className="font-mono-tabular font-semibold text-white">
                  ₹100 / kg
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Selected Clothes Weight</span>
                <span className="font-mono-tabular font-semibold text-white">
                  {estimatedWeightKg} kg
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Hostel / PG Pickup & Doorstep Return</span>
                <span className="font-mono-tabular text-sky-300">
                  Included
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Estimated Total Payable
                  </p>
                  <p className="text-xs text-slate-400">
                    No upfront online payment required
                  </p>
                </div>
                <span className="text-3xl font-bold font-mono-tabular text-sky-400">
                  {formatINR(estimatedPrice)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p className="font-semibold text-white">
                How Weight Confirmation Works:
              </p>
              <p>
                1. Your booking reserves a slot with your estimated{' '}
                <span className="font-mono-tabular text-sky-300">
                  {estimatedWeightKg} kg
                </span>{' '}
                load.
              </p>
              <p>
                2. At pickup, our runner weighs your laundry bag on a calibrated digital scale in your presence.
              </p>
              <p>
                3. Final charges equal Confirmed Weight × ₹100/kg. Pay upon delivery—no real money is charged in this prototype.
              </p>
            </div>
          </div>

          {/* Helpful Weight Reference Guide */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              How Much Does Student Laundry Weigh?
            </h3>
            <p className="text-xs text-slate-600">
              Use this quick campus reference if you do not have a weighing scale in your room:
            </p>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700">4–5 T-Shirts or Shirts</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  ~1.0 kg (₹100)
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700">
                  2 Pairs of Jeans + 3 Tops
                </span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  ~1.5 kg (₹150)
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700">
                  1 Week Hostel Clothes (14–16 items)
                </span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  ~3.5 – 4.0 kg (₹350–₹400)
                </span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700">
                  Single Bedsheet + Pillow Cover + Towel
                </span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  ~1.2 kg (₹120)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
