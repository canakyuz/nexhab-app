import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '~/lib/utils';
import { CircularProgress } from './ui/progress';
import { Check, X, Plus, ChevronRight } from 'lucide-react-native';

// Habit types
export interface HabitCardProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  iconName?: string;
  iconColor?: string;
  progress?: number;
  goal?: string;
  completed?: boolean;
  onPress?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
  onFail?: () => void;
  onIncrement?: () => void;
  showActions?: boolean;
  friends?: { id: string; avatar?: string }[];
}

export function HabitCard({
  title,
  icon,
  iconName,
  iconColor = 'primary',
  progress = 0,
  goal,
  completed,
  onPress,
  onComplete,
  onSkip,
  onFail,
  onIncrement,
  showActions = true,
  friends,
}: HabitCardProps) {
  
  // Default icon if none provided
  const habitIcon = icon || (
    <View className={`w-8 h-8 items-center justify-center rounded-full bg-${iconColor}`}>
      <Text className="text-white text-lg font-semibold">{iconName ? iconName.charAt(0) : '💧'}</Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-card rounded-3xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-center">
        <View className="mr-3">
          <CircularProgress 
            value={progress} 
            size={44}
            strokeWidth={3}
            showValue={false}
          />
          <View className="absolute inset-0 items-center justify-center">
            {habitIcon}
          </View>
        </View>
        
        <View className="flex-1 mr-2">
          <Text className="text-base font-semibold text-foreground">{title}</Text>
          {goal && (
            <Text className="text-sm text-muted-foreground">{goal}</Text>
          )}
        </View>
        
        {/* Friends who do this habit */}
        {friends && friends.length > 0 && (
          <View className="flex-row">
            {friends.slice(0, 2).map((friend, index) => (
              <View 
                key={friend.id} 
                className={cn(
                  "w-8 h-8 rounded-full bg-primary/20 items-center justify-center border-2 border-background",
                  index > 0 && "-ml-2"
                )}
              >
                <Text className="text-xs text-primary font-medium">
                  {friend.avatar || friend.id.charAt(0)}
                </Text>
              </View>
            ))}
            {friends.length > 2 && (
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center border-2 border-background -ml-2">
                <Text className="text-xs text-primary font-medium">+{friends.length - 2}</Text>
              </View>
            )}
          </View>
        )}
        
        {/* Action buttons */}
        {showActions && (
          <View className="ml-2">
            {completed ? (
              <View className="w-10 h-10 rounded-full bg-success/10 items-center justify-center">
                <Check size={20} color="hsl(var(--success))" />
              </View>
            ) : onIncrement ? (
              <TouchableOpacity 
                onPress={onIncrement}
                className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center"
              >
                <Plus size={20} color="hsl(var(--primary))" />
              </TouchableOpacity>
            ) : (
              <View className="flex-row">
                {onComplete && (
                  <TouchableOpacity 
                    onPress={onComplete}
                    className="w-10 h-10 rounded-full bg-success/10 items-center justify-center"
                  >
                    <Check size={20} color="hsl(var(--success))" />
                  </TouchableOpacity>
                )}
                {(onFail || onSkip) && (
                  <View className="flex-row ml-2">
                    {onFail && (
                      <TouchableOpacity 
                        onPress={onFail}
                        className="w-10 h-10 rounded-full bg-destructive/10 items-center justify-center"
                      >
                        <X size={20} color="hsl(var(--destructive))" />
                      </TouchableOpacity>
                    )}
                    {onSkip && (
                      <TouchableOpacity 
                        onPress={onSkip}
                        className="w-10 h-10 rounded-full bg-muted items-center justify-center ml-2"
                      >
                        <ChevronRight size={20} color="hsl(var(--muted-foreground))" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
} 