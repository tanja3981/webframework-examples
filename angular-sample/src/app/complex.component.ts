
import { Component } from '@angular/core';
import {IColumnSelection, ISelectionData, IComboBoxValue} from './types';
import { FormControl, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import * as MyValidators from './validators';
import {tap} from 'rxjs/operators';
import {StoreService} from './store';

@Component({
  selector: 'app-complex',
  templateUrl: './complex.component.html',
})
export class ComplexComponent {


    form: FormArray;
    comboBoxValues: IComboBoxValue[];

    constructor(store: StoreService) {
        this.comboBoxValues = store.comboBoxValues;
        const columns = store.columns;

        this.form = new FormArray(
            columns.map(c => new FormGroup({
                selections: new FormArray(
                    c.selections.map(this.mapSelection)
                    )
            })
        ));

        this.form.valueChanges.pipe(
        ).subscribe((val) => {
            console.log('changed form values', val);
        });
    }

    allowedSelections(columnIndex: number, selectionIndex: number) {
        // let forbidden = columns[columnIndex].selections.map(s => s.selected).filter((v,idx) => idx!=selectionIndex);
        // return this.comboBoxValues.filter(cbv => !forbidden.find(v => v===cbv.value));
        const forbidden = (this.form.controls[columnIndex].get('selections') as FormArray)
                    .controls.map(s => s.get('selected').value).filter((v,idx) => idx !== selectionIndex);
        return this.comboBoxValues.filter(cbv => !forbidden.find(v => v === cbv.value));
    }

    mapSelection(s: IColumnSelection): FormGroup {
        return new FormGroup({
                selected: new FormControl(s.selected),
                amount: new FormControl(s.amount.toFixed(), [Validators.required, MyValidators.isNumeric(), Validators.min(15), Validators.max(150)]),
                price: new FormControl(s.price ? s.price.toFixed() : '-')
        });
    }

    remove(event: any, columnIndex: number, selectionIndex: number) {
        event.preventDefault();
        (this.form.controls[columnIndex].get('selections') as FormArray).controls.splice(selectionIndex, 1);
    }

    add(event: any, columnIndex: number) {
        event.preventDefault();
        const newValue = this.allowedSelections(columnIndex, undefined)[0].value;
        const sel: IColumnSelection = {selected: newValue, amount: 15, price: undefined};
        const newControl = this.mapSelection(sel);
        (this.form.controls[columnIndex].get('selections') as FormArray).controls.push(newControl);
    }

    updatePrice (columnIdx, selectionIdx) {
        const selection: FormGroup = (this.form.controls[columnIdx].get('selections') as FormArray).controls[selectionIdx] as FormGroup;
        if (!selection.valid) {
                console.log('can\'t compute - error');
                selection.get('price').setValue('');
        } else {
          console.log('start update price')
          window.setTimeout(() => {
          console.log('finsish update price')
              const price = (Math.random() * 100 + 20).toFixed();
              selection.get('price').setValue(price);
          }, 1000);
        }
    }
}