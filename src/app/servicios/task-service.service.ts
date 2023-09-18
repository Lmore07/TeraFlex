import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseListTaskDetail, ApiResponseListTasksAssignsToPatientI } from '../interfaces/Task.interface';
import { PreferencesService } from './../preferences.service';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  urlApi = "https://fyc.uteq.edu.ec:4001";
  headers: any;

  constructor(private clientHttp: HttpClient, private preferences: PreferencesService) {
    this.getHeaders();
  }


  async getTasks(user: number, activo: boolean): Promise<Observable<ApiResponseListTasksAssignsToPatientI>> {
    await this.getHeaders();
    var options = { headers: this.headers };
    return this.clientHttp.get<ApiResponseListTasksAssignsToPatientI>(this.urlApi + "/patients/" + user + "/tasks?isCompleted=" + activo, options);
  }

  async getDetailTask(idTask: number): Promise<Observable<ApiResponseListTaskDetail>> {
    await this.getHeaders();
    var options = { headers: this.headers }
    return this.clientHttp.get<ApiResponseListTaskDetail>(this.urlApi + "/assignments/" + idTask + "/task", options);
  }

  async downloadFile(idFile: number): Promise<Observable<any>> {
    await this.getHeaders();
    var options = { headers: this.headers }
    return this.clientHttp.get(this.urlApi + "/multimedia/download/"+idFile, {...options, responseType:'blob'});

  }

  async completeTask(idTask:number){
    await this.getHeaders();
    var options = { headers: this.headers }
    return this.clientHttp.patch(this.urlApi + "/assignments/"+idTask+"/completed",null, {...options, responseType:'blob'});
  }

  async getHeaders() {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${(await this.preferences.getName('token')).value}`
    });
  }
}
