import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Sun, Cloud, CloudRain } from 'lucide-react';

interface OutfitCalendarProps {
  wardrobeItems: any[];
  onPlanOutfit: (date: string, occasion: string) => void;
}

const OutfitCalendar: React.FC<OutfitCalendarProps> = ({ wardrobeItems, onPlanOutfit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [plannedOutfits, setPlannedOutfits] = useState<Record<string, any>>({});
  const [showPlanModal, setShowPlanModal] = useState(false);

  const occasions = ['Work', 'Casual', 'Date Night', 'Party', 'Formal', 'Weekend', 'Travel'];
  const weatherIcons = { sunny: Sun, cloudy: Cloud, rainy: CloudRain };

  useEffect(() => {
    // Load planned outfits from localStorage
    const saved = localStorage.getItem('plannedOutfits');
    if (saved) {
      setPlannedOutfits(JSON.parse(saved));
    }
  }, []);

  const saveOutfits = (outfits: Record<string, any>) => {
    setPlannedOutfits(outfits);
    localStorage.setItem('plannedOutfits', JSON.stringify(outfits));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getWeatherForDate = (date: Date) => {
    // Mock weather data
    const weathers = ['sunny', 'cloudy', 'rainy'];
    const hash = date.getDate() % 3;
    return weathers[hash];
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    setSelectedDate(dateStr);
    setShowPlanModal(true);
  };

  const handlePlanOutfit = (occasion: string) => {
    if (!selectedDate) return;
    
    const newOutfits = {
      ...plannedOutfits,
      [selectedDate]: {
        occasion,
        weather: getWeatherForDate(new Date(selectedDate)),
        planned: true,
        items: [] // This would be populated with actual outfit items
      }
    };
    
    saveOutfits(newOutfits);
    setShowPlanModal(false);
    onPlanOutfit(selectedDate, occasion);
  };

  const removeOutfit = (dateStr: string) => {
    const newOutfits = { ...plannedOutfits };
    delete newOutfits[dateStr];
    saveOutfits(newOutfits);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-2">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Outfit Calendar</h3>
            <p className="text-gray-600">Plan your outfits in advance</p>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="p-2 h-20" />;
          }

          const dateStr = formatDate(day);
          const outfit = plannedOutfits[dateStr];
          const isToday = dateStr === formatDate(new Date());
          const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
          const weather = getWeatherForDate(day);
          const WeatherIcon = weatherIcons[weather as keyof typeof weatherIcons];

          return (
            <motion.div
              key={dateStr}
              whileHover={{ scale: 1.02 }}
              className={`p-2 h-20 border border-gray-200 rounded-lg cursor-pointer transition-all ${
                isToday ? 'bg-purple-50 border-purple-300' : 'hover:bg-gray-50'
              } ${isPast ? 'opacity-60' : ''}`}
              onClick={() => !isPast && handleDateClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${isToday ? 'text-purple-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </span>
                <WeatherIcon className="w-3 h-3 text-gray-400" />
              </div>
              
              {outfit && (
                <div className="space-y-1">
                  <div className={`text-xs px-2 py-1 rounded text-white text-center ${
                    outfit.occasion === 'Work' ? 'bg-blue-500' :
                    outfit.occasion === 'Casual' ? 'bg-green-500' :
                    outfit.occasion === 'Date Night' ? 'bg-pink-500' :
                    outfit.occasion === 'Party' ? 'bg-purple-500' :
                    outfit.occasion === 'Formal' ? 'bg-gray-800' :
                    'bg-orange-500'
                  }`}>
                    {outfit.occasion}
                  </div>
                  
                  {!isPast && (
                    <div className="flex justify-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDateClick(day);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOutfit(dateStr);
                        }}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {!outfit && !isPast && (
                <div className="flex justify-center items-center h-8">
                  <Plus className="w-4 h-4 text-gray-400" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Plan Outfit Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowPlanModal(false)}
            />

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 py-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Plan Outfit for {selectedDate && new Date(selectedDate).toLocaleDateString()}
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {occasions.map((occasion) => (
                    <motion.button
                      key={occasion}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlanOutfit(occasion)}
                      className="p-4 border border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
                    >
                      <span className="font-medium text-gray-900">{occasion}</span>
                    </motion.button>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitCalendar;
