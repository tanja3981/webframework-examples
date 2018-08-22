import * as React from 'react';
import './App.css';
import {Formik, Field, FieldArray} from 'formik';
import {alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators} from './validators';
import {IComboBoxValue, IProfileData} from './types'
import {flashMessageSet, listItemSave} from "./actions";
import {connect} from "react-redux";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;

interface IPageData {
    profile: IProfileData;
    valid: boolean;
    message: string;
    readonly: boolean;
}

let initialData: IPageData = {
    profile: {
        name: '',
        email: '',
        allowPhone: true,
        phone: '',
        password: '',
        password2: ''
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

const validatePassword = composeValidators(required('Bitte geben Sie ein Pwd ein'),
    minLength(4)('Mindestlänge des Passworts ist 4 Zeichen'));

const validatePasswortRepeated = (other: string, key: string) => {
    console.log("pwd wiederholung wird validiert", key, other);
    return other !== key;
};

const validatePhone = (allowPhone: boolean) => {
    console.log("validatePhone", allowPhone);
    return !allowPhone ? alwaysTrue : validatePhonenumber
};

const validate = (values: IPageData) => {

    let
        profile = {
            name: validateName(values.profile.name),
            email: validateEMail(values.profile.email),
            phone: validatePhone(values.profile.allowPhone)(values.profile.phone),
            password: validatePassword(values.profile.password) && validatePasswortRepeated(values.profile.password, values.profile.password2),
            password2: validatePasswortRepeated(values.profile.password, values.profile.password2)
        };
    if(profile.name || profile.email || profile.phone || profile.password || profile.password2) {
        return profile;
    }
    return alwaysTrue;
    console.log("validate " , profile);
};


const Profile = () => (
    <Formik
        initialValues={initialData}
        validateOnChange={true}
        onSubmit={(
            values,
            {setSubmitting, setErrors}
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
                                        <input type="text"
                                               className={(errors.profile && errors.profile.name && touched.profile && touched.profile.name ? 'is-invalid' : '') + ' form-control'}
                                               value={values.profile.name} onChange={handleChange} onBlur={handleBlur}
                                               name="profile.name" placeholder="Enter name" disabled={values.readonly}/>
                                        {errors.profile && errors.profile.name &&
                                        <div className="invalid-feedback">{errors.profile.name}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">E-mail</label>
                                        <input type="text"
                                               className={(errors.profile && errors.profile.email && touched.profile && touched.profile.email ? 'is-invalid' : '') + ' form-control'}
                                               value={values.profile.email} onChange={handleChange} onBlur={handleBlur}
                                               name="profile.email" placeholder="Enter e-mail"
                                               disabled={values.readonly}/>
                                        {errors.profile && errors.profile.email &&
                                        <div className="invalid-feedback">{errors.profile.email}</div>}
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" name="profile.allowPhone" id="allowPhone"
                                               type="checkbox"
                                               checked={values.profile.allowPhone} onChange={handleChange}
                                               onBlur={handleBlur}
                                               disabled={values.readonly}/>
                                        <label className="form-check-label" htmlFor="allowPhone">
                                            Allow phone calls
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="phone">Phone number</label>
                                        <input type="text"
                                               className={(errors.profile && errors.profile.phone && touched.profile && touched.profile.phone ? 'is-invalid' : '') + ' form-control'}
                                               value={values.profile.phone} onChange={handleChange} onBlur={handleBlur}
                                               name="profile.phone" placeholder="Enter phone"
                                               disabled={values.readonly}/>
                                        {errors.profile && errors.profile.phone &&
                                        <div className="invalid-feedback">{errors.profile.phone}</div>}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password1">Passwort</label>
                                        <input type="password"
           className={(errors.profile && errors.profile.password && touched.profile && touched.profile.password ? 'is-invalid' : '') + ' form-control'}
                                               value={values.profile.password} onChange={handleChange} onBlur={handleBlur}
                                               name="profile.password" placeholder="dein super geheimes Passwort"
                                               disabled={values.readonly}
                                        />
                                        {errors.profile && errors.profile.password &&
                                        <div className="invalid-feedback">{errors.profile.password}</div>}

                                        <label htmlFor="password2">Passwort Wiederholung</label>
                                        <input type="password"
                                               className={(errors.profile && errors.profile.password2 && touched.profile && touched.profile.password2 ? 'is-invalid' : '') + ' form-control'}
                                               value={values.profile.password2} onChange={handleChange} onBlur={handleBlur}
                                               name="profile.password2" placeholder="Wiederhole das Passwort"
                                               disabled={values.readonly}/>
                                        {errors.profile && errors.profile.password2 &&
                                        <div className="invalid-feedback">{errors.profile.password2}</div>}
                                    </div>


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
                                    <button type="handleSubmit" className="btn btn-primary"
                                            disabled={Object.keys(errors.profile || {}).length > 0 ? true : false}>Save
                                    </button>
                                    <button type="button" className="ml-3 btn btn-secondary">Cancel</button>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }}
    />
);

/*
autocomplete="off"
{'is-invalid' : s.amount.$error, '
*/



const mapStateToProps = (state: any, props: any) => {
    console.log("Profile Component mapStateToProps", state, props);
    return state.profile;
};

const mapDispatchToProps = (dispatch:any) => {
    return {
        save: (item: IProfileData) => {
            console.log("Profile.save ", item)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
