import { Component } from '@angular/core';


import { Platform } from '@ionic/angular';
import { NotificationService } from '../servicios/notificactions/notification.service';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage {

  constructor(
    private platform:Platform,
    private fcm:NotificationService,
    private router:Router
    
  ){
    this.platform.backButton.subscribeWithPriority(10, () => {
      const rutaActual = this.router.url;
      console.log('Handler was called!');
      console.log(rutaActual);
      if(rutaActual=='/dashboard'){
        App.exitApp();
      }else if(rutaActual=='/dashboard/tasks'){
        this.router.navigateByUrl("/dashboard");
      }else if(rutaActual=='/dashboard/perfil'){
        this.router.navigateByUrl("/dashboard");
      }else if(rutaActual=='/dashboard/notifications'){
        this.router.navigateByUrl("/dashboard");
      }
    });
    platform.ready().then(() => {
      fcm.initPush();
    }).catch( e => {
      console.log(e);
    });
  }
}
