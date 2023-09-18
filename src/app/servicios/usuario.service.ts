import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PreferencesService } from '../preferences.service';
import { ApiResponseGetMiPerfil } from '../interfaces/Usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlApi = "https://fyc.uteq.edu.ec:4001";
  headers: any;

  constructor(
    private clientHttp: HttpClient,
    private preferences: PreferencesService) {

  }

  async getHeaders() {
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${(await this.preferences.getName('token')).value}`
    });
  }

  login(identification: number, password: string): Observable<any> {
    this.headers = new HttpHeaders({
      'password': `${password}`,
      'identification': `${identification}`
    });
    var options = { headers: this.headers };
    return this.clientHttp.post<any>(this.urlApi + "/auth/login", null, options);
  }

  async getDataUser(): Promise<Observable<ApiResponseGetMiPerfil>> {
    await this.getHeaders();
    var options = { headers: this.headers }
    return this.clientHttp.get<ApiResponseGetMiPerfil>(this.urlApi + "/user/my-profile", options);
  }
}
