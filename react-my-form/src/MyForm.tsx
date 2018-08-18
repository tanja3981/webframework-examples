import * as React from 'react';
import * as _ from 'lodash';

interface IState<T> {
    touched: Set<string>;
    dirty: Set<string>;
    value: T
}

interface IInputProps {
    name: string;
    value: string;
    onChange: (evt: React.SyntheticEvent) => void;
}

interface IProps<T> extends IState<T> {
    onChange: (evt: React.SyntheticEvent) => void;
    inputProps: (name:string) => IInputProps;
}

interface IMyFormProps<T> {
    initialValue: T;
    render: (props: IProps<T>) => React.ReactNode;
}

function addIfNotThereSet(set: Set<string>, key:string) {
    if (set.has(key)) { return set; }
    let r = new Set(set);
    r.add(key);
    return r;
}

function addIfNotThereMap(map: Map<string, string>, key:string, value: string) {
    let r = new Map(map);
    r.set(key, value);
    return r;
}

function addObject<T>(obj: T, key:string, value: string) {
    let r = Object.assign({}, obj);
    _.set(r, key, value);
    return r;
}

const handler = (value:any, meta: any) => ({
    get: function(target:any, prop: any){
        if (!Reflect.has(meta, prop)) meta[prop] = {touched: false, dirty: false, invalid: false};
        let r = Reflect.get(target, name);
        if (Array.isArray(r) || typeof r === 'object') {
            console.log("isArray or proxy");
        }
    },
    set: function(target: any, prop: any, value: any) {
        if (!Reflect.has(meta, prop)) meta[prop] = {touched: false, dirty: false, invalid: false};
        Reflect.set(target, prop, value);
        meta[prop]
    }
});


class MyForm<T> extends React.Component<IMyFormProps<T>, IState<T>> {
    constructor(props: IMyFormProps<T>) {
        super(props);
        this.state = {
            touched: new Set(),
            dirty: new Set(),
            value: props.initialValue
        };
    }

    public render() {
        return <div>
            {this.props.render({value: this.state.value,
                touched: this.state.touched,
                dirty: this.state.dirty,
                onChange: this.onChange,
                inputProps: this.inputProps})}
        </div>
    }

    private inputProps = (name: string) => ({
        name,
        value: _.get(this.state.value, name),
        onChange: this.onChange
    })

    private onChange = (evt: React.SyntheticEvent) => {
        let name = (evt.nativeEvent.target as any).name;
        let value = (evt.nativeEvent.target as any).value;
        this.setState({
            touched: addIfNotThereSet(this.state.touched, name),
            dirty: addIfNotThereSet(this.state.dirty, name),
            value: addObject(this.state.value, name, value)
            });
    }
    private isTouched = (name: string) => this.state.touched.has(name);
}


export default MyForm;