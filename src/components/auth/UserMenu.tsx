import React, { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../lib/store';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-primary"
      >
        <User className="w-5 h-5" />
        <span>{user?.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}