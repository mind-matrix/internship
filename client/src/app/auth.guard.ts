import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { UpdateProfile } from './shared/app.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(this.authService.isUserLoggedIn) {
      this.store.dispatch([
        new UpdateProfile(),
      ]);
      return true;
    } else {
      this.store.dispatch([
        new Navigate(['auth/login']),
      ]);
      return false;
    }
  }
  
}
