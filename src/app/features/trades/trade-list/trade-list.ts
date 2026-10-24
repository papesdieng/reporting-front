
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trade } from '../../../models/trade';
import { TradeService } from '../../../services/trade.service';
import { FormsModule } from '@angular/forms';

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
  searchTerm = '';

  sortColumn: SortColumn = 'id';
  sortDirection: SortDirection = 'asc';

onSort(column: SortColumn): void {
  if (this.sortColumn === column) {
    this.sortDirection =
      this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
}
// Filters the trades based on the search term
  get filteredTrades(): Trade[] {
  const term = this.searchTerm.trim().toLowerCase();

    return (this.trades.value() ?? []).filter(trade =>
    trade.traderName.toLowerCase().includes(term)
  );
}

// Sorts the filtered trades based on the selected column and direction
get sortedTrades(): Trade[] {
  const trades = [...this.filteredTrades];

  return trades.sort((a, b) => {
    const left = a[this.sortColumn];
    const right = b[this.sortColumn];

    let comparison: number;

    if (
      typeof left === 'number' &&
      typeof right === 'number'
    ) {
      comparison = left - right;
    } else if (this.sortColumn === 'maturityDate') {
      comparison =
        new Date(String(left)).getTime() -
        new Date(String(right)).getTime();
    } else {
      comparison = String(left).localeCompare(
        String(right),
        'fr',
        { numeric: true, sensitivity: 'base' }
      );
    }

    return this.sortDirection === 'asc'
      ? comparison
      : -comparison;
  });
}

}
