class Geolocation {
    latitude: number;
    longitude: number;
}

export class Contact {
    name: string;
    phone: string;
    email: string;
    altPhone: string;
}

export class Address {
    geolocation: Geolocation;
    line1: string;
    line2: string;
    city: string;
    state: string;
    PIN: string;
    landmark: string;
    deliveryRadius: number;
}

export class Business {
    constructor(
        public phone: string = null,
        public otp: string = null,
        public name: string = null,
        public brand: string = null,
        public contact: Contact = {
            name: null,
            phone: null,
            email: null,
            altPhone: null,
        },
        public address: Address = {
            geolocation: {
                latitude: 0,
                longitude: 0,
            },
            line1: null,
            line2: null,
            city: null,
            state: null,
            PIN: null,
            landmark: null,
            deliveryRadius: 5,
        },
        public documents: any = {
            registration: null,
            drugLicense: null,
            certificate: null,
            tradeLicense: null,
        },
    ) {}
}
