import React, { useState } from 'react';
import {
  PackageCheck,
  CalendarPlus,
  ArrowRight,
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react';
import { LaundryBooking, OrderStatus, ScreenId } from '../types';
import { formatINR } from '../data/mockData';

interface OrdersScreenProps {
  bookings: LaundryBooking[];
  onNavigate: (screen: ScreenId) => void;
  onTrackOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  bookings,
  onNavigate,
  onTrackOrder,
  onCancelOrder,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'user' | 'demo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const userBookings = bookings.filter((b) => !b.isDemoOrder);
  const demoBookings = bookings.filter((b) => b.isDemoOrder);

  const filterBySearch = (list: LaundryBooking[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (b) =>
        b.id.toLowerCase().includes(q) ||
        b.studentName.toLowerCase().includes(q) ||
        b.hostelOrPgName.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q)
    );
  };

  const filteredUserBookings = filterBySearch(userBookings);
  const filteredDemoBookings = filterBySearch(demoBookings);

  const isCancellable = (status: OrderStatus) =>
    status === 'Booking Confirmed' || status === 'Pickup Scheduled';

  const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'text-emerald-700 font-semibold';
      case 'Ready for Delivery':
        return 'text-sky-700 font-semibold';
      case 'Washing in Progress':
      case 'Clothes Collected':
        return 'text-amber-700 font-semibold';
      case 'Cancelled':
        return 'text-red-600 font-semibold';
      default:
        return 'text-slate-900 font-semibold';
    }
  };

  const renderOrderCard = (order: LaundryBooking) => {
    const effectiveWeight =
      order.confirmedWeightKg !== undefined
        ? order.confirmedWeightKg
        : order.estimatedWeightKg;
    const effectivePrice =
      order.finalPrice !== undefined ? order.finalPrice : order.estimatedPrice;

    return (
      <div
        key={order.id}
        className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 hover:border-sky-300 transition-colors"
      >
        {/* Top Metadata Line - Unboxed Typography with Separators */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-mono-tabular">
            <span className="font-bold text-slate-900">{order.id}</span>
            <span aria-hidden="true">·</span>
            <span>Pickup Date: {order.pickupDate}</span>
            <span aria-hidden="true">·</span>
            <span>
              {order.isDemoOrder
                ? 'Sample Demonstration Order'
                : 'Your Campus Booking'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Status:</span>
            <span className={getStatusColorClass(order.status)}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Main Order Body */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-7 space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              {order.hostelOrPgName}
            </h3>
            <p className="text-xs text-slate-600">
              {order.pickupAddress} · {order.pickupTimeSlot}
            </p>
            {order.specialInstructions && (
              <p className="text-xs text-slate-500 pt-1">
                Note: {order.specialInstructions}
              </p>
            )}
          </div>

          <div className="sm:col-span-5 flex sm:flex-col sm:items-end justify-between gap-2">
            <div className="sm:text-right">
              <p className="text-xs text-slate-500">
                {order.confirmedWeightKg !== undefined
                  ? 'Confirmed Weight & Final Charge'
                  : 'Estimated Weight & Charge (@ ₹100/kg)'}
              </p>
              <p className="text-lg font-bold font-mono-tabular text-slate-900">
                {effectiveWeight} kg ·{' '}
                <span className="text-sky-700">{formatINR(effectivePrice)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono-tabular">
            Student: {order.studentName} · Updated {order.updatedAt}
          </div>

          <div className="flex items-center gap-2.5">
            {isCancellable(order.status) && (
              <>
                {confirmCancelId === order.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-700 font-medium">
                      Cancel pickup?
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onCancelOrder(order.id);
                        setConfirmCancelId(null);
                      }}
                      className="px-3 py-1.5 min-h-[36px] bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Yes, Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmCancelId(null)}
                      className="px-2.5 py-1.5 min-h-[36px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Keep
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmCancelId(order.id)}
                    className="px-3 py-2 min-h-[38px] text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Cancel Booking
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={() => onTrackOrder(order.id)}
              className="px-4 py-2 min-h-[38px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Track & View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            Order History & Active Laundry Pickups
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            My Orders
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('book')}
          className="px-4 py-2.5 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
        >
          <CalendarPlus className="w-4 h-4" />
          <span>Book New Pickup</span>
        </button>
      </div>

      {/* Interactive Filter Controls & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-2 min-h-[38px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('user')}
            className={`px-3.5 py-2 min-h-[38px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === 'user'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Your Bookings ({userBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('demo')}
            className={`px-3.5 py-2 min-h-[38px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              filterTab === 'demo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sample Demo Orders ({demoBookings.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, hostel, status..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Section 1: Actual User Bookings */}
      {(filterTab === 'all' || filterTab === 'user') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Submitted Bookings ({filteredUserBookings.length})
              </h2>
              <p className="text-xs text-slate-500">
                Bookings created by you during this session (saved in browser local storage).
              </p>
            </div>
          </div>

          {filteredUserBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                No Personal Bookings Submitted Yet
              </p>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Schedule a laundry pickup from your DGU hostel or Selaqui PG to see your live booking ID, weight calculation, and step-by-step order tracker here.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('book')}
                  className="px-5 py-2.5 min-h-[42px] bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Create Your First Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUserBookings.map(renderOrderCard)}
            </div>
          )}
        </section>
      )}

      {/* Section 2: Sample Demo Orders (Separated Clearly) */}
      {(filterTab === 'all' || filterTab === 'demo') && (
        <section className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Sample Demonstration Orders ({filteredDemoBookings.length})
              </h2>
              <p className="text-xs text-slate-500">
                Pre-populated sample data illustrating different laundry lifecycle statuses for your university presentation.
              </p>
            </div>
            <span className="text-xs text-amber-700 font-medium">
              Demo Data · Separated from User Bookings
            </span>
          </div>

          {filteredDemoBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
              No sample demo orders match your search filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDemoBookings.map(renderOrderCard)}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
