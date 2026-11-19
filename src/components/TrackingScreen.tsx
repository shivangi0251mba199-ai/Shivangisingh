import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  Scale,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import {
  LaundryBooking,
  OrderStatus,
  ORDER_STATUS_STEPS,
  ScreenId,
  BASE_PRICE_PER_KG,
} from '../types';
import { formatINR } from '../data/mockData';

interface TrackingScreenProps {
  bookings: LaundryBooking[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderStatus,
    confirmedWeight?: number
  ) => void;
  onCancelOrder: (orderId: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

const STEP_DESCRIPTIONS: Record<
  OrderStatus,
  { title: string; subtitle: string; operationalDetail: string }
> = {
  'Booking Confirmed': {
    title: '01. Booking Confirmed',
    subtitle: 'Your pickup request & estimated weight have been logged.',
    operationalDetail:
      'Booking ID generated. Campus pickup runner assigned to your hostel/PG slot.',
  },
  'Pickup Scheduled': {
    title: '02. Pickup Scheduled',
    subtitle: 'Runner scheduled for your selected campus time window.',
    operationalDetail:
      'Runner will bring a portable digital weighing scale to confirm weight at your doorstep.',
  },
  'Clothes Collected': {
    title: '03. Clothes Collected & Weighed',
    subtitle: 'Laundry bag weighed on digital scale and tagged by Booking ID.',
    operationalDetail:
      'Confirmed clothes weight recorded; final payable charge locked at ₹100/kg.',
  },
  'Washing in Progress': {
    title: '04. Washing & Drying in Progress',
    subtitle: 'Dedicated student load wash, fabric-safe detergent, and tumble dry.',
    operationalDetail:
      'Washed in an individual drum cycle—never mixed with other students’ garments.',
  },
  'Ready for Delivery': {
    title: '05. Crisp Folded & Ready for Delivery',
    subtitle: 'Neatly folded, moisture-wrapped, and queued for hostel drop-off.',
    operationalDetail:
      'Quality check completed. Assigned to next campus delivery batch.',
  },
  Delivered: {
    title: '06. Delivered to Doorstep',
    subtitle: 'Handed over at your DGU hostel block or Selaqui PG.',
    operationalDetail:
      'Order completed. Thank you for using QuickWash Campus!',
  },
  Cancelled: {
    title: 'Cancelled',
    subtitle: 'Booking cancelled prior to clothes collection.',
    operationalDetail: 'No charges apply to cancelled bookings.',
  },
};

export const TrackingScreen: React.FC<TrackingScreenProps> = ({
  bookings,
  selectedOrderId,
  onSelectOrder,
  onUpdateStatus,
  onCancelOrder,
  onNavigate,
}) => {
  const activeBooking =
    bookings.find((b) => b.id === selectedOrderId) || bookings[0] || null;

  const [weightInput, setWeightInput] = useState<string>(
    activeBooking
      ? String(
          activeBooking.confirmedWeightKg ?? activeBooking.estimatedWeightKg
        )
      : '4'
  );

  if (!activeBooking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          No Active Orders to Track
        </h1>
        <p className="text-sm text-slate-600">
          Book a laundry pickup first to view the step-by-step progress tracker.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('book')}
          className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl cursor-pointer"
        >
          Book a Pickup
        </button>
      </div>
    );
  }

  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(activeBooking.status);
  const isCancelled = activeBooking.status === 'Cancelled';
  const canCancel =
    activeBooking.status === 'Booking Confirmed' ||
    activeBooking.status === 'Pickup Scheduled';

  const effectiveWeight =
    activeBooking.confirmedWeightKg !== undefined
      ? activeBooking.confirmedWeightKg
      : activeBooking.estimatedWeightKg;
  const effectivePrice =
    activeBooking.finalPrice !== undefined
      ? activeBooking.finalPrice
      : activeBooking.estimatedPrice;

