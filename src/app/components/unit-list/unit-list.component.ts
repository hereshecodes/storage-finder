import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { StorageUnit } from '../../models/storage-unit.model';
import { UnitCardComponent } from '../unit-card/unit-card.component';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [CommonModule, UnitCardComponent],
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  units: StorageUnit[] = [];
  loading = true;
  error: string | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.storageService.filters$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(filters => {
          this.loading = true;
          return this.storageService.getUnits(filters);
        })
      )
      .subscribe({
        next: (units) => {
          this.units = units;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load storage units. Please try again.';
          this.loading = false;
          console.error('Error loading units:', err);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByUnitId(index: number, unit: StorageUnit): string {
    return unit.id;
  }
}
