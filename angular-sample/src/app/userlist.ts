
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {StoreService} from './store';
import { IUserData, IComboBoxValue, ISelectionData } from './types';

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

  constructor(private store: StoreService, private router: Router) {
    this.users =  copy(store.users);
  }
  edit(id: string) {
    console.log("edit", id);
    this.editItem = id;
  }
  save(index: number, user: IUserData) {
    console.log("save", index, user);
    this.message = 'User updated';
    this.store.updateUser( index, user);
    this.editItem = '';
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
