import {IFormControlState, updateAllControlState, FormControlValue, FormControlMap, FormControlArray, fillFromJSON} from './formModel';
import * as React from 'react';

export interface ComponentProps<T> {
    onChange: (evt: React.SyntheticEvent) => void;
    onBlur: (evt: React.SyntheticEvent) => void;
    value: T;
}

export interface RenderProps<M, T> {
    value: T;
    formModel: M;
    propsForComponent: (comp: IFormControlState<any>) => ComponentProps<any>;
}

export interface IProps<M extends IFormControlState<T>, T> {
    formModel: M;
    initialValues: T;
    render: (props: RenderProps<M, T>) => JSX.Element;
}

export default class FormModel<M extends IFormControlState<T>, T> extends React.Component< IProps<M, T>, { formModel: M }> {
    constructor(props: IProps<M, T>) {
        super(props);
        this.state = {formModel : props.formModel};
        if (props.initialValues) {
            fillFromJSON(this.state.formModel, props.initialValues);
        }
    }
    propsForComponent = (comp: IFormControlState<any>): ComponentProps<any>  => {
        return {
            onChange: this.onChange(comp),
            onBlur: this.onBlur(comp),
            value: comp.value
        }
    }
    onChange = (comp: IFormControlState<any>) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handle change event ", evt, "for ", comp);
        comp.value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        this.forceUpdate();
    }
    onBlur = (comp: IFormControlState<any>) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handle blur event ", evt, "for ", comp);
        comp.value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        comp.touched = true;
        this.forceUpdate();
    }
    render(): JSX.Element {
        let renderProps : RenderProps<M, T> = {
            value: this.state.formModel.value,
            formModel: this.state.formModel,
            propsForComponent: this.propsForComponent
        };
        return (<form>{this.props.render(renderProps)}</form>);
    }
}

export const ComponentState = ({control} : {control: IFormControlState<any>}) => (
    <div>
        dirty: {JSON.stringify(control.dirty)}
        , touched: {JSON.stringify(control.touched)}
        , invalid: {JSON.stringify(control.invalid)}
        , value: {JSON.stringify(control.value)}
    </div>
)