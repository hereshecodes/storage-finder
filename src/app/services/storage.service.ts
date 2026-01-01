import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { StorageUnit, UnitSize, UnitFeature } from '../models/storage-unit.model';

export interface SearchFilters {
  location: string;
  size: UnitSize | 'all';
  maxPrice: number | null;
  features: UnitFeature[];
  sortBy: 'price' | 'distance' | 'rating';
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private mockUnits: StorageUnit[] = [
    {
      id: '1',
      facilityName: 'StoreSafe Austin',
      address: '2100 S Lamar Blvd',
      city: 'Austin, TX',
      distance: 1.2,
      size: 'medium',
      price: 129,
      features: ['climate-controlled', '24-hour-access', 'security-cameras', 'onsite-manager'],
      availability: 'available',
      rating: 4.8,
      reviewCount: 234,
      imageUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop',
      promotion: 'First month free!'
    },
    {
      id: '2',
      facilityName: 'SecureBox South Austin',
      address: '4501 S Congress Ave',
      city: 'Austin, TX',
      distance: 2.4,
      size: 'large',
      price: 199,
      features: ['drive-up', '24-hour-access', 'security-cameras', 'truck-rental'],
      availability: 'available',
      rating: 4.6,
      reviewCount: 189,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      facilityName: 'Climate King Storage',
      address: '8900 Research Blvd',
      city: 'Austin, TX',
      distance: 5.1,
      size: 'small',
      price: 79,
      features: ['climate-controlled', 'elevator', 'security-cameras', 'moving-supplies'],
      availability: 'limited',
      rating: 4.9,
      reviewCount: 412,
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      promotion: '50% off for 3 months'
    },
    {
      id: '4',
      facilityName: 'EZ Access Storage',
      address: '1200 E 6th St',
      city: 'Austin, TX',
      distance: 0.8,
      size: 'medium',
      price: 149,
      features: ['24-hour-access', 'drive-up', 'security-cameras'],
      availability: 'available',
      rating: 4.4,
      reviewCount: 98,
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop'
    },
    {
      id: '5',
      facilityName: 'Budget Store & Lock',
      address: '3300 N IH-35',
      city: 'Austin, TX',
      distance: 3.7,
      size: 'xlarge',
      price: 249,
      features: ['drive-up', 'truck-rental', 'security-cameras', 'onsite-manager'],
      availability: 'available',
      rating: 4.2,
      reviewCount: 156,
      imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop'
    },
    {
      id: '6',
      facilityName: 'Premier Storage Solutions',
      address: '5600 Burnet Rd',
      city: 'Austin, TX',
      distance: 4.2,
      size: 'small',
      price: 59,
      features: ['elevator', 'security-cameras', 'moving-supplies'],
      availability: 'available',
      rating: 4.5,
      reviewCount: 267,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop',
      promotion: 'No deposit required'
    },
    {
      id: '7',
      facilityName: 'Downtown Mini Storage',
      address: '700 Lavaca St',
      city: 'Austin, TX',
      distance: 0.3,
      size: 'medium',
      price: 189,
      features: ['climate-controlled', '24-hour-access', 'elevator', 'onsite-manager'],
      availability: 'limited',
      rating: 4.7,
      reviewCount: 321,
      imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop'
    },
    {
      id: '8',
      facilityName: 'Family Storage Center',
      address: '9800 Manchaca Rd',
      city: 'Austin, TX',
      distance: 6.8,
      size: 'large',
      price: 159,
      features: ['drive-up', 'security-cameras', 'truck-rental', 'moving-supplies'],
      availability: 'available',
      rating: 4.3,
      reviewCount: 145,
      imageUrl: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop',
      promotion: 'Free lock with rental'
    }
  ];

  private filtersSubject = new BehaviorSubject<SearchFilters>({
    location: 'Austin, TX',
    size: 'all',
    maxPrice: null,
    features: [],
    sortBy: 'distance'
  });

  filters$ = this.filtersSubject.asObservable();

  constructor() {}

  getUnits(filters: SearchFilters): Observable<StorageUnit[]> {
    // Simulate API delay
    return of(this.mockUnits).pipe(
      delay(300),
      map(units => this.filterAndSort(units, filters))
    );
  }

  private filterAndSort(units: StorageUnit[], filters: SearchFilters): StorageUnit[] {
    let filtered = [...units];

    // Filter by size
    if (filters.size !== 'all') {
      filtered = filtered.filter(u => u.size === filters.size);
    }

    // Filter by max price
    if (filters.maxPrice) {
      filtered = filtered.filter(u => u.price <= filters.maxPrice!);
    }

    // Filter by features
    if (filters.features.length > 0) {
      filtered = filtered.filter(u =>
        filters.features.every(f => u.features.includes(f))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }

  updateFilters(filters: Partial<SearchFilters>): void {
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      ...filters
    });
  }

  getFilters(): SearchFilters {
    return this.filtersSubject.value;
  }
}
