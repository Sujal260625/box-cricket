import React from 'react';
import { User } from '../../../App';
import { UserCircle, Mail, Shield, Calendar, QrCode, Hash } from 'lucide-react';

interface StaffIdCardProps {
  user: User;
}

export default function StaffIdCard({ user }: StaffIdCardProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white relative">
        <div className="h-32 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>

        <div className="px-8 pb-8 -mt-16 text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mx-auto border-4 border-white">
              <div className="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden border border-blue-100">
                <UserCircle className="w-24 h-24" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-black text-gray-800">{user.name}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">{user.role}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-left bg-gray-50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-gray-700">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                <Hash className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Staff ID</p>
                <p className="text-sm font-bold text-gray-700">STF-{user.id.slice(-6).toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-gray-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Member Since</p>
                <p className="text-sm font-bold text-gray-700">October 2025</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="p-4 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
              <QrCode className="w-24 h-24 text-gray-800" />
            </div>
          </div>

          <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
