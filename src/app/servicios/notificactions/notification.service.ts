import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';
import { PreferencesService } from 'src/app/preferences.service';
import { Capacitor } from '@capacitor/core';
import { ApiNotificationService } from './api-notification.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  private _redirect = new BehaviorSubject<any>(null);

  get redirect() {
    return this._redirect.asObservable();
  }

  constructor(
    private storage: PreferencesService,
    private alertController: AlertController,
    private device: ApiNotificationService
  ) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
      // this.getDeliveredNotifications();
    }
  }

  private async registerPush() {
    try {
      await this.addListeners();
      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      if (permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }
      await PushNotifications.register();
    } catch (e) {
      console.log(e);
    }
  }

  addListeners() {
    PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        console.log('My token: ', token);
        const fcm_token = (token?.value);
        let go = 1;
        const saved_token = JSON.parse((await this.storage.getName('FCM_TOKEN')).value!);
        if (saved_token) {
          if (fcm_token == saved_token) {
            console.log('same token');
            go = 0;
          } else {
            go = 2;
          }
        }
        if (go == 1) {
          // save token
          this.storage.setName('FCM_TOKEN', JSON.stringify(fcm_token));
        } else if (go == 2) {
          // update token
          const data = {
            expired_token: saved_token,
            refreshed_token: fcm_token
          };
          this.storage.setName('FCM_TOKEN', fcm_token);
        }
        try {
          (await this.device.registerDevice(token.value)).subscribe(
            (resp) => {
              console.log(resp);
            },
            (error) => {
              console.log(error);
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification?.data;
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));
        console.log('push data: ', data);
        if (data?.redirect) this._redirect.next(data?.redirect);
      }
    );
  }

  async getDeliveredNotifications() {
    const notificationList = await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }

  async removeFcmToken() {
    try {
      const saved_token = JSON.parse((await this.storage.getName('FCM_TOKEN')).value!);
      this.storage.removeName(saved_token);
    } catch (e) {
      console.log(e);
      throw (e);
    }
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK'],
      mode: 'ios'
    });
    await alert.present();
  }
}
