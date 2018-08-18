import * as React from 'react';
import { Formik, Field, FieldArray, setNestedObjectValues } from 'formik';
import {numeric, min, max, alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators, elminateUndefined} from '../validators';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {IComboBoxValue} from '../types';
import {listItemSave, flashMessageSet} from '../actions';

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

let biggerThan = (otherValue:string) => (message:string) => (value:string) => Number(value)<=Number(otherValue) ? message : undefined;

function validate(values: IFormData) {
    return elminateUndefined({
        label: composeValidators(required('Must not be empty'),
                    minLength(1)('Must be at least 1 character'),
                    maxLength(5)('Must be at most 5 characters'))(values.label),
        minValue:  composeValidators(required('Must not be empty'),
                        numeric('Must not be a number'),
                        min(10)('Must be at least 10'),
                        max(1000)('Must be at most 1000'))(values.minValue),
        maxValue:  composeValidators(required('Must not be empty'),
                        numeric('Must be a number'),
                        biggerThan(values.minValue)('must be bigger than minimun'),
                        min(10)('Must be at least 10'),
                        max(1000)('Must be at most 1000'))(values.maxValue),
        step:       composeValidators(required('Must not be empty'),
                        numeric('Must be a number'),
                        min(5)('Must be at least 5'),
                        max(100)('Must be at most 100'))(values.step)
    });
}


class ListEdit extends React.Component<any> {
    public cancel = (evt: React.SyntheticEvent) => {
        console.log("props", (this as any).props);
        evt.preventDefault();
        (this as any).props.history.push(`/list/${(this as any).props.item.value}/view`);
        console.log("cancel");
    }
    public render() {
    return <Formik
        initialValues={(this as any).props.item}
        validateOnChange={true}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          console.log("submitting", values, (this as any).props);
          (this as any).props.save(values);
          (this as any).props.history.push(`/list/${(this as any).props.item.value}/view`);
          (this as any).props.setFlashMessage('Item saved');
        }}
        validate={validate}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => {
            console.log("render ", values, touched, errors, isValid);
            return (
                <div>
                    <h5 className="card-title">
                        <Link to={`/list/${values.value}/view`}><i className="text-dark fa fa-arrow-circle-left"/></Link> View item
                    </h5>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Value:</label>
                        <input type="text" className="form-control" disabled={true}
                            name="value" value={values.value} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Label:</label>
                        <input type="text" placeholder="Enter label"
                            name="label" value={values.label} onChange={handleChange} onBlur={handleBlur}
                            className = {errors.label && touched.label ? 'form-control is-invalid' : 'form-control'}
                        />
                        {errors.label && touched.label && <div className="invalid-feedback">{errors.label}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Minimum Value:</label>
                        <input type="text" placeholder="Enter minimum value"
                            name="minValue" value={values.minValue} onChange={handleChange} onBlur={handleBlur}
                            className = {errors.minValue && touched.minValue ? 'form-control is-invalid' : 'form-control'}
                        />
                        {errors.minValue && touched.minValue && <div className="invalid-feedback">{errors.minValue}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Maximum Value:</label>
                        <input type="text" placeholder="Enter maximum value"
                            name="maxValue" value={values.maxValue} onChange={handleChange} onBlur={handleBlur}
                            className = {errors.maxValue && touched.maxValue ? 'form-control is-invalid' : 'form-control'}
                        />
                        {errors.maxValue && touched.maxValue && <div className="invalid-feedback">{errors.maxValue}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Step:</label>
                        <input type="text" placeholder="Enter step value"
                            name="step" value={values.step} onChange={handleChange} onBlur={handleBlur}
                            className = {errors.step && touched.step ? 'form-control is-invalid' : 'form-control'}
                        />
                        {errors.step && touched.step && <div className="invalid-feedback">{errors.step}</div>}
                    </div>
                    <div className="mt-2">
                        <button type="submit" className="btn btn-primary" disabled={Object.keys(errors).length>0}>Save</button>
                        <button type="button" className="ml-3 btn btn-secondary" onClick={this.cancel}>Cancel</button>
                    </div>

                </form>
            </div>
                )
            }}
        />
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
