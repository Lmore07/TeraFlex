import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  urlApi = "https://lzb07nfq-3000.use2.devtunnels.ms";
  headers: any;

  constructor(private clientHttp: HttpClient) {
    
  }

  login(identification:number,password:string): Observable<any> {
    this.headers = new HttpHeaders({
      'password': `${password}`,
      'identification': `${identification}`
    });
    var options = { headers: this.headers };
    return this.clientHttp.post<any>(this.urlApi + "/auth/login", null, options);
  }
}
