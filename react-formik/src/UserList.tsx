import * as React from 'react';
import './App.css';
import {EGeschlecht, IUser} from "./types";
import {Formik, Field, FieldArray} from 'formik';
import {IProfileData} from "./types";
import {connect} from "react-redux";


let initialData: IUserPageData = {
    users: [
        {
            name: "Einstein",
            vorname: "Albert",
            geschlecht: EGeschlecht.maennlich,
            aktiv: true,
            id: '123'
        }, {
            name: "Currie",
            vorname: "Madame",
            geschlecht: EGeschlecht.weiblich,
            aktiv: false,
            id: '234'
        }
    ],
    valid: true,
    message: '',
    readonly: ''
};

interface IUserPageData {
    users: IUser[];
    valid: boolean;
    message: string;
    readonly: string;
}

const UserList = () => (
    <Formik
        initialValues={initialData}
        validateOnChange={true}
        onSubmit={(
            values,
            {setSubmitting, setErrors}
        ) => {
            console.log("submitting", values);
        }}
        // validate={validate}
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
                        <table>
                            <thead className="thead-light">
                            <td>Name</td>
                            <td>Geschlecht</td>
                            <td>Aktiv</td>
                            </thead>
                            {
                                initialData.users.map((us) => (
                                    <tr>
                                        <td>{us.vorname}</td>
                                        <td>{us.name}</td>
                                        <td>
                                            <input type="checkbox" checked={us.aktiv} readOnly={initialData.readonly == us.id}/>
                                        </td>
                                        <td>{us.geschlecht}</td>
                                    </tr>
                                ))
                            }
                        </table>
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
    console.log("UserList Component mapStateToProps", state, props);
    return state.profile;
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        save: (item: IProfileData) => {
            console.log("UserList.save ", item)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);