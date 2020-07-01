export class SetToken {
    static readonly type = '[app] set token';
    constructor(public payload:string) {} 
}

export class UpdateProfile {
    static readonly type = '[app] update profile';
    constructor() {}
}