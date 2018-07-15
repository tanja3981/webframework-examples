import * as React from 'react';
import { Formik, Field, FieldArray } from 'formik';
import {required, numeric, min, max, composeValidators} from './validators';
import {ISelectionData, IColumnSelection} from './types';
import { connect } from 'react-redux';

interface IComboBoxValue {
    label: string,
    value: string,
    minValue: number,
    maxValue: number,
    step: number
}

export function allowedSelections(comboBoxValues: IComboBoxValue[], columnSelections: IColumnSelection[], selected: string|undefined) {
    console.log("allowedSelections", comboBoxValues, columnSelections, selected);
    let forbidden = columnSelections.map(s => s.selected).filter(v => v !== selected);
    return comboBoxValues.filter(cbv => !forbidden.find(v => v===cbv.value));
}

export function updatePrice(setFieldValue: (field: string, value: any) => void, selected: string, amount: string, cIdx: number, sIdx: number, errors: any) {
    console.log("updatePrice", cIdx, sIdx, selected);
    if (errors && errors.columns && errors.columns[cIdx] && errors.columns[cIdx].selections
        && errors.columns[cIdx].selections[sIdx] && errors.columns[cIdx].selections[sIdx].amount) {
        console.log("ignore updatePrice due to error");
    } else {
        console.log("updatePrice", cIdx, sIdx, selected, amount, errors) ;
        window.setTimeout(() => {
            setFieldValue(`columns[${cIdx}].selections[${sIdx}].price`, Number(amount) * 5, );
        }, 1000);
    }
}

const amountValidator = composeValidators(required('Please enter amount'), numeric('must be a number'), min(5)('Must be at least 5'), max(100)('Must be less than 100'));

class Complex extends React.Component<any> {
    public render() {
        let gComboBoxValues = this.props.comboBoxValues;
        let initialData : ISelectionData[] = this.props.complex;
        return (<div>
            <Formik
                initialValues={{
                    columns: initialData,
                }}
                validateOnChange={true}
                validate={values => {
                    let errors = {columns: values.columns.map(column => {
                        return {selections: column.selections.map(sel =>
                            ({amount: amountValidator(sel.amount as string)})
                        )}}
                    )};
                    console.log("validate errors", errors, values);
                    return errors;
                }}
                onSubmit={(
                values,
                { setSubmitting, setErrors /* setValues and other goodies */ }
                ) => {
                console.log("submitting", values);
                }}
                render={({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                setFieldValue
                }) => {
                    console.log("render ", values, touched, errors);
                    return (
                    <form className="row justify-content-center m-4" onSubmit={handleSubmit}>
                        <FieldArray
                            name="columns"
                            render={colArrayHelpers => {
                                return values.columns.map((column, cIdx) =>
                                (<div className="col-4" key={cIdx}>
                                    <div className="card">
                                        <FieldArray
                                            name={`columns[${cIdx}].selections`}
                                            render={selArrayHelpers => {
                                                return values.columns[cIdx].selections.map((sel, sIdx) => (
                                                <div className="card-body" key={sIdx}>
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <select name={`columns[${cIdx}].selections[${sIdx}].selected`} className="form-control" value={values.columns[cIdx].selections[sIdx].selected} onChange={(evt) => {handleChange(evt); updatePrice(setFieldValue, evt.target.value, values.columns[cIdx].selections[sIdx].amount, cIdx, sIdx, errors);}} onBlur={handleBlur}>
                                                            {
                                                                allowedSelections(gComboBoxValues, values.columns[cIdx].selections, sel.selected).map(opt =>
                                                                (
                                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                                ))
                                                            }
                                                            </select>
                                                        </div>
                                                        <div className="col-4">
                                                            <input type="text"  autoComplete="off" className={errors && errors.columns && errors.columns[cIdx] &&  errors.columns[cIdx].selections && errors.columns[cIdx].selections[sIdx]
                                                                    && errors.columns[cIdx].selections[sIdx].amount ? 'is-invalid form-control' : 'form-control'}
                                                                name={`columns[${cIdx}].selections[${sIdx}].amount`}
                                                                value={values.columns[cIdx].selections[sIdx].amount} onChange={(evt) => {handleChange(evt);}} onBlur={(evt) => {handleBlur(evt); updatePrice(setFieldValue, values.columns[cIdx].selections[sIdx].selected, values.columns[cIdx].selections[sIdx].amount, cIdx, sIdx, errors);}}
                                                                placeholder="Enter amount"/>
                                                            {errors && errors.columns && errors.columns[cIdx] &&  errors.columns[cIdx].selections && errors.columns[cIdx].selections[sIdx]
                                                                    && errors.columns[cIdx].selections[sIdx].amount
                                                                && <div className="invalid-feedback">{errors.columns[cIdx].selections[sIdx].amount}</div>}
                                                        </div>
                                                        <div className="col-3">
                                                            {values.columns[cIdx].selections[sIdx].price} €
                                                        </div>
                                                        <div className="col-1">
                                                            <a href="#" onClick={(evt) => {evt.preventDefault(); selArrayHelpers.remove(sIdx)}}><i className="text-dark fa fa-trash-o"/></a>
                                                        </div>
                                                    </div>
                                                </div>
                                                ));
                                            }}
                                        />
                                        { values.columns[cIdx].selections.length < gComboBoxValues.length ?
                                        (<div className="col-1 pb-3 pt-3">
                                            <a href="#" onClick={(evt) => {evt.preventDefault(); setFieldValue('columns[${cIdx}].selections', values.columns[cIdx].selections.push({selected: allowedSelections(gComboBoxValues, values.columns[cIdx].selections, undefined)[0].value, amount: '15', price: null}));}}><i className="text-dark fa fa-plus"/></a>
                                        </div>) : null
                                        }
                                    </div>
                                </div>));
                            }}
                        />
                    </form>)
                    }}
                />
            </div>);
        }
}

  /*
 autocomplete="off"
{'is-invalid' : s.amount.$error, '
*/


const mapStateToProps = (state: any, props: any) => {
    console.log("Detail Component mapStateToProps", state, props);
    return {
        comboBoxValues: state.comboBoxValues,
        complex: state.complex,
    }
}

export default connect(mapStateToProps)(Complex);
