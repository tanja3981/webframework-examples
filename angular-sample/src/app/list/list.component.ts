
import { Component } from '@angular/core';
import { IProfileData, IComboBoxValue, ISelectionData } from '../types';
import {StoreService} from '../store';

@Component({
  selector: 'app-list-list',
  templateUrl: './list.component.html',
})
export class ListListComponent {
    comboBoxValues: IComboBoxValue[];

    constructor(store: StoreService) {
        this.comboBoxValues = store.comboBoxValues;
    }
}