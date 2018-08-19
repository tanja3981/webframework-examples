import {IValidator, alwaysTrue} from './validators';

type IFormControlParent = FormControlMap<any>|FormControlArray<any>;

export interface IFormControlState<T> {
    parent: IFormControlParent;
    dirty: boolean;
    touched: boolean;
    invalid: boolean;
    value: T;
    // FIXME getChildren makes only sense for array, for nothing else + typing is bad
    getChildren(): IFormControlState<any>[];
    updateState(): void;
}

// K: IFormControlState<T>

//export type IFormControlStateMap<T> = {[K in keyof T]?: IFormControlState<T[K]>};
// export type IValueFromtateMap<T> = {[K in keyof T]?: T[K]};

// D = {
//     name: string,
//     email: string
// }

// C = {
//     name: FormControlValue<string>(),
//     email: FormControlValue<string>()
// }

export type TTypeFromIFormControlState<T> = T extends IFormControlState<(infer U)> ? U : {[K in keyof T]: TTypeFromIFormControlState<T[K]>};

export type TTypeStructureFromControlStateMap<M> = {[K in keyof M]: TTypeFromIFormControlState<M[K]>};

export type TFormControlMap<T> = {[K in keyof T]:  IFormControlState<TTypeFromIFormControlState<T[K]>> }

export class FormControlMap<T extends TFormControlMap<T>> implements IFormControlState<TTypeFromIFormControlState<T>> {
    private _message: string;

    constructor(public children: T, private validator: IValidator<TTypeFromIFormControlState<T>> = alwaysTrue, public parent: IFormControlParent|null = null) {
        for (let key in children) {
            children[key].parent = this;
        }
    }

    // FIXME: Typing
    set(key: any, child: IFormControlState<any>) {
        child.parent = this;
        this.children[key] = child;
    }

    remove(key: string) {
        delete this.children[key];
    }

    getChildren() {
        let r = [];
        for (let key in this.children) {
            r.push(this.children[key]);
        }
        return r;
    }

    get dirty(): boolean {
        return this.getChildren().some(child => child.dirty);
    }

    get touched(): boolean {
        return this.getChildren().some(child => child.touched);
    }

    get invalid(): boolean {
        return !!this._message || this.getChildren().some(child => child.invalid);
    }

    get message(): string {
        return this._message;
    }

    get value(): TTypeFromIFormControlState<T> {
        let r : any = {};
        for (let key in this.children) {
            r[key] = this.children[key].value;
        }
        return r as TTypeFromIFormControlState<T>;
    }

    updateState() {
        this._message = this.validator(this.value);
        if (this.parent) this.parent.updateState();
    }
}

// export type TTypeFromIFormControlState<T> = T extends IFormControlState<(infer U)> ? U : {[K in keyof T]: TTypeFromIFormControlState<T[K]>};
// export type TTypeStructureFromControlStateMap<M> = {[K in keyof M]: TTypeFromIFormControlState<M[K]>};
// export type TFormControlMap<T> = {[K in keyof T]:  IFormControlState<TTypeFromIFormControlState<T[K]>> }
// export class FormControlMap<T extends TFormControlMap<T>> implements IFormControlState<TTypeFromIFormControlState<T>> {
    // constructor(public children: T, private validator: IValidator<TTypeFromIFormControlState<T>> = alwaysTrue, public parent: IFormControlParent|null = null) {
export class FormControlArray<T extends IFormControlState<TTypeFromIFormControlState<T>>, U=any> implements IFormControlState<TTypeFromIFormControlState<T>[]> {
    private children: Array<T> = [];
    private _message: string;
    public parent: IFormControlParent;
   constructor(private childConstructor: (initialValue:U) => T, private validator: IValidator<TTypeFromIFormControlState<T>[]> = alwaysTrue, private initialValues: U[] = undefined)  {
            if (initialValues) {
            for (let val of initialValues) {
                this.add(val);
            }
        }
    }

    add(value: U = undefined): T {
        let child = this.childConstructor(value);
        child.parent = this;
        this.children.push(child);
        this.updateState();
        return child;
    }

    remove(index: number) {
        this.children.splice(index, 1);
        this.updateState();
    }

    getChildren()  {
        return this.children;
    }

    get value(): TTypeFromIFormControlState<T>[] {
        let ret = this.children.map(c => c.value);
        return ret;
    }


    get dirty(): boolean {
        return this.children.some(child => child.dirty);
    }

    get touched(): boolean {
        return this.children.some(child => child.touched);
    }

    get invalid(): boolean {
        return !!this._message || this.children.some(child => child.invalid);
    }

    get message(): string {
        return this._message;
    }

    updateState() {
        this._message = this.validator(this.value);
        if (this.parent) this.parent.updateState();
    }
}

export class FormControlValue<T> implements IFormControlState<T> {
    public message: string = undefined;
    public parent: IFormControlParent;
    public initialValue: T;
    constructor(private validator: IValidator<T> = alwaysTrue, private _value: T = undefined, public dirty: boolean = false, public touched: boolean =false,
            public invalid: boolean = false)  {
                this.initialValue = _value;
    }

    get value() { return this._value};
    set value(newValue: T) { this._value = newValue; this.updateState();}
    getChildren(): IFormControlState<T>[] {
        return [];
    }

    get errorAfterBlur(): boolean {
        return this.invalid && this.touched;
    }
    get errorOnEdit(): boolean {
        return this.invalid && (this.dirty || this.touched);
    }

    updateState(updateTouchedAndDirty=true) {
        if (updateTouchedAndDirty) {
            console.log("update dirty", this._value, this.initialValue);
            this.dirty = this._value !== this.initialValue;
        }
        this.message = this.validator(this.value);
        this.invalid = !!this.message;
        if (this.parent) this.parent.updateState();
    }
}

export function updateAllControlState(parent: IFormControlState<any>) {
    if (parent instanceof FormControlValue) {
        parent.updateState(false);
    } else {
        for (let child of parent.getChildren()) {
            updateAllControlState(child);
        }
    }
}

export function fillFromJSON(control: IFormControlState<any>, object: any): void {
    if (Array.isArray(object)) {
        if (control instanceof FormControlArray) {
            object.forEach(c => {
                let child = control.add();
                fillFromJSON(child, c);
            });
        } else {
            console.log('array value, but control is not a FormControlArray ', object);
        }
    } else if (typeof object === 'object') {
        if (control instanceof FormControlMap) {
            for (let key in object) {
                let childControl = control.children[key];
                if (!childControl) console.log("child ",key," component not found on ", control);
                fillFromJSON(childControl, object[key]);
            }
        } else {
            console.log('object value, but control is not a FormControlValue ', object);
        }
    } else {
        if (control instanceof FormControlValue) {
            control.value = object;
            control.initialValue = object;
            control.dirty = false;
        } else {
            console.log('primitive value, but control is not a FormControlValue ', object);
        }
    }
}