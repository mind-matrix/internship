import { Component, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { Business } from '../register/business';

import axios from 'axios';
import { SetToken } from '../../../shared/app.actions';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
})
export class NgxLoginComponent extends NbLoginComponent {
  
  @ViewChild('loginStepper') stepper;
  
  businessModel = new Business();

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private store: Store) {
    super(service, options, cd, router);
  }

  request() {
    axios.post('/api/request', {
      phone: this.businessModel.phone
    }, {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(({ data }) => {
      if (data.sent) {
        this.stepper.next();
      }
    }).catch((error) => {
      console.error(error);
      // do something about it!
    });
  }

  login() {
    axios.post('/api/login', {
      phone: this.businessModel.phone,
      otp: this.businessModel.otp,
    }, {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(({ data }) => {
      if (data.verified && data.token) {
        this.store.dispatch([
          new SetToken(data.token),
          new Navigate(['pages/dashboard']),
        ]);
      } else {
        // not verified and wrong otp
      }
    }).catch((error) => {
      console.error(error);
      // whoopsie!
    });
  }
}
