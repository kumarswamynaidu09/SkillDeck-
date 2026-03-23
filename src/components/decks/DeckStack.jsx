import React from 'react';
import { AnimatePresence } from 'framer-motion';
import SwipeDeck from './SwipeDeck';
import { Loader2, Inbox } from 'lucide-react';

export default function DeckStack({ 
  professionals, 
  onSwipe, 
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!professionals || professionals.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto border-2 border-blue-200">
            <Inbox className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No More Cards</h3>
          <p className="text-gray-600 max-w-xs">Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex-1 flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm h-[450px]">
        <AnimatePresence>
          {professionals.slice(0, 3).map((professional, index) => (
            <SwipeDeck
              key={professional.id}
              professional={professional}
              onSwipe={onSwipe}
              isTop={index === 0}
              stackIndex={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}