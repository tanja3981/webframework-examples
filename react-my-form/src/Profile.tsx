import * as React from 'react';
import './App.css';
import { Formik, Field, FieldArray } from 'formik';
import {alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators} from './validators';
import {IProfileData} from './types'
import MyForm from './MyForm'
import { connect } from 'react-redux';
import {validateChildren, IFormControlState, FormControlValue, FormControlMap, FormControlArray} from './formModel';
import FormModel, {ComponentProps, ComponentState} from './formModelReact';
import {profileSave, flashMessageSet} from './actions'
import FlashMessage from './FlashMessage';

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

interface IProps
{
    readonly: boolean,
    profile: IProfileData,
    profileSave: typeof profileSave,
    setFlashMessage: typeof flashMessageSet;
}

class Profile extends React.Component<IProps, {readonly: boolean}> {

    constructor(props: IProps) {
        super(props);
        this.state = {readonly: false};
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    save(profile: IProfileData) {
        this.props.profileSave(profile);
        this.setState({readonly: true});
        this.props.setFlashMessage('profile saved');
    }
    cancel() {
        (this as any).props.history.push(`/`);
    }

    render() {
        let props = this.props;
        let save = this.save;
        let cancel = this.cancel;
        let readonly = this.state.readonly;
        return (
            <div className="row justify-content-center m-4">
                <div className="col-8">
                    <FlashMessage />
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Profile</h5>
                            <FormModel
                                formModel = {
                                    new FormControlMap({
                                        name: new FormControlValue({validator: validateName, value: props.profile.name}),
                                        email: new FormControlValue({validator: validateEMail, value: props.profile.email}),
                                        allowPhone: new FormControlValue<boolean>({value: props.profile.allowPhone}),
                                        phone: new FormControlValue({validator: validatePhonenumber, value: props.profile.phone})
                                    })
                                }
                                render = { (props) => {
                                    console.log("render",props);
                                    let {propsForComponent, formModel} = props;
                                    let c = formModel.children;
                                    return (<>
                                            <div className="form-group">
                                                <label htmlFor="name">Name</label>
                                                <input type="text" className={(c.name.invalid ? 'is-invalid' : '') + ' form-control'}
                                                    {...propsForComponent(c.name)}
                                                    name="name" placeholder="Enter name" disabled={readonly}/>
                                                {c.name.invalid && <div className="invalid-feedback">{c.name.message}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">E-mail</label>
                                                <input type="text" className={(c.email.invalid ? 'is-invalid' : '') + ' form-control'}
                                                    {...propsForComponent(c.email)}
                                                    name="email" placeholder="Enter e-mail" disabled={readonly}/>
                                                {c.email.invalid && <div className="invalid-feedback">{c.email.message}</div>}
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" name="allowPhone" id="allowPhone" type="checkbox"
                                                    {...propsForComponent(c.allowPhone)}
                                                    checked={c.allowPhone.value}
                                                    disabled={readonly}/>
                                                <label className="form-check-label" htmlFor="allowPhone">
                                                    Allow phone calls
                                                </label>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Phone number</label>
                                                <input type="text" className={(c.allowPhone.value && c.phone.invalid ? 'is-invalid' : '') + ' form-control'}
                                                    {...propsForComponent(c.phone)}
                                                    name="phone" placeholder="Enter phone" disabled={readonly || !c.allowPhone.value}/>
                                                {c.allowPhone.value && c.phone.invalid && <div className="invalid-feedback">{c.phone.message}</div>}
                                            </div>
                                            <ComponentState control={formModel}/>
                                            <div className="mt-2">
                                                <button type="button" className="btn btn-primary" onClick={() => save(formModel.value)} disabled={readonly || formModel.invalid}>Save</button>
                                                <button type="button" className="ml-3 btn btn-secondary" disabled={readonly} onClick={cancel}>Cancel</button>
                                            </div>
                                        </>);
                                    }
                                }
                            >
                            </FormModel>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

const mapStateToProps = (state: any, props: any) => {
    console.log("Profile Component mapStateToProps", state, props);
    return {
        profile: state.profile,
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        profileSave: (profile: IProfileData) => dispatch(profileSave(profile)),
        setFlashMessage: (message: string) => dispatch(flashMessageSet(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);