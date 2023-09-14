import { Component, OnInit } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage {
  component = DashboardComponent;
}
