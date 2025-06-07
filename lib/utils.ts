import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * UUID (v4) oluşturan yardımcı fonksiyon
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Tarih formatlamak için yardımcı fonksiyon
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
};

/**
 * Saat formatlamak için yardımcı fonksiyon
 */
export const formatTime = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
};

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 */
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Tarihi insan tarafından okunabilir formatta döndüren yardımcı fonksiyon
 */
export const getReadableDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  // Eğer bugünse veya yarınsa
  if (dateString === today.toISOString().split('T')[0]) {
    return 'Bugün';
  } else if (dateString === tomorrow.toISOString().split('T')[0]) {
    return 'Yarın';
  } else {
    // Diğer durumlar için
    return formatDate(date);
  }
};

/**
 * İki tarihin aynı gün olup olmadığını kontrol eden fonksiyon
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Haftanın günlerini Türkçe olarak döndüren yardımcı fonksiyon
 */
export const getWeekdayName = (day: number): string => {
  const weekdays = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  return weekdays[day];
};

/**
 * Ayın adını Türkçe olarak döndüren yardımcı fonksiyon
 */
export const getMonthName = (month: number): string => {
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  return months[month];
};
