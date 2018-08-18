import * as React from 'react';
import './App.css';
import { Formik, Field, FieldArray } from 'formik';
import {alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators} from './validators';
import {IProfileData} from './types'
import MyForm from './MyForm'
import {updateAllControlState, IFormControlState, FormControlValue, FormControlMap, FormControlArray, fillFromJSON} from './formModel';
import FormModel, {ComponentProps} from './formModelReact';


interface IPageData {
    profile: IProfileData;
    valid: boolean;
    message: string;
    readonly: boolean;
}

let initialData : IPageData = {
    profile: {
        name: '',
        email: '',
        allowPhone: true,
        phone: '',
    },
    valid: true,
    message: '',
    readonly: false,
};

const validateName = composeValidators(required('Please enter a name'),
                                        minLength(4)('Please enter a name with min 4 characters'),
                                        maxLength(14)('Please enter a name with max 13 characters'));

const validateEMail = composeValidators(required('Please enter an e-mail'),
                                            email('Please enter a valid e-mail'));

const validatePhonenumber = composeValidators(required('Please enter a phone number'),
                                            minLength(4)('Please enter a phone number with min 4 characters'),
                                            maxLength(14)('Please enter a phone number with max 13 characters'));

const validatePhone = (allowPhone:boolean) => {console.log("validatePhone", allowPhone);
    return !allowPhone ? alwaysTrue : validatePhonenumber};

const initalValue : IProfileData = {
    name: 'abc',
    email: 'ade@ads.de',
    allowPhone: true,
    phone: '123'
};

class Profile extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    render() {
        return (<div>
            <FormModel
                formModel = {
                    new FormControlMap({
                        name: new FormControlValue(validateName),
                        email: new FormControlValue(validateEMail),
                        allowPhone: new FormControlValue<boolean>(),
                        phone: new FormControlValue(validatePhonenumber)
                    }) as FormControlMap<IProfileData>
                }
                initialValues = {initalValue}
                render = { (props) => {
                    console.log("render",props);
                    // let {propsForComponent, formModel} : {IFormControlState<IProfileData>, FormControlMap<IProfileData>} = props;
                    let propsForComponent = props.propsForComponent;
                    let formModel: FormControlMap<IProfileData> = props.formModel as FormControlMap<IProfileData>;
                    let nameChild = formModel.children.name;
                    let nameProps = propsForComponent(nameChild);
                    let emailChild = formModel.children.email;
                    let emailProps = propsForComponent(emailChild);
                    // {...propsForComponent(nameChild)}
                    return (<><div className='form-group'>
                            <label htmlFor="name">Name</label>
                            <input type="text" className={(nameChild.invalid? 'is-invalid' : '') + ' form-control'}
                            onChange={nameProps.onChange} onBlur={nameProps.onBlur} value={nameProps.value}
                            name="profile.name" placeholder="Enter name"/>
                        {nameChild.invalid && <div className="invalid-feedback">{(nameChild as FormControlValue<string>).message}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input type="text" className={(emailChild.invalid ? 'is-invalid' : '') + ' form-control'}
                                onChange={emailProps.onChange} onBlur={emailProps.onBlur} value={emailProps.value}
                                name="profile.email" placeholder="Enter e-mail" />
                            {emailChild.invalid && <div className="invalid-feedback">{(emailChild as FormControlValue<string>).message}</div>}
                        </div>
                        </>);
                    }
                }
            >
            </FormModel>
        </div>);
    }
}
/*
*/


/*
    <Formik
        initialValues={initialData}
        validateOnChange={true}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          console.log("submitting", values);
        }}
        validate={validate}
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
                <div className="row justify-content-center m-4">
                        <div className="col-8">
                            {values.message && <div className="alert alert-success" role="alert">
                                {values.message}
                            </div>}
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Profile</h5>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className={(errors.profile && errors.profile.name && touched.profile && touched.profile.name? 'is-invalid' : '') + ' form-control'}
                                                value={values.profile.name} onChange={handleChange} onBlur={handleBlur}
                                                name="profile.name" placeholder="Enter name" disabled={values.readonly}/>
                                            {errors.profile && errors.profile.name && <div className="invalid-feedback">{errors.profile.name}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">E-mail</label>
                                            <input type="text" className={(errors.profile && errors.profile.email && touched.profile && touched.profile.email? 'is-invalid' : '') + ' form-control'}
                                                value={values.profile.email} onChange={handleChange} onBlur={handleBlur}
                                                name="profile.email" placeholder="Enter e-mail" disabled={values.readonly}/>
                                            {errors.profile && errors.profile.email && <div className="invalid-feedback">{errors.profile.email}</div>}
                                        </div>
                                       <div className="form-check">
                                            <input className="form-check-input" name="profile.allowPhone" id="allowPhone" type="checkbox"
                                            checked={values.profile.allowPhone} onChange={handleChange} onBlur={handleBlur}
                                             disabled={values.readonly}/>
                                            <label className="form-check-label" htmlFor="allowPhone">
                                                Allow phone calls
                                            </label>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone number</label>
                                            <input type="text" className={(errors.profile && errors.profile.phone && touched.profile && touched.profile.phone? 'is-invalid' : '') + ' form-control'}
                                                value={values.profile.phone} onChange={handleChange} onBlur={handleBlur}
                                                name="profile.phone" placeholder="Enter phone" disabled={values.readonly}/>
                                            {errors.profile && errors.profile.phone && <div className="invalid-feedback">{errors.profile.phone}</div>}
                                        </div>
                                    </form>
                                    <div>
                                    values: {JSON.stringify(values.profile)}
                                    </div>
                                    <div>
                                    errors: {JSON.stringify(errors)}
                                    </div>
                                    <div>
                                    touched: {JSON.stringify(touched)}
                                    </div>
                                    <div className="mt-2">
                                        <button type="button" className="btn btn-primary" disabled={Object.keys(errors.profile || {}).length>0 ? true : false}>Save</button>
                                        <button type="button" className="ml-3 btn btn-secondary">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }}
        />
        */
  /*
 autocomplete="off"
{'is-invalid' : s.amount.$error, '
*/

export default Profile;
