import * as React from 'react';
import {numeric, min, max, alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators, elminateUndefined, IValidator} from '../validators';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {IComboBoxValue} from '../types';
import {listItemSave, flashMessageSet} from '../actions';
import {validateChildren, IFormControlState, FormControlValue, FormControlMap, FormControlArray} from '../formModel';
import FormModel, {ComponentProps, ComponentState} from '../formModelReact';

interface IComboBoxStringValue {
    label: string,
    value: string,
    minValue: string,
    maxValue: string,
    step: string
};

interface IFormData extends IComboBoxStringValue {
    message: string
}

let minSmallerThanMax = (message: string) => function (value: string, form: FormControlValue<string>) {
    if (form.parent.children.minValue.invalid) return undefined;
    return Number(form.parent.children.minValue.value) > Number(value) ? message : undefined;
}

let formMinSmallerThanMax = (value: IComboBoxStringValue) => Number(value.minValue) > Number(value.maxValue) ? 'must be bigger than minimun' : undefined

let validateLabel = composeValidators(required('Must not be empty'),
                    minLength(1)('Must be at least 1 character'),
                    maxLength(5)('Must be at most 5 characters'));
let validateMinValue = composeValidators(required('Must not be empty'),
                        numeric('Must not be a number'),
                        min(10)('Must be at least 10'),
                        max(1000)('Must be at most 1000'));
let validateMaxValue = composeValidators(required('Must not be empty'),
                        numeric('Must be a number'),
                        min(10)('Must be at least 10'),
                        minSmallerThanMax('must be bigger than minimun'),
                        max(1000)('Must be at most 1000'));
let validateStep = composeValidators(required('Must not be empty'),
                        numeric('Must be a number'),
                        min(5)('Must be at least 5'),
                        max(100)('Must be at most 100'));

interface IProps {
    item: IComboBoxValue;
    save: (p: IComboBoxStringValue) => void;
    setFlashMessage: typeof flashMessageSet;
}

function createFormModel(item: IComboBoxValue) {
    return new FormControlMap({
        label: new FormControlValue({validator: validateLabel, value: item.label, validateOnBlur: false}),
        value: new FormControlValue({value: item.value}),
        minValue: new FormControlValue({validator: validateMinValue, value: item.minValue.toString(), validateOnBlur: false}),
        maxValue: new FormControlValue({validator: validateMaxValue, value: item.maxValue.toString(), validateOnBlur: false}),
        step: new FormControlValue({validator: validateStep, value: item.step.toString(), validateOnBlur: false})
    })
}

class ListEdit extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
    }

    cancel(evt: React.SyntheticEvent) {
        console.log("props", (this as any).props);
        evt.preventDefault();
        (this as any).props.history.push(`/list/${(this as any).props.item.value}/view`);
    }

    save(val: IComboBoxStringValue) {
        let values : IComboBoxValue = {
            label: val.label,
            value: val.value,
            minValue: Number(val.minValue),
            maxValue: Number(val.maxValue),
            step: Number(val.step)
        };
        console.log("submitting", values);
        (this as any).props.save(values);
        (this as any).props.history.push(`/list/${this.props.item.value}/view`);
        (this as any).props.setFlashMessage('Item saved');
    }

    public render() {
        let props = this.props;
        let cancel = this.cancel;
        let save = this.save;
    return (
    <FormModel
        formModel = { createFormModel(props.item)}
        validateInitialValues = {true}
        validateBottomUp = {false}
        render = { (props) => {
            let m = props.formModel;
            return <div>
                <h5 className="card-title">
                    <Link to={`/list/${m.value.value}/view`}><i className="text-dark fa fa-arrow-circle-left"/></Link> View item
                </h5>
                <div className="form-group">
                    <label htmlFor="name">Value:</label>
                    <input type="text" className="form-control" disabled={true}
                        name="value" {...props.propsForComponent(m.children.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="name">Label:</label>
                    <input type="text" placeholder="Enter label"
                        name="label" {...props.propsForComponent(m.children.label)}
                        className = {m.children.label.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {m.children.label.invalid && <div className="invalid-feedback">{m.children.label.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Minimum Value:</label>
                    <input type="text" placeholder="Enter minimum value"
                        name="minValue" {...props.propsForComponent(m.children.minValue)}
                        className = {m.children.minValue.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {m.children.minValue.invalid && <div className="invalid-feedback">{m.children.minValue.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Maximum Value:</label>
                    <input type="text" placeholder="Enter maximum value"
                        name="maxValue" {...props.propsForComponent(m.children.maxValue)}
                        className = {m.children.maxValue.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {m.children.maxValue.invalid && <div className="invalid-feedback">{m.children.maxValue.message}</div>}
                </div>
                <div className="form-group">
                    <label htmlFor="name">Step:</label>
                    <input type="text" placeholder="Enter step value"
                        name="step" {...props.propsForComponent(m.children.step)}
                        className = {m.children.step.invalid ? 'form-control is-invalid' : 'form-control'}
                    />
                    {m.children.step.invalid && <div className="invalid-feedback">{m.children.step.message}</div>}
                </div>
                <div className="mt-2">
                    <button type="submit" className="btn btn-primary" onClick={() => save(m.value)} disabled={!m.dirty || m.invalid}>Save</button>
                    <button type="button" className="ml-3 btn btn-secondary" onClick={cancel}>Cancel</button>
                </div>
            </div>
        }}
    />);
    }
}

const mapStateToProps = (state: any, props: any) => {
    console.log("Detail Component mapStateToProps", state, props);
    let filtered = state.comboBoxValues.filter((c:any) => c.value === props.match.params.value);
    if (filtered.length!==1) { props.history.replace('/list') };
    return {
        item: filtered[0]
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
      save: (item:IComboBoxStringValue) => {
        dispatch(listItemSave(({
            label: item.label,
            value: item.value,
            minValue: Number(item.minValue),
            maxValue: Number(item.maxValue),
            step: Number(item.step)
        } as IComboBoxValue)))
      },
      setFlashMessage: (message: string) => dispatch(flashMessageSet(message)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListEdit);
