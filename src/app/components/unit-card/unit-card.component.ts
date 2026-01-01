import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageUnit, UNIT_SIZE_LABELS, FEATURE_LABELS } from '../../models/storage-unit.model';

@Component({
  selector: 'app-unit-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unit-card.component.html',
  styleUrls: ['./unit-card.component.scss']
})
export class UnitCardComponent {
  @Input() unit!: StorageUnit;

  get sizeLabel(): string {
    return UNIT_SIZE_LABELS[this.unit.size].label;
  }

  get sizeDimensions(): string {
    return UNIT_SIZE_LABELS[this.unit.size].dimensions;
  }

  get displayedFeatures() {
    return this.unit.features.slice(0, 4).map(f => ({
      ...FEATURE_LABELS[f],
      key: f
    }));
  }

  get availabilityClass(): string {
    switch (this.unit.availability) {
      case 'available':
        return 'available';
      case 'limited':
        return 'limited';
      case 'unavailable':
        return 'unavailable';
      default:
        return '';
    }
  }

  get availabilityText(): string {
    switch (this.unit.availability) {
      case 'available':
        return 'Available Now';
      case 'limited':
        return 'Only 2 Left';
      case 'unavailable':
        return 'Sold Out';
      default:
        return '';
    }
  }

  getStarArray(): boolean[] {
    const fullStars = Math.floor(this.unit.rating);
    const hasHalfStar = this.unit.rating % 1 >= 0.5;
    const stars: boolean[] = [];

    for (let i = 0; i < 5; i++) {
      stars.push(i < fullStars);
    }

    return stars;
  }
}
