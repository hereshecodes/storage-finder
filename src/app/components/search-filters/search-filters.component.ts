import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { StorageService, SearchFilters } from '../../services/storage.service';
import { UnitSize, UnitFeature, UNIT_SIZE_LABELS, FEATURE_LABELS } from '../../models/storage-unit.model';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss']
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  filters: SearchFilters = {
    location: 'Austin, TX',
    size: 'all',
    maxPrice: null,
    features: [],
    sortBy: 'distance'
  };

  sizes: { value: UnitSize | 'all'; label: string; dimensions?: string }[] = [
    { value: 'all', label: 'All Sizes' },
    { value: 'small', label: UNIT_SIZE_LABELS.small.label, dimensions: UNIT_SIZE_LABELS.small.dimensions },
    { value: 'medium', label: UNIT_SIZE_LABELS.medium.label, dimensions: UNIT_SIZE_LABELS.medium.dimensions },
    { value: 'large', label: UNIT_SIZE_LABELS.large.label, dimensions: UNIT_SIZE_LABELS.large.dimensions },
    { value: 'xlarge', label: UNIT_SIZE_LABELS.xlarge.label, dimensions: UNIT_SIZE_LABELS.xlarge.dimensions },
  ];

  features: { value: UnitFeature; label: string; icon: string }[] = [
    { value: 'climate-controlled', ...FEATURE_LABELS['climate-controlled'] },
    { value: '24-hour-access', ...FEATURE_LABELS['24-hour-access'] },
    { value: 'drive-up', ...FEATURE_LABELS['drive-up'] },
    { value: 'security-cameras', ...FEATURE_LABELS['security-cameras'] },
  ];

  priceOptions = [
    { value: null, label: 'Any Price' },
    { value: 100, label: 'Under $100' },
    { value: 150, label: 'Under $150' },
    { value: 200, label: 'Under $200' },
    { value: 300, label: 'Under $300' },
  ];

  showMobileFilters = false;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.filters = { ...filters };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLocationChange(): void {
    this.storageService.updateFilters({ location: this.filters.location });
  }

  onSizeChange(): void {
    this.storageService.updateFilters({ size: this.filters.size });
  }

  onPriceChange(): void {
    this.storageService.updateFilters({ maxPrice: this.filters.maxPrice });
  }

  onSortChange(): void {
    this.storageService.updateFilters({ sortBy: this.filters.sortBy });
  }

  toggleFeature(feature: UnitFeature): void {
    const features = this.filters.features.includes(feature)
      ? this.filters.features.filter(f => f !== feature)
      : [...this.filters.features, feature];
    this.filters.features = features;
    this.storageService.updateFilters({ features });
  }

  isFeatureActive(feature: UnitFeature): boolean {
    return this.filters.features.includes(feature);
  }

  clearFilters(): void {
    this.storageService.updateFilters({
      size: 'all',
      maxPrice: null,
      features: [],
      sortBy: 'distance'
    });
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.filters.size !== 'all') count++;
    if (this.filters.maxPrice) count++;
    count += this.filters.features.length;
    return count;
  }
}
