import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxAuthRoutingModule } from './auth-routing.module';
import { NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { 
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule
} from '@nebular/theme';

import { NgxLoginComponent } from './components/login/login.component';
import { NgxRegisterComponent } from './components/register/register.component';

import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,

    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
        }),
      ],
      forms: {
        validation: {
          orgName: {
            required: true,
            minLength: 4,
            maxLength: 50,
          },
          orgPhone: {
            required: false,
            minLength: 10,
            maxLength: 10,
          },
        }
      }
    }),

    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAB193XbjeCs8guyTw9NrLGynpI92DE-ZE',
      libraries: ['places', 'drawing', 'geometry']
    }),

    NgxAuthRoutingModule,

    NbAuthModule,
  ],
  declarations: [
    NgxLoginComponent,
    NgxRegisterComponent,
  ],
})
export class NgxAuthModule {
}