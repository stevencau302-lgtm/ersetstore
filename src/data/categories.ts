import type { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'gadget', name: 'Gadget', emoji: '📱' },
  { id: 'audio', name: 'Audio', emoji: '🎧' },
  { id: 'homeware', name: 'Homeware', emoji: '🏠' },
  { id: 'otomotif', name: 'Otomotif', emoji: '🚗' },
  { id: 'outdoor', name: 'Outdoor Kit', emoji: '🏕️' },
  { id: 'tools', name: 'Tools', emoji: '🔧' },
  { id: 'hobby', name: 'Hobby', emoji: '🎨' },
  { id: 'toys', name: 'Toys', emoji: '🧸' },
];

export const getCategory = (id: string): Category | undefined =>
  CATEGORIES.find((c) => c.id === id);
