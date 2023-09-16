import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private preferences: PreferencesService,
    private router: Router
  ) {

  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const token = (await this.preferences.getName('token')).value
    console.log(token)
    if (route.routeConfig?.path == 'login') {
      if (token) {
        this.router.navigate(['/dashboard'])
        return false;
      } else {
        return true;
      }
    } else {
      if (token) {
        return true;
      } else {
        this.router.navigate(['/login'])
        return false;
      }
    }

  }

}
