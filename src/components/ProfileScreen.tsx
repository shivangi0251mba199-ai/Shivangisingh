import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Edit3,
  Save,
  HelpCircle,
  Info,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { StudentProfile, ScreenId } from '../types';
import { DGU_HOSTELS_AND_PGS, PICKUP_TIME_SLOTS } from '../data/mockData';
import { QuickWashLogoMark } from './Navbar';

interface ProfileScreenProps {
  profile: StudentProfile;
  onSaveProfile: (updated: StudentProfile) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onSaveProfile,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<StudentProfile>(profile);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.studentName.trim() || !formState.mobileNumber.trim()) {
      return;
    }
    onSaveProfile(formState);
    setIsEditing(false);
    setSaveMessage(
      'Student profile and saved hostel/PG address updated. Future bookings will auto-fill with these details.'
    );
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-semibold text-sky-700">
            DBS Global University Student Account & Campus Preferences
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Student Profile & Support
          </h1>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setFormState(profile);
              setIsEditing(true);
            }}
            className="px-4 py-2.5 min-h-[42px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 transition-colors self-start sm:self-auto cursor-pointer whitespace-nowrap"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile & Hostel Address</span>
          </button>
        )}
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid: Left 7 Cols Profile Details / Editor, Right 5 Cols Help & About */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Student Details & Saved Hostel/PG Address */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs text-slate-500 font-mono-tabular">
                    {profile.studentId} · {profile.program}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {profile.studentName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    DBS Global University (DGU), Dehradun
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormState(profile);
                    setIsEditing(true);
                  }}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 cursor-pointer whitespace-nowrap"
                >
                  Modify Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">
                    Mobile Number (WhatsApp Booking)
                  </p>
                  <p className="font-semibold font-mono-tabular text-slate-900">
                    +91 {profile.mobileNumber}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-500">University Email</p>
                  <p className="font-semibold text-slate-900">
                    {profile.email}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Saved Hostel / PG Residence
                  </p>
                  <p className="font-semibold text-slate-900">
                    {profile.hostelOrPgName}
                  </p>
                  <p className="text-xs text-slate-600">
                    {profile.pickupAddress}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Default Pickup Time Window
                  </p>
                  <p className="font-medium text-slate-900">
                    {profile.preferredTimeSlot}
                  </p>
                </div>

                <div className="sm:col-span-2 space-y-1 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Saved Fabric & Wash Preferences
                  </p>
                  <p className="text-xs text-slate-700">
                    {profile.defaultFabricNotes || 'No default preferences saved.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Saved details auto-fill when you book a pickup.
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate('book')}
                  className="px-4 py-2 min-h-[40px] bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                >
                  Book Pickup with Saved Address →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Edit Student Profile & Hostel Address
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prof-name"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Student Name
                  </label>
                  <input
                    id="prof-name"
                    type="text"
                    required
                    value={formState.studentName}
                    onChange={(e) =>
                      setFormState({ ...formState, studentName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prof-id"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    DGU Student ID / Roll No.
                  </label>
                  <input
                    id="prof-id"
                    type="text"
                    value={formState.studentId}
                    onChange={(e) =>
                      setFormState({ ...formState, studentId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono-tabular rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prof-mobile"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Mobile Number (10 digits)
                  </label>
                  <input
                    id="prof-mobile"
                    type="tel"
                    maxLength={10}
                    required
                    value={formState.mobileNumber}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        mobileNumber: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    className="w-full px-3.5 py-2 text-sm font-mono-tabular rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="prof-email"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    University Email
                  </label>
                  <input
                    id="prof-email"
                    type="email"
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="prof-hostel"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Saved Hostel or PG Name
                </label>
                <select
                  id="prof-hostel"
                  value={formState.hostelOrPgName}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      hostelOrPgName: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {DGU_HOSTELS_AND_PGS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="prof-address"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Room Number, Floor & Block Address
                </label>
                <input
                  id="prof-address"
                  type="text"
                  required
                  value={formState.pickupAddress}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      pickupAddress: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label
                  htmlFor="prof-slot"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Preferred Pickup Time Slot
                </label>
                <select
                  id="prof-slot"
                  value={formState.preferredTimeSlot}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      preferredTimeSlot: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {PICKUP_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="prof-notes"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Default Special Instructions
                </label>
                <textarea
                  id="prof-notes"
                  rows={2}
                  value={formState.defaultFabricNotes}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      defaultFabricNotes: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 min-h-[40px] bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 min-h-[40px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Student Profile</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right 5 Cols: Help & Support + About QuickWash Campus */}
        <div className="lg:col-span-5 space-y-6">
          {/* Help & Support Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <p className="text-xs font-semibold text-sky-700">
                Student Help Desk
              </p>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                Help & Support
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Need to reschedule a pickup slot or update your room number before our campus runner arrives?
              </p>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 font-mono-tabular">
                <p className="text-slate-900 font-semibold">
                  Campus Pickup Desk (DGU Selaqui Hub)
                </p>
                <p>Operating Hours: 08:00 AM – 09:00 PM (Mon–Sun)</p>
                <p>Support Helpline: +91 98765-00100 (Demo Line)</p>
                <p>Email: support@quickwashcampus.demo</p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="font-semibold text-slate-900">
                  Quick Answers for Students:
                </p>
                <p>
                  <strong className="text-slate-800">
                    How is weight confirmed?
                  </strong>{' '}
                  Our runner brings a portable digital scale to your hostel/PG doorstep and weighs your laundry bag in front of you.
                </p>
                <p>
                  <strong className="text-slate-800">
                    Are clothes washed together with other students?
                  </strong>{' '}
                  Never. Each booking ID is processed in a separate washing & drying batch.
                </p>
              </div>
            </div>
          </div>

          {/* About QuickWash Campus Section */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <QuickWashLogoMark className="w-9 h-9 shrink-0" />
              <div>
                <p className="text-xs text-sky-300 font-medium">
                  About QuickWash Campus
                </p>
                <h3 className="text-base font-bold">
                  DBS Global University Venture Prototype
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">QuickWash Campus</strong> is a student-focused laundry pickup, weight confirmation, washing & folding, and doorstep delivery venture designed for Entrepreneurship & Innovation (Assignment 2: Build the Venture App) at DBS Global University, Dehradun.
              </p>
              <p>
                <strong className="text-white">MVP Scope:</strong> Scheduled hostel/PG pickup, WhatsApp-style booking confirmation, on-spot digital weight verification at ₹100/kg, hygienic wash & fold, and 24–48 hour doorstep delivery.
              </p>
              <p className="text-slate-400">
                <strong className="text-slate-200">Prototype Notice:</strong>{' '}
                Live GPS tracking and real payment gateways are intentionally excluded from the MVP. Bookings are persisted locally in your browser for live classroom demonstration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
