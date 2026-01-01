export interface StorageUnit {
  id: string;
  facilityName: string;
  address: string;
  city: string;
  distance: number; // miles
  size: UnitSize;
  price: number; // per month
  features: UnitFeature[];
  availability: 'available' | 'limited' | 'unavailable';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  promotion?: string;
}

export type UnitSize = 'small' | 'medium' | 'large' | 'xlarge';

export type UnitFeature =
  | 'climate-controlled'
  | '24-hour-access'
  | 'drive-up'
  | 'elevator'
  | 'security-cameras'
  | 'onsite-manager'
  | 'moving-supplies'
  | 'truck-rental';

export const UNIT_SIZE_LABELS: Record<UnitSize, { label: string; dimensions: string; description: string }> = {
  small: { label: 'Small', dimensions: "5' x 5'", description: 'Closet-sized, fits boxes and small furniture' },
  medium: { label: 'Medium', dimensions: "10' x 10'", description: 'Room-sized, fits a 1-bedroom apartment' },
  large: { label: 'Large', dimensions: "10' x 20'", description: 'Garage-sized, fits a 2-3 bedroom home' },
  xlarge: { label: 'Extra Large', dimensions: "10' x 30'", description: 'Warehouse-sized, fits a 4+ bedroom home' },
};

export const FEATURE_LABELS: Record<UnitFeature, { label: string; icon: string }> = {
  'climate-controlled': { label: 'Climate Controlled', icon: '❄️' },
  '24-hour-access': { label: '24-Hour Access', icon: '🕐' },
  'drive-up': { label: 'Drive-Up Access', icon: '🚗' },
  'elevator': { label: 'Elevator Access', icon: '🛗' },
  'security-cameras': { label: 'Security Cameras', icon: '📹' },
  'onsite-manager': { label: 'Onsite Manager', icon: '👤' },
  'moving-supplies': { label: 'Moving Supplies', icon: '📦' },
  'truck-rental': { label: 'Truck Rental', icon: '🚚' },
};
