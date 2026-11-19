import React, { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  Scale,
  Info,
  TrendingUp,
  Check,
} from 'lucide-react';
import {
  BASE_PRICE_PER_KG,
  VARIABLE_COST_PER_KG,
  CONTRIBUTION_MARGIN_PER_KG,
  ScreenId,
} from '../types';
import { formatINR } from '../data/mockData';

interface PricingScreenProps {
  onNavigate: (screen: ScreenId, presetWeight?: number) => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({ onNavigate }) => {
  const [calcKg, setCalcKg] = useState<number>(5);

  const studentTotal = calcKg * BASE_PRICE_PER_KG;
  const variableCostTotal = calcKg * VARIABLE_COST_PER_KG;
  const contributionMarginTotal = calcKg * CONTRIBUTION_MARGIN_PER_KG;

  const proposedMonthlyPackages = [
    {
      name: 'Solo Light Plan (Proposed Option)',
      audience: 'For individual students with light weekly wear',
      monthlyWeightLimit: 'Up to 12 kg / month',
      pickupCadence: '2 scheduled pickups per month (up to 6 kg each)',
      proposedPrice: 1100,
      effectivePerKg: '₹91.6/kg',
      statusNote: 'Proposed Option · Not a Confirmed Offer',
      recommendedLoad: 4,
    },
    {
      name: 'Hostel Regular Plan (Proposed Option)',
      audience: 'For active hostel residents including bedsheets & sportswear',
      monthlyWeightLimit: 'Up to 20 kg / month',
      pickupCadence: '4 weekly pickups per month (up to 5 kg each)',
      proposedPrice: 1800,
      effectivePerKg: '₹90.0/kg',
      statusNote: 'Proposed Option · Not a Confirmed Offer',
      recommendedLoad: 5,
    },
    {
      name: 'Roommate Share Plan (Proposed Option)',
      audience: 'For 2 roommates sharing weekly laundry slots',
      monthlyWeightLimit: 'Up to 35 kg / month',
      pickupCadence: '4 weekly pickups per month (shared room bag)',
      proposedPrice: 3150,
      effectivePerKg: '₹90.0/kg',
      statusNote: 'Proposed Option · Not a Confirmed Offer',
      recommendedLoad: 8,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            Transparent Student Tariff & Venture Unit Economics
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Pricing & Business Cost Structure
          </h1>
        </div>
        <p className="text-xs text-slate-600 max-w-md">
          No real money or automated app payments are collected in this prototype. Final charges always depend on confirmed clothes weight at pickup.
        </p>
      </div>

      {/* Primary MVP Tariff + Interactive Weight & Unit Economics Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left 6 Cols: Confirmed MVP Pay-Per-Kg Offering */}
        <div className="lg:col-span-6 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs text-sky-300 font-mono-tabular">
              <span>Active MVP Tariff · Pay-Per-Kilogram</span>
              <span>No Minimum Subscription</span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-bold font-mono-tabular text-white">
                  ₹100
                </span>
                <span className="text-lg text-slate-300">/ kg</span>
              </div>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Simple, flat-rate student pricing for DBS Global University hostels and nearby Selaqui PGs.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-800 text-sm text-slate-200">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Scheduled doorstep pickup from DGU Hostel Block or PG gate
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  On-spot weight confirmation via calibrated digital scale
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Dedicated student batch wash, hygienic drying, and neat folding
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  Doorstep return delivery within 24–48 hours
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Final charge = Confirmed Weight (kg) × ₹100
            </div>
            <button
              type="button"
              onClick={() => onNavigate('book', calcKg)}
              className="px-5 py-3 min-h-[44px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Book {calcKg} kg Pickup ({formatINR(studentTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right 6 Cols: Venture Unit Economics Breakdown (Internal Business Info) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-xs font-semibold text-amber-700">
                For Internal Business Information Only · Venture Plan Unit Economics
              </p>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Per-Kilogram Margin & Cost Breakdown
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Demonstrates financial viability for DGU Entrepreneurship & Innovation Assignment 2.
              </p>
            </div>

            {/* 3 Core Unit Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-xs text-slate-500">Selling Price</p>
                <p className="text-xl font-bold font-mono-tabular text-slate-900 mt-1">
                  ₹100<span className="text-xs font-normal">/kg</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  100% Revenue Base
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <p className="text-xs text-slate-500">Est. Variable Cost</p>
                <p className="text-xl font-bold font-mono-tabular text-slate-700 mt-1">
                  ₹60<span className="text-xs font-normal">/kg</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Wash, power, runner
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200">
                <p className="text-xs text-sky-900 font-medium">
                  Contribution Margin
                </p>
                <p className="text-xl font-bold font-mono-tabular text-sky-700 mt-1">
                  ₹40<span className="text-xs font-normal">/kg</span>
                </p>
                <p className="text-[11px] text-sky-800 mt-1">
                  40% Unit Margin
                </p>
              </div>
            </div>

            {/* Interactive Volume & Margin Simulator */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="unit-econ-slider"
                  className="font-semibold text-slate-800"
                >
                  Interactive Order Weight Simulator: {calcKg} kg
                </label>
                <span className="font-mono-tabular text-slate-600">
                  Drag to test order economics
                </span>
              </div>
              <input
                id="unit-econ-slider"
                type="range"
                min={1}
                max={25}
                step={0.5}
                value={calcKg}
                onChange={(e) => setCalcKg(parseFloat(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />

              <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono-tabular">
                <div>
                  <span className="text-slate-500 block">Gross Revenue</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatINR(studentTotal)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">
                    Variable Cost (60%)
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {formatINR(variableCostTotal)}
                  </span>
                </div>
                <div>
                  <span className="text-sky-800 block">
                    Net Contribution (40%)
                  </span>
                  <span className="text-sm font-bold text-sky-700">
                    {formatINR(contributionMarginTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
            Variable cost (₹60/kg) covers commercial washing & drying partner rate, detergent & packaging consumables, and local campus collection/delivery logistics.
          </div>
        </div>
      </div>

      {/* Weight Confirmation Policy Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-3xl">
          <p className="text-xs font-semibold text-sky-700">
            Weight Confirmation & Billing Policy
          </p>
          <h3 className="text-base font-bold text-slate-900">
            Final Charges Depend on Confirmed Clothes Weight at Pickup
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you submit a booking, the app calculates an estimate (`Estimated Weight × ₹100/kg`). During physical collection at your hostel or PG, our staff weighs your laundry bag on a digital scale and updates the confirmed weight in the system. No real money is charged inside this demonstration app.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('book')}
          className="px-4 py-2.5 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Try Weight Calculator in Booking Form
        </button>
      </div>

      {/* Proposed Monthly Packages (Concept Stage Only) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-amber-700">
              Future Concept Exploration · Proposed Options Only (Not Confirmed Offers)
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Sample Monthly Packages (Proposed Future Phase)
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            The current MVP operates strictly on the ₹100/kg pay-per-order model. These monthly packages are shown as proposed future concepts from the venture plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proposedMonthlyPackages.map((pkg) => (
            <div
              key={pkg.name}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-amber-700">
                    {pkg.statusNote}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-600">{pkg.audience}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold font-mono-tabular text-slate-900">
                      {formatINR(pkg.proposedPrice)}
                    </span>
                    <span className="text-xs text-slate-500"> / month</span>
                  </div>
                  <span className="text-xs font-mono-tabular text-slate-500">
                    Effective: {pkg.effectivePerKg}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Allowance:
                    </span>{' '}
                    {pkg.monthlyWeightLimit}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">
                      Schedule:
                    </span>{' '}
                    {pkg.pickupCadence}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onNavigate('book', pkg.recommendedLoad)}
                  className="w-full py-2.5 px-4 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Standard ₹100/kg Pickup Instead ({pkg.recommendedLoad} kg)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
