import {Component, NgModule} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StoreService} from './store';
import {IUserData, IComboBoxValue, ISelectionData, EGeschlecht} from './types';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';


function copy(val) {
  return JSON.parse(JSON.stringify(val));
}

@Component({
  selector: 'userlist',
  templateUrl: './userlist.html',
})
export class UserList {
  message = '';
  users: IUserData[];
  editItem: string;
  geschlechtKeys = EGeschlecht;
  geschlechtValues: string[];

  constructor(private store: StoreService, private router: Router) {
    this.users = copy(store.users);
    console.log('values', Object.values(EGeschlecht));
    console.log('keys:', Object.keys(EGeschlecht));
    console.log('filter:', Object.keys(this.geschlechtKeys).filter(String));
    this.geschlechtValues = Object.values(this.geschlechtKeys).filter(String);
  }

  edit(id: string) {
    console.log('edit', id);
    this.editItem = id;
  }

  save(index: number, user: IUserData) {
    console.log('save', index, user);
    this.message = 'User updated';
    this.store.updateUser(index, user);
    this.editItem = '';
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
