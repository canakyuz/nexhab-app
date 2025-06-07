import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { cn } from '~/lib/utils';

// Gün bilgilerini tanımlayan tip
interface DayInfo {
  day: number;
  weekday: string;
  isToday?: boolean;
  isSelected?: boolean;
}

interface DateSelectorProps {
  days: DayInfo[];
  onSelectDay: (day: DayInfo) => void;
  selectedDay?: number;
}

export function DateSelector({
  days,
  onSelectDay,
  selectedDay,
}: DateSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {days.map((day) => {
        const isSelected = selectedDay === day.day || day.isSelected;
        
        return (
          <TouchableOpacity
            key={day.day}
            onPress={() => onSelectDay(day)}
            activeOpacity={0.7}
            className={cn(
              "items-center justify-center px-2 py-3 mx-1 rounded-3xl min-w-[56px]",
              isSelected ? "bg-primary" : "bg-card"
            )}
          >
            <Text 
              className={cn(
                "text-base font-bold mb-1",
                isSelected ? "text-white" : "text-foreground"
              )}
            >
              {day.day}
            </Text>
            <Text 
              className={cn(
                "text-xs",
                isSelected ? "text-white" : "text-muted-foreground"
              )}
            >
              {day.weekday}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

// Örnek kullanım için yardımcı fonksiyon
export function generateWeekDays(selectedDate: Date = new Date()): DayInfo[] {
  const days: DayInfo[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Bugünden başlayarak 2 gün öncesi ve 4 gün sonrasını hesapla
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 2);
  
  const WEEKDAYS = ['PAZ', 'PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT'];
  
  // 7 gün oluştur
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();
    
    days.push({
      day: date.getDate(),
      weekday: WEEKDAYS[date.getDay()],
      isToday,
      isSelected,
    });
  }
  
  return days;
} 