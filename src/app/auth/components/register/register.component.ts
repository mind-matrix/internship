import { Component, OnInit, NgZone, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { NbRegisterComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router } from '@angular/router';

import { Business } from './business';

import axios from 'axios';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class NgxRegisterComponent extends NbRegisterComponent implements OnInit {

  @ViewChild('outerStepper') outerStepper;
  @ViewChild('innerStepper') innerStepper;

  businessModel = new Business();
  zoom: number;
  terms: boolean = false;
  private token: string = null;
  private geoCoder;

  @ViewChild('search')
  public searchElementRef: ElementRef;


  constructor(
    protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected router: Router,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {
    super(service, options, cd, router);
  }

  register() {
    axios.post('/api/register', {
      phone: this.businessModel.phone
    }, {
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(({ data }) => {
      if (data.created && data.sent) {
        this.outerStepper.next();
      } else {
        // something was wrong
      }
    }).catch((error) => {
      console.error(error);
      // whoops!
    });
  }

  verify() {
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
        this.token = data.token;
        this.outerStepper.next();
      } else {
        // not verified and wrong otp
      }
    }).catch((error) => {
      console.error(error);
      // whoopsie!
    });
  }

  update() {

    let data = new FormData();
    data.append('name', this.businessModel.name);
    data.append('brand', this.businessModel.brand);
    data.append('contact', JSON.stringify(this.businessModel.contact));
    data.append('address', JSON.stringify(this.businessModel.address));
    for (var [key, value] of Object.entries(this.businessModel.documents)) {
      data.append(key, this.businessModel.documents[key]);
    }

    axios.post('/api/update', data, {
      headers: { 'Content-Type': 'multipart/form-data', 'authorization': this.token }
    }).then(({ data }) => {
      if (data.updated) {
        this.router.navigate(['/pages/dashboard']);
      }
    }).catch((error) => {
      console.log(error);
    })
  }


  ngOnInit() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.businessModel.address.geolocation.latitude = place.geometry.location.lat();
          this.businessModel.address.geolocation.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  onDocumentChange(name, event) {
    if (this.businessModel.documents.hasOwnProperty(name)) {
      this.businessModel.documents[name] = event.target.files[0];
    }
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.businessModel.address.geolocation.latitude = position.coords.latitude;
        this.businessModel.address.geolocation.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.businessModel.address.geolocation.latitude, this.businessModel.address.geolocation.longitude);
      });
    }
  }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.businessModel.address.geolocation.latitude = $event.coords.lat;
    this.businessModel.address.geolocation.longitude = $event.coords.lng;
    this.getAddress(this.businessModel.address.geolocation.latitude, this.businessModel.address.geolocation.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.businessModel.address = results[0].formatted_address;
        } else {
          console.info('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }

    });
  }

}
