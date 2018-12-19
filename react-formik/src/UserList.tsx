import * as React from 'react';
import './App.css';
import {EGeschlecht, IUser} from "./types";
import {Formik, Field, FieldArray} from 'formik';
import {connect} from "react-redux";


let initialData: IUserPageData = {
    users: [

    ],
    valid: true,
    message: '',
    editItem: ''
};

interface IUserPageData {
    users: IUser[];
    valid: boolean;
    message: string;
    editItem: string;
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
                            <form onSubmit={handleSubmit}>
                                <table>
                                    <thead className="thead-light">
                                    <tr>
                                        <td>Name</td>
                                        <td>Vorname</td>
                                        <td>Aktiv</td>
                                        <td>Geschlecht</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        values.users.map((us) => (

                                            <tr key={us.id}>
                                                <td><input type="text" value={us.vorname} name="us.vorname"
                                                           disabled={values.editItem !== us.id} onChange={handleChange}
                                                           onBlur={handleBlur}/>
                                                </td>
                                                <td>{us.name}</td>
                                                <td>
                                                    <input type="checkbox" checked={us.aktiv} name="aktiv"
                                                           disabled={values.editItem !== us.id}
                                                           onChange={handleChange} onBlur={handleBlur}/>
                                                </td>
                                                <td>
                                                    {us.geschlecht.toString()}</td>
                                                <td>
                                                    {(values.editItem !== us.id) &&
                                                    <button id={us.id}
                                                            type="handleSubmit" className="btn btn-primary"
                                                            onChange={handleChange} onBlur={handleBlur}
                                                            onClick={e => {
                                                                console.log("edit clicked", us.id);
                                                                values.editItem = us.id;
                                                                e.preventDefault();
                                                            }}>Bearbeiten
                                                    </button>
                                                    }
                                                    {(values.editItem === us.id) &&
                                                    <button id={us.id}
                                                            type="handleSubmit" className="btn btn-primary"
                                                            onChange={handleChange} onBlur={handleBlur}
                                                            onClick={e => {
                                                                console.log("save clicked", us.id)
                                                            }}>Speichern</button>
                                                    }
                                                </td>
                                                <td>Item: {values.editItem}</td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </form>
                        </div>

                    </div>
                )
            }}
        />
    )
;


/*
autocomplete="off"
{'is-invalid' : s.amount.$error, '
*/

const mapStateToProps = (state: any, props: any) => {
    console.log("UserList Component mapStateToProps", state, props);
    return state.users;
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        save: (item: IUser[]) => {
            console.log("UserList.save ", item)
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);