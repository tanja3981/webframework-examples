import { IValidator, alwaysTrue } from './validators';

type IFormControlParent = FormControlMap<any> | FormControlArray<any>;

function noop() { }

export interface IFormControlState<T> {
    parent: IFormControlParent;
    rootNotifyOnStateChange: (validate: boolean) => void;
    dirty: boolean;
    touched: boolean;
    invalid: boolean;
    value: T;
    // FIXME getChildren makes only sense for array, for nothing else + typing is bad
    getChildren(): IFormControlState<any>[];
    updateState(validate: boolean): void;
    validate(): void;
}

export type TTypeFromIFormControlState<T> = T extends IFormControlState<(infer U)> ? U : { [K in keyof T]: TTypeFromIFormControlState<T[K]> };

export type TTypeStructureFromControlStateMap<M> = { [K in keyof M]: TTypeFromIFormControlState<M[K]> };

export type TFormControlMap<T> = { [K in keyof T]: IFormControlState<TTypeFromIFormControlState<T[K]>> }

export class FormControlMap<T extends TFormControlMap<T>> implements IFormControlState<TTypeFromIFormControlState<T>> {
    private _message: string;
    public rootNotifyOnStateChange: (validate:boolean) => void = noop;
    public parent: IFormControlParent = null;
    private validator: IValidator<TTypeFromIFormControlState<T>, FormControlMap<T>> = alwaysTrue;

    constructor(public children: T,
        options? : {validator?: IValidator<TTypeFromIFormControlState<T>, FormControlMap<T>>}) {
        for (let key in children) {
            children[key].parent = this;
        }
        if (options && options.validator) {
            this.validator = options.validator;
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
        return !!this._message || this.getChildren().some(child => child.invalid);
    }

    get message(): string {
        return this._message;
    }

    get value(): TTypeFromIFormControlState<T> {
        let r: any = {};
        for (let key in this.children) {
            r[key] = this.children[key].value;
        }
        return r as TTypeFromIFormControlState<T>;
    }

    validate() {
        this._message = this.validator(this.value, this);
    }

    updateState(validate: boolean) {
        if (validate) {
            this.validate();
        }
        if (this.parent) this.parent.updateState(validate);
        else {
            this.rootNotifyOnStateChange(validate);
        }
    }
}

export class FormControlArray<T extends IFormControlState<TTypeFromIFormControlState<T>>, U=any> implements IFormControlState<TTypeFromIFormControlState<T>[]> {
    private _children: Array<T> = [];
    private _message: string;
    public parent: IFormControlParent;
    public rootNotifyOnStateChange: (validate:boolean) => void = noop;
    private childConstructor: (initialValue: U) => T;
    public validator: IValidator<TTypeFromIFormControlState<T>[]> = alwaysTrue;

    // constructor(private childConstructor: (initialValue: U) => T, private validator: IValidator<TTypeFromIFormControlState<T>[]> = alwaysTrue, private initialValues: U[] = undefined) {
    constructor(childConstructor: (initialValue: U) => T, options?: {values?: U[], validator?: IValidator<TTypeFromIFormControlState<T>[]> }) {
        this.childConstructor = childConstructor;
         if (options && options.values) {
            for (let val of options.values) {
                this.add(val);
            }
        }
        if (options && options.validator) {
            this.validator = options.validator;
         }
    }

    add(value: U = undefined): T {
        let child = this.childConstructor(value);
        child.parent = this;
        this._children.push(child);
        this.updateState(true);
        return child;
    }

    remove(index: number) {
        this._children.splice(index, 1);
        this.updateState(true);
    }

    get children(): Array<T> {
        return new Array(...this._children);
    }

    getChildren() {
        return this.children;
    }

    get value(): TTypeFromIFormControlState<T>[] {
        let ret = this._children.map(c => c.value);
        return ret;
    }


    get dirty(): boolean {
        return this._children.some(child => child.dirty);
    }

    get touched(): boolean {
        return this._children.some(child => child.touched);
    }

    get invalid(): boolean {
        return !!this._message || this._children.some(child => child.invalid);
    }

    get message(): string {
        return this._message;
    }

    validate() {
        this._message = this.validator(this.value, this);
    }

    updateState(validate: boolean) {
        if (validate) {
            this.validate();
        }
        if (this.parent) this.parent.updateState(validate);
        else {
            this.rootNotifyOnStateChange(validate);
        }
    }
}

export class FormControlValue<T> implements IFormControlState<T> {
    public message: string = undefined;
    public parent: IFormControlParent;
    public initialValue: T;
    public dirty: boolean = false;
    public touched: boolean = false;
    public invalid: boolean = false;
    public rootNotifyOnStateChange: (validate:boolean) => void = noop;
    private validator: IValidator<T>;
    private _value: T = undefined;
    private validateOnBlur = true;

    constructor(options: { value?: T, validator?: IValidator<T>, validateOnBlur?: boolean }) {
        this._value = options.value;
        this.initialValue = options.value;
        this.validator  = options.validator || alwaysTrue;
        if (options && options.validateOnBlur !== undefined) {
            this.validateOnBlur = options.validateOnBlur;
        }
    }

    get value(): T { return this._value };
    set value(newValue: T) {
        this._value = newValue;
    }

    updateValue(newValue: T, isBlur: boolean) {
        this._value = newValue;
        this.dirty = this._value !== this.initialValue;
        if (isBlur) this.touched = true;
        this.updateState(!this.validateOnBlur || isBlur);
    }

    getChildren(): IFormControlState<T>[] {
        return [];
    }

    validate() {
        this.message = this.validator(this.value, this);
        this.invalid = !!this.message;
    }

    updateState(validate: boolean) {
        if (validate) {
            this.validate();
        }
        if (this.parent) {
            this.parent.updateState(validate);
        } else {
            this.rootNotifyOnStateChange(validate);
        }
    }
}

export function validateChildren(parent: IFormControlState<any>) {
    parent.validate();
    for (let child of parent.getChildren()) {
        validateChildren(child);
    }
}