  const handleAdvanceNextStep = () => {
    if (isCancelled) return;
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < ORDER_STATUS_STEPS.length) {
      const nextStatus = ORDER_STATUS_STEPS[nextIdx];
      const confirmedKg =
        nextIdx >= 2
          ? activeBooking.confirmedWeightKg ?? activeBooking.estimatedWeightKg
          : activeBooking.confirmedWeightKg;
      onUpdateStatus(activeBooking.id, nextStatus, confirmedKg);
    }
  };

  const handleConfirmWeightSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(weightInput);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 30) {
      onUpdateStatus(
        activeBooking.id,
        activeBooking.status === 'Booking Confirmed' ||
          activeBooking.status === 'Pickup Scheduled'
          ? 'Clothes Collected'
          : activeBooking.status,
        Number(parsed.toFixed(1))
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Top Header + Order Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Step-by-Step Order Tracking
          </h1>
          <p className="text-xs text-slate-500">
            Manual checkpoint updates at each stage · Live GPS tracking is excluded from the MVP as per venture plan.
          </p>
        </div>

        {/* Select Any Booking to Track */}
        <div className="w-full md:w-80">
          <label
            htmlFor="order-selector"
            className="block text-xs font-semibold text-slate-700 mb-1"
          >
            Select Order to Inspect:
          </label>
          <select
            id="order-selector"
            value={activeBooking.id}
            onChange={(e) => {
              onSelectOrder(e.target.value);
              const found = bookings.find((b) => b.id === e.target.value);
              if (found) {
                setWeightInput(
                  String(found.confirmedWeightKg ?? found.estimatedWeightKg)
                );
              }
            }}
            className="w-full px-3.5 py-2 text-xs font-mono-tabular rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} · {b.studentName} ({b.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left 7 Cols Visual Step Tracker, Right 5 Cols Order Details & Demo Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Visual 6-Stage Progress Tracker */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs text-slate-500 font-mono-tabular">
                Booking Reference: {activeBooking.id} ·{' '}
                {activeBooking.isDemoOrder ? 'Sample Demo Order' : 'User Booking'}
              </p>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                Laundry Processing Timeline
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Current Checkpoint</p>
              <p
                className={`text-sm font-bold ${
                  isCancelled ? 'text-red-600' : 'text-sky-700'
                }`}
              >
                {activeBooking.status}
              </p>
            </div>
          </div>

          {isCancelled ? (
            <div className="p-5 rounded-xl bg-red-50 border border-red-200 space-y-2">
              <p className="text-sm font-bold text-red-800">
                This Booking Was Cancelled Before Pickup
              </p>
              <p className="text-xs text-red-700">
                You can restore this booking using the Demo Simulator on the right or schedule a new pickup slot.
              </p>
            </div>
          ) : (
            <div className="space-y-6 relative">
              {ORDER_STATUS_STEPS.map((stepStatus, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const stepInfo = STEP_DESCRIPTIONS[stepStatus];

                return (
                  <div
                    key={stepStatus}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Vertical connector line */}
                    {idx < ORDER_STATUS_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 absolute left-4 top-8 -bottom-6 ${
                          idx < currentStepIndex ? 'bg-sky-600' : 'bg-slate-200'
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    {/* Step Circle Indicator */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-mono-tabular text-xs font-bold border-2 z-10 ${
                        isCurrent
                          ? 'bg-sky-600 border-sky-600 text-white ring-4 ring-sky-100'
                          : isCompleted
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted && !isCurrent ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3
                          className={`text-sm font-bold ${
                            isCurrent
                              ? 'text-sky-700'
                              : isCompleted
                              ? 'text-slate-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {stepInfo.title}
                        </h3>
                        <span className="text-[11px] font-mono-tabular text-slate-400">
                          {isCurrent
                            ? `Active (${activeBooking.updatedAt})`
                            : isCompleted
                            ? 'Completed'
                            : 'Pending'}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-0.5 ${
                          isCompleted ? 'text-slate-700' : 'text-slate-400'
                        }`}
                      >
                        {stepInfo.subtitle}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-sky-900 bg-sky-50 border border-sky-100 rounded-lg p-2.5 mt-2">
                          {stepInfo.operationalDetail}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 5 Cols: Interactive Demo Simulator + Order & Weight Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Interactive Demo Status Simulator (For Professor Presentation) */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <p className="text-xs text-sky-300 font-medium">
                Interactive Prototype Simulator (For Demonstration)
              </p>
              <h3 className="text-base font-bold mt-0.5">
                Simulate Order Status & Weight Confirmation
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Status updates are manually triggered at campus checkpoints (no live GPS claim). Click below to demonstrate order progression:
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={
                  isCancelled ||
                  currentStepIndex >= ORDER_STATUS_STEPS.length - 1
                }
                onClick={handleAdvanceNextStep}
                className="w-full py-2.5 px-4 min-h-[42px] bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-semibold text-xs rounded-xl inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>
                  {currentStepIndex < ORDER_STATUS_STEPS.length - 1
                    ? `Advance to Next Step: ${
                        ORDER_STATUS_STEPS[currentStepIndex + 1]
                      }`
                    : 'Order Already Delivered (Final Stage)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct Stage Jump Buttons */}
              <div>
                <p className="text-xs text-slate-400 mb-2">
                  Or jump directly to any status checkpoint:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ORDER_STATUS_STEPS.map((statusOption) => (
                    <button
                      key={statusOption}
                      type="button"
                      onClick={() =>
                        onUpdateStatus(activeBooking.id, statusOption)
                      }
                      className={`px-2.5 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer truncate ${
                        activeBooking.status === statusOption
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-semibold'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {statusOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulate On-Spot Weighing at Pickup */}
              <form
                onSubmit={handleConfirmWeightSave}
                className="pt-3 border-t border-slate-800 space-y-2"
              >
                <label
                  htmlFor="sim-weight"
                  className="block text-xs font-medium text-slate-300"
                >
                  Simulate Digital Scale Weight Confirmation (kg):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="sim-weight"
                    type="number"
                    min={0.5}
                    max={30}
                    step={0.1}
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-28 px-3 py-2 text-xs font-mono-tabular text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 min-h-[36px] bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-sky-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Confirm Weight (@ ₹100/kg)
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Booking & Weight Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID</span>
                <span className="font-mono-tabular font-semibold text-slate-900">
                  {activeBooking.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Name</span>
                <span className="font-semibold text-slate-900">
                  {activeBooking.studentName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number</span>
                <span className="font-mono-tabular text-slate-800">
                  +91 {activeBooking.mobileNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hostel / PG</span>
                <span className="font-medium text-slate-900 text-right max-w-[220px]">
                  {activeBooking.hostelOrPgName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room / Pickup Address</span>
                <span className="text-slate-800 text-right max-w-[220px]">
                  {activeBooking.pickupAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Date & Slot</span>
                <span className="font-mono-tabular text-slate-800 text-right">
                  {activeBooking.pickupDate} ·{' '}
                  {activeBooking.pickupTimeSlot.split(' (')[0]}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Estimated Weight (At Booking)
                  </span>
                  <span className="font-mono-tabular text-slate-700">
                    {activeBooking.estimatedWeightKg} kg (
                    {formatINR(activeBooking.estimatedPrice)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Confirmed Scale Weight
                  </span>
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {activeBooking.confirmedWeightKg !== undefined
                      ? `${activeBooking.confirmedWeightKg} kg`
                      : 'Pending Pickup Weighing'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-900">
                    Total Payable (@ ₹100/kg)
                  </span>
                  <span className="text-lg font-bold font-mono-tabular text-sky-700">
                    {formatINR(effectivePrice)}
                  </span>
                </div>
              </div>
            </div>

            {canCancel && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onCancelOrder(activeBooking.id)}
                  className="w-full py-2.5 px-4 min-h-[40px] text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel This Eligible Booking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
