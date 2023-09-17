import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';
import { DashboardPage } from './dashboard.page';
import { TasksComponent } from './tasks/tasks.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { MiPerfilComponent } from './mi-perfil/mi-perfil.component';
import { AyudasComponent } from './ayudas/ayudas.component';
import { InformacionComponent } from './informacion/informacion.component';
import { RouterModule } from '@angular/router';
import { DetailComponent } from './tasks/detail/detail.component';
import { YouTubePlayerModule } from '@angular/youtube-player';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    DashboardPageRoutingModule,
    RouterModule,
    YouTubePlayerModule
  ],
  declarations: [
    DashboardPage,
    TasksComponent,
    NotificacionesComponent,
    MiPerfilComponent,
    AyudasComponent,
    InformacionComponent,
    DetailComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class DashboardPageModule {

}
