
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {StoreService} from './store';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
    message = '';

    form: FormGroup;
    allowPhone: FormControl;
    phone: FormControl;

    constructor(private store: StoreService, private router: Router) {
        const profile = store.profile;
        this.allowPhone = new FormControl(profile.allowPhone);
        this.phone = new FormControl(profile.phone, [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);

        this.form = new FormGroup({
            name: new FormControl(profile.name, [Validators.required, Validators.minLength(4), Validators.maxLength(15)]),
            email: new FormControl(profile.email, [Validators.required, Validators.email]),
            allowPhone: this.allowPhone,
            phone: this.phone,
        });

        this.allowPhone.valueChanges.subscribe(v => {
            if (v) {
                this.phone.enable({emitEvent: true, onlySelf: true});
            } else {
                this.phone.disable({emitEvent: true, onlySelf: true});
            }
        });
    }

    save() {
        this.message = 'Profile updated';
        this.form.disable();
        this.store.updateProfile(this.form.value);
    }

    cancel() {
        this.router.navigate(['/']);
    }
}