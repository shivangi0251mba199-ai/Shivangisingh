/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
  LaundryBooking,
  OrderStatus,
  ScreenId,
  StudentProfile,
  BASE_PRICE_PER_KG,
} from './types';
import {
  DEFAULT_STUDENT_PROFILE,
  INITIAL_DEMO_ORDERS,
} from './data/mockData';
import { Navbar, QuickWashLogoMark } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { BookPickupScreen } from './components/BookPickupScreen';
import { PricingScreen } from './components/PricingScreen';
import { OrdersScreen } from './components/OrdersScreen';
import { TrackingScreen } from './components/TrackingScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminDashboardScreen } from './components/AdminDashboardScreen';

const BOOKINGS_STORAGE_KEY = 'quickwash_campus_bookings_v1';
const PROFILE_STORAGE_KEY = 'quickwash_campus_profile_v1';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [presetWeight, setPresetWeight] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    INITIAL_DEMO_ORDERS[0].id
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [bookings, setBookings] = useState<LaundryBooking[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial demo orders if localStorage is unavailable
    }
    return INITIAL_DEMO_ORDERS;
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to default student profile
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Ignore storage quota errors
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleNavigate = (screen: ScreenId, weight?: number) => {
    if (weight !== undefined) {
      setPresetWeight(weight);
    }
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateBooking = (newBooking: LaundryBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setSelectedOrderId(newBooking.id);
    showToast(
      `Booking ${newBooking.id} confirmed for ${newBooking.estimatedWeightKg} kg.`
    );
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveScreen('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: OrderStatus,
    confirmedWeight?: number
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== orderId) return b;
        const updatedWeight =
          confirmedWeight !== undefined ? confirmedWeight : b.confirmedWeightKg;
        const updatedFinalPrice =
          updatedWeight !== undefined
            ? Math.round(updatedWeight * BASE_PRICE_PER_KG)
            : b.finalPrice;
        return {
          ...b,
          status: newStatus,
          confirmedWeightKg: updatedWeight,
          finalPrice: updatedFinalPrice,
          updatedAt: `2026-09-30 ${timeStr}`,
        };
      })
    );

    showToast(
      confirmedWeight !== undefined
        ? `Order ${orderId} updated: ${confirmedWeight} kg confirmed (${newStatus}).`
        : `Order ${orderId} status updated to "${newStatus}".`
    );
  };

  const handleCancelOrder = (orderId: string) => {
    handleUpdateOrderStatus(orderId, 'Cancelled');
  };

  const handleResetDemoData = () => {
    setBookings(INITIAL_DEMO_ORDERS);
    setSelectedOrderId(INITIAL_DEMO_ORDERS[0].id);
    showToast('Sample demonstration orders restored to initial state.');
  };

  const userOrdersCount = bookings.filter((b) => !b.isDemoOrder).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        activeScreen={activeScreen}
        onNavigate={(s) => handleNavigate(s)}
        userOrdersCount={userOrdersCount}
      />

      {/* Non-intrusive Action Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-16 md:bottom-6 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs font-medium max-w-sm"
        >
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeScreen === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            studentName={profile.studentName}
          />
        )}

        {activeScreen === 'book' && (
          <BookPickupScreen
            profile={profile}
            presetWeight={presetWeight}
            onCreateBooking={handleCreateBooking}
            onNavigate={(s) => handleNavigate(s)}
            onTrackOrder={handleTrackOrder}
          />
        )}

        {activeScreen === 'pricing' && (
          <PricingScreen onNavigate={handleNavigate} />
        )}

        {activeScreen === 'orders' && (
          <OrdersScreen
            bookings={bookings}
            onNavigate={(s) => handleNavigate(s)}
            onTrackOrder={handleTrackOrder}
            onCancelOrder={handleCancelOrder}
          />
        )}

        {activeScreen === 'tracking' && (
          <TrackingScreen
            bookings={bookings}
            selectedOrderId={selectedOrderId}
            onSelectOrder={setSelectedOrderId}
            onUpdateStatus={handleUpdateOrderStatus}
            onCancelOrder={handleCancelOrder}
            onNavigate={(s) => handleNavigate(s)}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileScreen
            profile={profile}
            onSaveProfile={(updated) => {
              setProfile(updated);
              showToast('Student profile saved.');
            }}
            onNavigate={(s) => handleNavigate(s)}
          />
        )}

        {activeScreen === 'admin' && (
          <AdminDashboardScreen
            bookings={bookings}
            onUpdateStatus={handleUpdateOrderStatus}
            onResetDemoData={handleResetDemoData}
            onTrackOrder={handleTrackOrder}
            onNavigate={(s) => handleNavigate(s)}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 pb-20 md:pb-8 pt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <QuickWashLogoMark className="w-8 h-8 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">
                QuickWash Campus
              </p>
              <p className="text-xs text-slate-500">
                Student Laundry Pickup & Doorstep Delivery Prototype · DBS Global University (DGU), Dehradun
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('book')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Book Pickup
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('pricing')}
              className="hover:text-slate-900 cursor-pointer"
            >
              ₹100/kg Pricing
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('orders')}
              className="hover:text-slate-900 cursor-pointer"
            >
              My Orders
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('admin')}
              className="hover:text-slate-900 cursor-pointer"
            >
              Admin Demo
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
