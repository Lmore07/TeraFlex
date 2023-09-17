import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { NotificationI } from 'src/app/interfaces/Notification.interface';
import { PreferencesService } from 'src/app/preferences.service';
import { ApiNotificationService } from 'src/app/servicios/notificactions/api-notification.service';
import { ScreenOrientation } from '@capacitor/screen-orientation';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  notificationList!: NotificationI[];
  loading!: any;

  constructor(
    private notificationService: ApiNotificationService,
    public preferencesService: PreferencesService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) { 
    ScreenOrientation.lock({
      orientation: 'portrait'
    });
    this.platform.backButton.subscribeWithPriority(10, async () => {
      this.esconderLoading();
    });
  }

  async ngOnInit() {
    await this.loadNotifications();
  }

  async handleRefresh(event: any) {
    this.notificationList = [];
    await this.loadNotifications();
    event.target.complete();
  }

  async loadNotifications() {
    this.showLoading();
    (await this.notificationService.getNotificationAll()).subscribe(
      (resp) => {
        if (resp.data.length == 0) {
          this.alertSinActions("Lo sentimos", "No tiene notificaciones por ahora.");
        } else {
          console.log(resp);
          this.notificationList = resp.data;
        }
        this.esconderLoading();
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
      }
    );
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando',
      animated: true,
      mode: 'ios'
    });
    this.loading.present();
  }

  esconderLoading() {
    this.loading.dismiss();
  }

  async checkNotification(idNotification: number) {
    this.showLoading();
    (await this.notificationService.checkNotification(idNotification)).subscribe(
      (resp) => {
        this.esconderLoading();
        this.presentAlert("Excelente","Se eliminó la notificación");
      },
      (err) => {
        console.log(err)
        this.esconderLoading();
        this.presentAlert("Lo sentimos","No se eliminó la notificación");
      }
    );
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: async () => {
            this.notificationList = [];
            await this.loadNotifications();
          }
        }
      ],
      mode: 'ios'
    });
    await alert.present();
  }

  async alertSinActions(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        }
      ],
      mode: 'ios'
    });
    await alert.present();
  }
}
