import * as React from 'react';
import './App.css';
import {Formik, Field, FieldArray} from 'formik';
import {alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators} from './validators';
import {IProfileData, IUser} from './types'
import MyForm from './MyForm'
import {connect} from 'react-redux';
import {validateChildren, IFormControlState, FormControlValue, FormControlMap, FormControlArray} from './formModel';
import FormModel, {ComponentProps, ComponentState} from './formModelReact';
import {profileSave, flashMessageSet, userSave} from './actions'
import FlashMessage from './FlashMessage';
import {render} from "react-dom";

interface IProps {
    users: IUser[],
    userSave: typeof userSave;
    setFlashMessage: typeof flashMessageSet;
    editing: '';
}

class UserList extends React.Component<IProps, {}> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            users: [],
            editing: ''
        };
    }

    editUser(id: string) {
        this.state.editing = id;
    }

    saveUser(user: IUser) {

    }

    render() {
        let users = this.props.users;
        let editing = this.props.editing;
        let editUser = this.editUser;
        return (
            <div>
                <div className="row">
                    <div className="col-2">Name</div>
                    <div className="col-2">Vorname</div>
                    <div className="col-2">Aktiv</div>
                    <div className="col-2">Geschlecht</div>
                </div>
                {
                    this.props.users.map((user) => {
                        return this.renderUser(user, this.editUser(user.id));
                    })
                }
                <div className="row">
                    <div className="col-10"></div>
                    <div className="col-2">
                        <button className="btn btn-primary">Neu</button>
                    </div>
                </div>
                {this.props.editing}
            </div>
        );

    }

    renderUser(user: IUser, editUser: void) {

        return (
            <div className="row" key={user.id}>
                <div className="col-2">

                    <label>{user.name}</label>
                </div>
                <div className="col-2">{user.vorname}</div>
                <div className="col-2">
                    <input
                        type="checkbox" checked={user.aktiv}/>
                </div>
                <div className="col-2">{user.geschlecht}</div>
                <div className="col-2">{user.id}</div>
                <div className="col-2">
                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            editUser
                        }>Bearbeiten
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any, props: any) => {
    console.log("UserList Component mapStateToProps", state, props);
    return {
        users: state.users
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        userSave: (user: IUser) => dispatch(userSave(user)),
        setFlashMessage: (message: string) => dispatch(flashMessageSet(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserList);