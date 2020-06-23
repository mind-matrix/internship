import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { AppState } from './shared/app.state';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  @Select(AppState) app$;
  state: any;

  constructor() {
    this.app$.subscribe(e => {
      this.state = e;
    });
  }

  get isUserLoggedIn() {
    if (this.state.token) {
      return true;
    }
    return false;
  }
}
