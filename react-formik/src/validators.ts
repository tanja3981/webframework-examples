type IValidator = (value:string) => string|undefined;

type ICurriedValidator = (message:string) => IValidator;

type IParamterizedCurriedValidator = (param:any) => ICurriedValidator;

export const alwaysTrue: IValidator = (value:string) => undefined;
export const required: ICurriedValidator = (message:string) => (value:string) => (value ? undefined : message);
export const minLength: IParamterizedCurriedValidator = (minValue:number) => (message:string) => (value:string) => (value.length<minValue ? message : undefined);
export const maxLength: IParamterizedCurriedValidator = (maxValue:number) => (message:string) => (value:string) => (value.length>maxValue ? message : undefined);
export const pattern: IParamterizedCurriedValidator = (patternValue:string) => (message:string) => (value:string) => RegExp(patternValue).test(value) ? undefined : message;
export const email: ICurriedValidator = (message:string) => pattern('.+@.+\\..+')(message);

export const numeric: ICurriedValidator = (message:string) => (value:string) => (Number.isNaN(Number(value)) ? message : undefined);
export const min: IParamterizedCurriedValidator = (minValue: number) => (message:string) => (value:string) => Number(value)<minValue ? message : undefined;
export const max: IParamterizedCurriedValidator = (maxValue: number) => (message:string) => (value:string) => (Number(value)>maxValue ? message : undefined);


export const composeValidators = (...validators: IValidator[]) : IValidator => (value:string) =>
  validators.reduce((error: string, validator: IValidator) => error || validator(value), undefined);

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