import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Award, Clock, Users } from 'lucide-react-native';
import { cn } from '~/lib/utils';
import { Progress } from './ui/progress';

export interface ChallengeCardProps {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconEmoji?: string;
  timeLeft?: string;
  progress?: number;
  friendsJoined?: { id: string; avatar?: string }[];
  onPress?: () => void;
}

export function ChallengeCard({
  title,
  description,
  icon,
  iconEmoji,
  timeLeft,
  progress = 0,
  friendsJoined = [],
  onPress,
}: ChallengeCardProps) {
  
  // Default icon if none provided
  const challengeIcon = icon || (
    <View className="w-9 h-9 items-center justify-center rounded-md bg-primary/10">
      <Text className="text-xl">{iconEmoji || '🏆'}</Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-card rounded-3xl p-4 mb-3 shadow-sm"
    >
      <View className="flex-row items-center mb-3">
        <View className="mr-3">
          {challengeIcon}
        </View>
        
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">{title}</Text>
          
          <View className="flex-row items-center mt-1">
            {timeLeft && (
              <View className="flex-row items-center mr-4">
                <Clock size={14} color="hsl(var(--muted-foreground))" />
                <Text className="text-xs text-muted-foreground ml-1">{timeLeft}</Text>
              </View>
            )}
            
            {friendsJoined.length > 0 && (
              <View className="flex-row items-center">
                <Users size={14} color="hsl(var(--muted-foreground))" />
                <Text className="text-xs text-muted-foreground ml-1">
                  {friendsJoined.length} {friendsJoined.length === 1 ? 'arkadaş' : 'arkadaş'} katıldı
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      {/* Progress bar */}
      {progress > 0 && (
        <Progress 
          value={progress} 
          className="h-1.5" 
          indicatorClassName={cn(
            progress < 25 ? "bg-destructive" : 
            progress < 75 ? "bg-warning" : 
            "bg-success"
          )}
        />
      )}
      
      {/* Friends avatars */}
      {friendsJoined.length > 0 && (
        <View className="flex-row mt-3">
          {friendsJoined.slice(0, 3).map((friend, index) => (
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
          {friendsJoined.length > 3 && (
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center border-2 border-background -ml-2">
              <Text className="text-xs text-primary font-medium">+{friendsJoined.length - 3}</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
} 