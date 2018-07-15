
import { Component } from '@angular/core';
import { IProfileData, IComboBoxValue, ISelectionData } from '../types';
import {StoreService} from '../store';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-detail',
  templateUrl: './detail.component.html',
})
export class ListDetailComponent {

    label: string;
    value: string;
    minValue: string;
    maxValue: string;
    step: string;
    message = '';

    constructor(store: StoreService, private route: ActivatedRoute) {
        const comboBoxValues = store.comboBoxValues;
        this.route.params.subscribe(params => {
            console.log(params);
            if (params['id']) {
              let v = comboBoxValues.filter(c => c.value===params['id']);
              if (v.length === 1) {
                this.label = v[0].label;
                this.value = v[0].value;
                this.minValue = v[0].minValue.toFixed();
                this.maxValue = v[0].maxValue.toFixed();
                this.step = v[0].step.toFixed();
              }
            }
          });
    }
}