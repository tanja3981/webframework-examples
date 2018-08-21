export type IValidator<T, O = any> = (value:T, object: O) => string|undefined;

type ICurriedValidator<T, O = any> = (message:string) => IValidator<T, O>;

type IParamterizedCurriedValidator<T, O = any> = (param:any) => ICurriedValidator<T>;

export const alwaysTrue: IValidator<any> = (value:any) => undefined;
export const required: ICurriedValidator<string> = (message:string) => (value:string) => (value ? undefined : message);
export const minLength: IParamterizedCurriedValidator<string> = (minValue:number) => (message:string) => (value:string) => (value.length<minValue ? message : undefined);
export const maxLength: IParamterizedCurriedValidator<string> = (maxValue:number) => (message:string) => (value:string) => (value.length>maxValue ? message : undefined);
export const pattern: IParamterizedCurriedValidator<string> = (patternValue:string) => (message:string) => (value:string) => RegExp(patternValue).test(value) ? undefined : message;
export const email: ICurriedValidator<string> = (message:string) => pattern('.+@.+\\..+')(message);

export const numeric: ICurriedValidator<string> = (message:string) => (value:string) => (Number.isNaN(Number(value)) ? message : undefined);
export const min: IParamterizedCurriedValidator<string> = (minValue: number) => (message:string) => (value:string) => Number(value)<minValue ? message : undefined;
export const max: IParamterizedCurriedValidator<string> = (maxValue: number) => (message:string) => (value:string) => (Number(value)>maxValue ? message : undefined);


export function composeValidators<O = any>(...validators: IValidator<string>[]) : IValidator<string> {
    return (value:string, object: O) => validators.reduce((error: string, validator: IValidator<string>) => error || validator(value, object), undefined);
}

export function elminateUndefined(obj:any) {
    let r = {};
    for (let key of Object.keys(obj)) {
        let val = obj[key];
        if (val !== undefined) {
            r = r || {};
            r[key] = val;
        }
        // else {
        //     console.log("key val strange type", key, val);
        // }
    }
    return r;
}