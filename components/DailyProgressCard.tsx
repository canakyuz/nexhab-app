import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Progress } from './ui/progress';
import { Flame } from 'lucide-react-native';
import { cn } from '~/lib/utils';

interface DailyProgressCardProps {
  completed: number;
  total: number;
  percentage: number;
  onPress?: () => void;
}

export function DailyProgressCard({
  completed,
  total,
  percentage,
  onPress,
}: DailyProgressCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-primary rounded-2xl p-4 mb-4 shadow-sm overflow-hidden"
    >
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 items-center justify-center rounded-full bg-white/20">
          <Flame size={22} color="#fff" />
        </View>
        
        <View className="ml-3">
          <Text className="text-base font-semibold text-white">Günlük hedefler tamamlanıyor! 🔥</Text>
          <Text className="text-sm text-white/80">
            {completed} / {total} tamamlandı
          </Text>
        </View>
        
        <View className="ml-auto bg-white/20 rounded-full w-12 h-12 items-center justify-center">
          <Text className="text-white font-bold">%{Math.round(percentage)}</Text>
        </View>
      </View>
      
      <Progress 
        value={percentage} 
        className="h-2 bg-white/20" 
        indicatorClassName={cn(
          "bg-white",
          percentage < 25 && "bg-opacity-80",
          percentage >= 25 && percentage < 75 && "bg-opacity-90",
          percentage >= 75 && "bg-opacity-100"
        )}
      />
    </TouchableOpacity>
  );
} 