
import { Component } from '@angular/core';
import { TradeListComponent } from './features/trades/trade-list/trade-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TradeListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'reporting-front';
}
