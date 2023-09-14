import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { TasksComponent } from './tasks/tasks.component';
import { DetailComponent } from './tasks/detail/detail.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path:'tasks/detail/:id',
    component:DetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
