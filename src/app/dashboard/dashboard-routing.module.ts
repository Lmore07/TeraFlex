import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { TasksComponent } from './tasks/tasks.component';
import { DetailComponent } from './tasks/detail/detail.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { InformacionComponent } from './informacion/informacion.component';
import { AyudasComponent } from './ayudas/ayudas.component';

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
  },
  {
    path:'perfil',
    component: MiPerfilComponent
  },
  {
    path:'notifications',
    component:NotificacionesComponent
  },
  {
    path:"creditos",
    component:InformacionComponent
  },
  {
    path:"help",
    component:AyudasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
