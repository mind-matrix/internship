export class SetToken {
    static readonly type = '[app] set token';
    constructor(public payload:string) {} 
}