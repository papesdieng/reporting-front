import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Trade } from '../../../models/trade';
import { TradeService } from '../../../services/trade.service';

type SortColumn =
  | 'id'
  | 'price'
  | 'currency'
  | 'traderName'
  | 'maturityDate';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-trade-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-list.html',
  styleUrl: './trade-list.css',
})
export class TradeListComponent {
  private readonly tradeService = inject(TradeService);

  readonly trades = this.tradeService.trades;
  readonly searchTerm = signal('');
  readonly sortColumn = signal<SortColumn>('id');
  readonly sortDirection = signal<SortDirection>('asc');

  readonly filteredTrades = computed(() => {
    if (this.trades.error()) {
      return [];
    }

    const term = this.searchTerm().trim().toLowerCase();
    return (this.trades.value() ?? []).filter((trade) =>
      trade.traderName.toLowerCase().includes(term),
    );
  });

  readonly sortedTrades = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();
    const multiplier = direction === 'asc' ? 1 : -1;

    return [...this.filteredTrades()].sort(
      (left, right) => multiplier * this.compareTrades(left, right, column),
    );
  });

  onSort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((direction) =>
        direction === 'asc' ? 'desc' : 'asc',
      );
      return;
    }

    this.sortColumn.set(column);
    this.sortDirection.set('asc');
  }

  private compareTrades(
    leftTrade: Trade,
    rightTrade: Trade,
    column: SortColumn,
  ): number {
    const left = leftTrade[column];
    const right = rightTrade[column];

    if (typeof left === 'number' && typeof right === 'number') {
      return left - right;
    }

    if (column === 'maturityDate') {
      return new Date(left).getTime() - new Date(right).getTime();
    }

    return String(left).localeCompare(String(right), 'fr', {
      numeric: true,
      sensitivity: 'base',
    });
  }
}
