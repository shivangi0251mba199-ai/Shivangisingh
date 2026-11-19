import React, { useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Scale,
  Shirt,
  Truck,
  Clock,
  CheckCircle2,
  Calculator,
  Compass,
} from 'lucide-react';
import { ScreenId, BASE_PRICE_PER_KG } from '../types';
import { formatINR } from '../data/mockData';
import { QuickWashLogoMark } from './Navbar';
import heroLaundryImg from '../assets/images/quickwash_hero_laundry_1790835993884.jpg';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId, presetWeight?: number) => void;
  studentName: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  studentName,
}) => {
  const [quickWeight, setQuickWeight] = useState<number>(4);
  const [imageError, setImageError] = useState<boolean>(false);

  const serviceSteps = [
    {
      num: '01. Book',
      title: 'Schedule Your Pickup Slot',
      description:
        'Select your hostel or PG around DGU Dehradun, choose a convenient time slot, and enter your estimated laundry weight.',
      detail: 'Instant WhatsApp-style booking summary & ID',
    },
    {
      num: '02. Pickup',
      title: 'Doorstep Collection & Weighing',
      description:
        'Our campus runner arrives at your hostel block or PG gate with a digital scale to confirm exact clothes weight in front of you.',
      detail: 'Pay only for confirmed weight at ₹100/kg',
    },
    {
      num: '03. Wash & Fold',
      title: 'Hygienic Wash, Dry & Crisp Fold',
      description:
        'Every student batch is washed separately in dedicated machines using fabric-safe detergent, dried thoroughly, and neatly folded.',
      detail: 'Zero mixing of clothes between students',
    },
    {
      num: '04. Doorstep Delivery',
      title: 'Fresh Clothes Back to Your Room',
      description:
        'Receive neatly packed, fresh-smelling clothes back at your hostel or PG doorstep within 24 to 48 hours.',
      detail: 'Manual status updates at every stage',
    },
  ];

  const keyBenefits = [
    {
      title: 'Saves Valuable Study & Campus Time',
      description:
        'Reclaim 3–4 hours every week instead of hand-washing in hostel washrooms or waiting in shared machine queues.',
      metric: '3–4 hrs saved weekly per student',
    },
    {
      title: 'Convenient Hostel & PG Pickup',
      description:
        'Morning, lunch-break, evening, and night pickup slots designed specifically around DGU lecture schedules.',
      metric: '4 daily campus pickup windows',
    },
    {
      title: 'Transparent ₹100/kg Pricing',
      description:
        'Flat rate of ₹100 per kg with on-the-spot digital scale verification during collection—no hidden per-piece surprises.',
      metric: '₹100 per kg flat student tariff',
    },
    {
      title: 'Reliable Doorstep Delivery',
      description:
        'Cleaned, dried, and neatly folded garments packed in moisture-safe wraps and returned right to your hostel or PG.',
      metric: '24–48 hour standard turnaround',
    },
  ];

  return (
    <div className="space-y-14 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-sky-950 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Brand & Primary Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <QuickWashLogoMark className="w-11 h-11 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-sky-300 tracking-wide">
                    DBS Global University (DGU), Dehradun · Venture Prototype
                  </p>
                  <p className="text-sm font-semibold text-white">
                    Welcome back, {studentName.split(' ')[0]} · QuickWash Campus
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  Skip the Laundry Hassle.
                </h1>
                <p className="text-base sm:text-lg text-slate-200 max-w-xl leading-relaxed">
                  Your laundry, picked up and delivered at your convenience.
                  Designed for DGU students living in campus hostels and Selaqui PGs.
                </p>
              </div>

              {/* Clean unboxed metadata bar */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sky-200/90 font-mono-tabular">
                <span>Base Tariff: ₹100 / kg</span>
                <span aria-hidden="true">·</span>
                <span>On-Spot Weight Confirmation</span>
                <span aria-hidden="true">·</span>
                <span>24–48 Hr Turnaround</span>
                <span aria-hidden="true">·</span>
                <span>Hostel & PG Doorstep Service</span>
              </div>

              {/* Primary CTA & Secondary Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('book')}
                  className="px-6 py-3.5 min-h-[48px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-sm rounded-xl transition-colors inline-flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-sm"
                >
                  <span>Book a Pickup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('orders')}
                  className="px-5 py-3.5 min-h-[48px] bg-slate-800/90 hover:bg-slate-800 text-white border border-slate-700 font-medium text-sm rounded-xl transition-colors whitespace-nowrap cursor-pointer"
                >
                  Track My Orders
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('pricing')}
                  className="px-4 py-3.5 min-h-[48px] text-sky-300 hover:text-white font-medium text-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  View ₹100/kg Pricing →
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual + Instant Estimate Bar */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800/60 shadow-xl">
                <div className="relative aspect-4/3 w-full bg-slate-800 overflow-hidden">
                  {!imageError ? (
                    <img
                      src={heroLaundryImg}
                      alt="Neatly folded stacks of clean white, navy blue, and light blue student clothes in a laundry basket"
                      referrerPolicy="no-referrer"
                      onError={() => setImageError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-800 via-sky-950 to-slate-900 text-center">
                      <Shirt className="w-12 h-12 text-sky-400 mb-3" />
                      <p className="text-sm font-semibold text-white">
                        QuickWash Campus Hygiene Standard
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        Individual student wash loads · Neatly folded delivery
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <p className="text-xs text-sky-300 font-medium">
                        Standard Student Rate
                      </p>
                      <p className="text-xl font-bold font-mono-tabular">
                        ₹100 / kg · Wash & Fold
                      </p>
                    </div>
                    <span className="text-xs text-slate-300 font-mono-tabular">
                      DGU Campus & Selaqui PGs
                    </span>
                  </div>
                </div>

                {/* Quick Interactive Estimator inside Hero Card */}
                <div className="p-5 bg-slate-900/95 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="hero-weight-slider"
                      className="font-medium text-slate-300"
                    >
                      Quick Estimate: Select Clothes Weight
                    </label>
                    <span className="font-mono-tabular font-semibold text-sky-400">
                      {quickWeight} kg ≈ {formatINR(quickWeight * BASE_PRICE_PER_KG)}
                    </span>
                  </div>
                  <input
                    id="hero-weight-slider"
                    type="range"
                    min={1}
                    max={15}
                    step={0.5}
                    value={quickWeight}
                    onChange={(e) => setQuickWeight(parseFloat(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">
                      ~{Math.round(quickWeight * 4.5)} everyday garments
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('book', quickWeight)}
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 whitespace-nowrap cursor-pointer"
                    >
                      <span>Book for {quickWeight} kg</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Service Steps Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <p className="text-xs font-semibold text-sky-700">
              Simple 4-Stage Campus Workflow
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Four Steps from Laundry Bag to Fresh Wardrobe
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Built around hostel timings and student budgets—no complicated subscriptions or hidden per-garment tariffs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {serviceSteps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-sky-300 transition-colors"
            >
              <div className="space-y-3">
                <p className="text-sm font-bold text-sky-700 font-mono-tabular">
                  {step.num}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="pt-4 mt-5 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparent Pricing & Benefits Split Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pricing Highlight Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-2xl p-7 flex flex-col justify-between">
            <div className="space-y-5">
              <p className="text-xs font-medium text-sky-300">
                Transparent Pay-Per-Kg Student Tariff
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-mono-tabular">
                  ₹100
                </span>
                <span className="text-base text-slate-300">/ kilogram</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                Includes doorstep pickup from your DGU hostel or Selaqui PG, digital weight confirmation, separate machine wash, tumble dry, neat folding, and packaged delivery.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs text-slate-200">
                <div className="flex items-center justify-between py-1">
                  <span>1 kg Load (~4–5 Shirts / Tees)</span>
                  <span className="font-mono-tabular font-semibold text-sky-300">
                    ₹100
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>3 kg Weekly Load (~12–14 Clothes)</span>
                  <span className="font-mono-tabular font-semibold text-sky-300">
                    ₹300
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span>5 kg Hostel Load (Clothes + Bedsheet)</span>
                  <span className="font-mono-tabular font-semibold text-sky-300">
                    ₹500
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onNavigate('book')}
                className="px-5 py-2.5 min-h-[44px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                Schedule Pickup Now
              </button>
              <button
                type="button"
                onClick={() => onNavigate('pricing')}
                className="text-xs text-sky-300 hover:text-white font-medium whitespace-nowrap cursor-pointer"
              >
                Unit Economics & Proposed Plans →
              </button>
            </div>
          </div>

          {/* 4 Core Benefits Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {keyBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <h3 className="text-base font-semibold text-slate-900">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <p className="text-xs font-mono-tabular font-medium text-sky-700">
                    {benefit.metric}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the Service Works (Detailed MVP Operational Walkthrough) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-semibold text-sky-700">
                Operational Transparency · How QuickWash Campus Works
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Designed Around Real Hostel & PG Life at DGU Dehradun
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 min-h-[40px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto cursor-pointer"
            >
              Inspect Business Dashboard Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-xs font-mono-tabular font-semibold text-slate-500">
                Phase A · Booking & Slot Confirmation
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                WhatsApp-Style Booking & Time Windows
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students book in under 60 seconds by choosing their hostel/PG, preferred pickup date, and time window. An instant booking reference ID and WhatsApp-format order summary are generated immediately.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono-tabular font-semibold text-slate-500">
                Phase B · On-Spot Weight Verification
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                Digital Scale Confirmation at Pickup
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                You only estimate weight while booking. When our pickup runner collects your bag at your hostel block or PG gate, clothes are weighed on a portable digital scale and the final payable amount (confirmed kg × ₹100) is updated.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-mono-tabular font-semibold text-slate-500">
                Phase C · Processing & Doorstep Return
              </p>
              <h3 className="text-base font-semibold text-slate-900">
                Stage-by-Stage Status & Room Delivery
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your laundry across 6 clear operational stages—from Booking Confirmed to Ready for Delivery and Delivered—without needing complex GPS hardware or upfront online payments.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
