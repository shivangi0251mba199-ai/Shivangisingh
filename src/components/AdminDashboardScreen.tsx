import React, { useState } from 'react';
import {
  LayoutDashboard,
  RotateCcw,
  ArrowUpRight,
  CheckCircle2,
  Scale,
  AlertTriangle,
} from 'lucide-react';
import {
  LaundryBooking,
  OrderStatus,
  ORDER_STATUS_STEPS,
  BASE_PRICE_PER_KG,
  VARIABLE_COST_PER_KG,
  CONTRIBUTION_MARGIN_PER_KG,
  ScreenId,
} from '../types';
import { formatINR } from '../data/mockData';

interface AdminDashboardScreenProps {
  bookings: LaundryBooking[];
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderStatus,
    confirmedWeight?: number
  ) => void;
  onResetDemoData: () => void;
  onTrackOrder: (orderId: string) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({
  bookings,
  onUpdateStatus,
  onResetDemoData,
  onTrackOrder,
  onNavigate,
}) => {
  const [dataScope, setDataScope] = useState<'all' | 'user' | 'demo'>('all');
  const [editingWeightId, setEditingWeightId] = useState<string | null>(null);
  const [weightDraft, setWeightDraft] = useState<string>('');

  const scopedBookings = bookings.filter((b) => {
    if (dataScope === 'user') return !b.isDemoOrder;
    if (dataScope === 'demo') return b.isDemoOrder;
    return true;
  });

  const activeBookings = scopedBookings.filter((b) => b.status !== 'Cancelled');

  const totalBookings = scopedBookings.length;
  const pendingPickups = scopedBookings.filter(
    (b) => b.status === 'Booking Confirmed' || b.status === 'Pickup Scheduled'
  ).length;
  const ordersInProgress = scopedBookings.filter(
    (b) =>
      b.status === 'Clothes Collected' ||
      b.status === 'Washing in Progress' ||
      b.status === 'Ready for Delivery'
  ).length;
  const completedDeliveries = scopedBookings.filter(
    (b) => b.status === 'Delivered'
  ).length;

  const totalKilogramsProcessed = activeBookings.reduce(
    (sum, b) => sum + (b.confirmedWeightKg ?? b.estimatedWeightKg),
    0
  );

  const estimatedRevenue = totalKilogramsProcessed * BASE_PRICE_PER_KG;
  const totalVariableCost = totalKilogramsProcessed * VARIABLE_COST_PER_KG;
  const totalContributionMargin =
    totalKilogramsProcessed * CONTRIBUTION_MARGIN_PER_KG;

  const statusCounts = ORDER_STATUS_STEPS.map((status) => ({
    status,
    count: scopedBookings.filter((b) => b.status === status).length,
  }));

  const maxStatusCount = Math.max(...statusCounts.map((s) => s.count), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8">
      {/* Explicit Demo Notice Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-0.5">
            <p className="font-bold">
              Demonstration Admin & Operations Dashboard (Not a Production System)
            </p>
            <p className="text-amber-800">
              Created for DBS Global University Assignment 2 venture presentation. Includes both your live local bookings and clearly labelled sample demonstration data.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onResetDemoData}
          className="px-3.5 py-2 min-h-[38px] bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors shrink-0 self-start sm:self-auto cursor-pointer whitespace-nowrap"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Header & Scope Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            QuickWash Campus · Operations & Unit Economics Console
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Admin / Business Dashboard
          </h1>
        </div>

        {/* Interactive Data Scope Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setDataScope('all')}
            className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              dataScope === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Combined View ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setDataScope('user')}
            className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              dataScope === 'user'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Bookings Only ({bookings.filter((b) => !b.isDemoOrder).length})
          </button>
          <button
            type="button"
            onClick={() => setDataScope('demo')}
            className={`px-3 py-1.5 min-h-[36px] text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              dataScope === 'demo'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sample Demo Data ({bookings.filter((b) => b.isDemoOrder).length})
          </button>
        </div>
      </div>

      {/* 6 Required Key Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Bookings</p>
          <p className="text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {totalBookings}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">All logged orders</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Pending Pickups</p>
          <p className="text-2xl font-bold font-mono-tabular text-amber-700 mt-1">
            {pendingPickups}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Confirmed / Scheduled
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Orders in Progress</p>
          <p className="text-2xl font-bold font-mono-tabular text-sky-700 mt-1">
            {ordersInProgress}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Collected / Wash / Ready
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Completed Deliveries</p>
          <p className="text-2xl font-bold font-mono-tabular text-emerald-700 mt-1">
            {completedDeliveries}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Delivered to hostel/PG
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Total Kg Processed</p>
          <p className="text-2xl font-bold font-mono-tabular text-slate-900 mt-1">
            {totalKilogramsProcessed.toFixed(1)}{' '}
            <span className="text-xs font-normal">kg</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Active laundry load</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-4">
          <p className="text-xs text-sky-300">Estimated Revenue</p>
          <p className="text-2xl font-bold font-mono-tabular text-white mt-1">
            {formatINR(estimatedRevenue)}
          </p>
          <p className="text-[11px] text-sky-200 font-mono-tabular mt-1">
            Margin: {formatINR(totalContributionMargin)} (40%)
          </p>
        </div>
      </div>

      {/* Simple Charts for Orders and Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Orders by Stage Bar Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Orders Pipeline by Operational Stage
              </h2>
              <p className="text-xs text-slate-500">
                Live distribution across the 6 laundry fulfillment steps
              </p>
            </div>
            <span className="text-xs font-mono-tabular text-slate-500">
              {activeBookings.length} active
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {statusCounts.map((item) => {
              const widthPct = Math.round((item.count / maxStatusCount) * 100);
              return (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {item.status}
                    </span>
                    <span className="font-mono-tabular font-semibold text-slate-900">
                      {item.count} {item.count === 1 ? 'order' : 'orders'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(widthPct, item.count > 0 ? 10 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 6 Cols: Revenue, Variable Cost & Contribution Margin Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Revenue & Contribution Margin Chart
                </h2>
                <p className="text-xs text-slate-500">
                  Based on Venture Plan: ₹100/kg Price · ₹60/kg Variable Cost · ₹40/kg Margin
                </p>
              </div>
              <span className="text-xs font-mono-tabular font-semibold text-sky-700">
                {totalKilogramsProcessed.toFixed(1)} kg total
              </span>
            </div>

            {/* Visual Stacked Bar Breakdown */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-mono-tabular">
                <span className="text-slate-600">
                  Gross Revenue (100% · ₹100/kg)
                </span>
                <span className="font-bold text-slate-900">
                  {formatINR(estimatedRevenue)}
                </span>
              </div>
              <div className="w-full h-4 bg-slate-900 rounded-lg overflow-hidden flex">
                <div
                  className="h-full bg-slate-500"
                  style={{ width: '60%' }}
                  title="Estimated Variable Cost (60%)"
                />
                <div
                  className="h-full bg-sky-500"
                  style={{ width: '40%' }}
                  title="Contribution Margin (40%)"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Variable Cost (60%): {formatINR(totalVariableCost)}</span>
                <span className="font-semibold text-sky-700">
                  Contribution Margin (40%): {formatINR(totalContributionMargin)}
                </span>
              </div>
            </div>

            {/* Order-by-Order Revenue Mini Bars */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                Per-Booking Revenue & Margin Breakdown:
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {activeBookings.map((b) => {
                  const kg = b.confirmedWeightKg ?? b.estimatedWeightKg;
                  const rev = kg * BASE_PRICE_PER_KG;
                  const margin = kg * CONTRIBUTION_MARGIN_PER_KG;
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-xs font-mono-tabular py-1 border-b border-slate-50"
                    >
                      <span className="text-slate-700 truncate max-w-[180px]">
                        {b.id} ({b.studentName.split(' (')[0]})
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{kg} kg</span>
                        <span className="font-semibold text-slate-900">
                          Rev: {formatINR(rev)}
                        </span>
                        <span className="text-sky-700 font-semibold">
                          Margin: {formatINR(margin)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Management Table with Live Status & Weight Updates */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Booking Management & Live Status Controls
            </h2>
            <p className="text-xs text-slate-500">
              Update any order’s status or confirm digital scale weight to demonstrate real-time synchronization with My Orders and Order Tracking.
            </p>
          </div>
          <span className="text-xs font-mono-tabular text-slate-500">
            Showing {scopedBookings.length} bookings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
                <th className="py-3 px-4">Booking ID & Type</th>
                <th className="py-3 px-4">Student & Hostel / PG</th>
                <th className="py-3 px-4">Pickup Slot</th>
                <th className="py-3 px-4 text-right">Weight (kg)</th>
                <th className="py-3 px-4 text-right">Amount (@ ₹100)</th>
                <th className="py-3 px-4">Update Status (Demo Control)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {scopedBookings.map((booking) => {
                const effectiveKg =
                  booking.confirmedWeightKg ?? booking.estimatedWeightKg;
                const effectiveAmount =
                  booking.finalPrice ?? booking.estimatedPrice;

                return (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono-tabular align-top">
                      <div className="font-bold text-slate-900">
                        {booking.id}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {booking.isDemoOrder ? 'Sample Demo' : 'User Booking'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <div className="font-semibold text-slate-900">
                        {booking.studentName}
                      </div>
                      <div className="text-slate-500 truncate max-w-[220px]">
                        {booking.hostelOrPgName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono-tabular">
                        +91 {booking.mobileNumber} · {booking.pickupAddress}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono-tabular text-slate-700 align-top">
                      <div>{booking.pickupDate}</div>
                      <div className="text-[11px] text-slate-500">
                        {booking.pickupTimeSlot.split(' (')[0]}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono-tabular align-top">
                      {editingWeightId === booking.id ? (
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            min={0.5}
                            max={30}
                            step={0.1}
                            value={weightDraft}
                            onChange={(e) => setWeightDraft(e.target.value)}
                            className="w-16 px-2 py-1 text-xs border border-sky-400 rounded text-right"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const val = parseFloat(weightDraft);
                              if (!isNaN(val) && val >= 0.5 && val <= 30) {
                                onUpdateStatus(
                                  booking.id,
                                  booking.status,
                                  Number(val.toFixed(1))
                                );
                              }
                              setEditingWeightId(null);
                            }}
                            className="px-2 py-1 bg-sky-600 text-white rounded text-[11px] font-semibold cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-slate-900">
                            {effectiveKg} kg
                          </span>
                          <div className="text-[11px] text-slate-500">
                            {booking.confirmedWeightKg !== undefined
                              ? 'Confirmed'
                              : 'Estimated'}{' '}
                            ·{' '}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingWeightId(booking.id);
                                setWeightDraft(String(effectiveKg));
                              }}
                              className="text-sky-700 hover:underline cursor-pointer"
                            >
                              Weigh
                            </button>
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono-tabular align-top">
                      <div className="font-bold text-slate-900">
                        {formatINR(effectiveAmount)}
                      </div>
                      <div className="text-[11px] text-sky-700">
                        Margin: {formatINR(effectiveKg * CONTRIBUTION_MARGIN_PER_KG)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 align-top">
                      <select
                        aria-label={`Update status for ${booking.id}`}
                        value={booking.status}
                        onChange={(e) =>
                          onUpdateStatus(
                            booking.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                      >
                        {ORDER_STATUS_STEPS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right align-top">
                      <button
                        type="button"
                        onClick={() => onTrackOrder(booking.id)}
                        className="px-3 py-1.5 min-h-[32px] text-xs font-semibold text-sky-700 hover:bg-sky-50 rounded-lg inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>Tracker</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
