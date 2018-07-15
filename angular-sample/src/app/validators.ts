import { AbstractControl, FormControl, FormBuilder, FormArray, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

export function isNumeric(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        console.log('isNumeric', control.value, Number.isNaN(control.value));
      return Number.isNaN(Number(control.value)) ? {'isNumeric': {value: control.value}} : null;
    };
  }


  export const minLessThanMax: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const minValue = control.get('minValue');
    const maxValue = control.get('maxValue');
    console.log('valid ', minValue.valid, maxValue.valid);
    const r = Number(minValue.value) > Number(maxValue.value) ? ({ 'minLessThanMax': true }) : null;
    console.log("return value ", r);
    return r;
};