import {IFormControlState, validateChildren, FormControlValue, FormControlMap, FormControlArray} from './formModel';
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
    validateInitialValues?: boolean;
    validateBottomUp?: boolean;
    render: (props: RenderProps<M, T>) => JSX.Element;
}

export type TPropsForComponent = (comp: IFormControlState<any>) => ComponentProps<any>;

export default class FormModel<M extends IFormControlState<T>, T> extends React.Component< IProps<M, T>, { formModel: M, version: number }> {
    private version = 0;
    constructor(props: IProps<M, T>) {
        super(props);

        this.state = {formModel : props.formModel, version: this.version};
        if (props.validateInitialValues) {
            validateChildren(props.formModel);
        }
        this.state.formModel.rootNotifyOnStateChange = this.rootNotifyOnStateChange;
        console.log("construct <FormModel />");
    }
    rootNotifyOnStateChange = (validate: boolean) => {
        console.log("rootNotifyOnStateChange");
        this.setState({version: this.version++});
        if (!this.props.validateBottomUp && validate) {
            validateChildren(this.state.formModel);
        }
    }
    propsForComponent: TPropsForComponent = (comp: FormControlValue<any>) => {
        return {
            onChange: this.onChange(comp),
            onBlur: this.onBlur(comp),
            value: comp.value
        }
    }
    componentWillReceiveProps() {
        console.log("componentWillReceiveProps <FormModel />", this.version);
    }
    onChange = (comp: FormControlValue<any>) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        let value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        comp.updateValue(value, false);
    }
    onBlur = (comp: FormControlValue<any>) => (evt: React.ChangeEvent<HTMLInputElement>) => {
        let value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;
        comp.updateValue(value, true);
    }
    render(): JSX.Element {
        let renderProps : RenderProps<M, T> = {
            value: this.state.formModel.value,
            formModel: this.state.formModel,
            propsForComponent: this.propsForComponent
        };
        console.log("Render <FormModel />", this.version);
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