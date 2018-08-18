import {IValidator, alwaysTrue} from './validators';

type IFormControlParent<T> = FormControlMap<T>|FormControlArray<T>;

export interface IFormControlState<T> {
    parent: IFormControlParent<any>;
    dirty: boolean;
    touched: boolean;
    invalid: boolean;
    value: T;
    getChildren(): IFormControlState<any>[];
    updateState(): void;
}

// K: IFormControlState<T>

export type IFormControlStateMap<T> = {[K in keyof T]?: IFormControlState<T[K]>};

export class FormControlMap<T> implements IFormControlState<IFormControlStateMap<T>> {
    public children: IFormControlStateMap<T> = {};
    private _message: string;

    constructor(object: IFormControlStateMap<T>, private validator: IValidator<T> = alwaysTrue, public parent: IFormControlParent<T>|null = null) {
        for (let key in object) {
            this.children[key] = object[key];
            object[key].parent = this;
        }
    }

    // FIXME: Typing
    set(key: any, child: IFormControlState<IFormControlStateMap<T>>) {
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

    get value(): T {
        let r : any = {};
        for (let key in this.children) {
            r[key] = this.children[key].value;
        }
        return r;
    }

    updateState() {
        this._message = this.validator(this.value);
        if (this.parent) this.parent.updateState();
    }
}

export class FormControlArray<T> implements IFormControlState<T[]> {
    private children: Array<IFormControlState<T>> = [];
    private _message: string;
    public parent: IFormControlParent<any>;
    constructor(private childConstructor: (initialValue:T) => IFormControlState<T>, private validator: IValidator<T[]> = alwaysTrue, private initialValues: T[] = undefined)  {
        if (initialValues) {
            for (let val of initialValues) {
                this.add(val);
            }
        }
    }

    add(value: T = undefined): IFormControlState<T> {
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

    getChildren() {
        return this.children;
    }

    get value(): T[] {
        return this.children.map(c => c.value);
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
    public parent: IFormControlParent<T>;
    constructor(private validator: IValidator<T> = alwaysTrue, private _value: T = undefined, public dirty: boolean = false, public touched: boolean =false,
            public invalid: boolean = false)  {
    }

    get value() { return this._value};
    set value(newValue: T) { this._value = newValue; this.updateState();}
    getChildren(): IFormControlState<T>[] {
        return [];
    }

    updateState(updateTouchedAndDirty=true) {
        if (updateTouchedAndDirty) {
            this.touched = true;
            this.dirty = true;
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
        if (control instanceof FormControlArray === false) {
            console.log('array value, but control is not a FormControlArray ', object);
        } else {
            object.forEach(c => {
                let child = (control as FormControlArray<any>).add();
                fillFromJSON(child, c);
            });
        }
    } else if (typeof object === 'object') {
        if (control instanceof FormControlMap === false) {
            console.log('object value, but control is not a FormControlValue ', object);
        } else {
            for (let key in object) {
                let childControl = (control as FormControlMap<any>).children[key];
                if (!childControl) console.log("child ",key," component not found on ", control);
                fillFromJSON(childControl, object[key]);
            }
        }
    } else {
        if (control instanceof FormControlValue === false) {
            console.log('primitive value, but control is not a FormControlValue ', object);
        } else {
            (control as FormControlValue<{}>).value = object;
        }
    }
}