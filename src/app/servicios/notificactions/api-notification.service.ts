import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PreferencesService } from 'src/app/preferences.service';
import { Device } from '@capacitor/device';
import { ApiResponseListNotificationsI } from 'src/app/interfaces/Notification.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiNotificationService {

  urlApi = "https://lzb07nfq-3000.use2.devtunnels.ms";
  headers: any;
  idInfo: any;

  constructor(
    private clientHttp: HttpClient,
    private preferences: PreferencesService
  ) { 

  }

  async getHeaders() {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${(await this.preferences.getName('token')).value}`
    });
  }

  async registerDevice(token:string): Promise<Observable<any>> {
    const info = await Device.getId();
    this.idInfo=info.identifier;
    await this.getHeaders();
    var options = { headers: this.headers };
    var body={
      "token":token,
      "device":this.idInfo
    };
    this.preferences.setName('device', (await Device.getId()).identifier);
    return this.clientHttp.post<any>(this.urlApi + "/notification-token/register-device",body, options);
  }

  async updateDevice() {
    await this.getHeaders();
    var options = { headers: this.headers };
    return this.clientHttp.delete<any>(this.urlApi + "/notification-token/delete-device/"+(await this.preferences.getName('device')).value, options);
  }

  async getNotificationAll():Promise<Observable<ApiResponseListNotificationsI>>{
    await this.getHeaders();
    var options = { headers: this.headers };
    return this.clientHttp.get<ApiResponseListNotificationsI>(this.urlApi + "/notification/all", options);
  }

  async checkNotification(idNotification:any):Promise<Observable<any>>{
    await this.getHeaders();
    var options = { headers: this.headers };
    return this.clientHttp.delete<any>(this.urlApi + "/notification/delete/"+idNotification, options);
  }
}
