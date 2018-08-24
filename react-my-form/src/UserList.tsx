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
            users: props.users,
            editing: ''
        };
        this.saveUser = this.saveUser.bind(this);
    }

    editUser(id: string) {
        console.log("editUser", id);
        this.setState( {editing: id});

    }

    saveUser(user: IUser) {

    }

    render() {
        let editing = this.props.editing;
        return (
            <div>
                <div className="row">
                    <div className="col-2">Name</div>
                    <div className="col-2">Vorname</div>
                    <div className="col-2">Aktiv</div>
                    <div className="col-2">{editing}</div>
                </div>
                {        //this.state =;
                    this.props.users.map((user) => {
                        return this.renderUser(user);
                    })
                }
                <div className="row">
                    <div className="col-10"></div>
                    <div className="col-2">

                        <button className="btn btn-primary" >Neu</button>
                    </div>
                </div>

            </div>
        );

    }

    renderUser(user: IUser) {
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
                <div className="col-2">{user.id}
                    {this.props.editing }
                    {this.props.editing === user.id}
                    </div>
                <div className="col-2">
                    {
                        this.props.editing === user.id ?
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    this.saveUser(user)
                                }>Speichern
                            </button>
                            :
                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    this.editUser(user.id)
                                }>Bearbeiten
                            </button>
                    }


                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any, props: any) => {
    console.log("UserList Component mapStateToProps", state, props);
    return {
        users: state.users,
        editing: state.editing
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        userSave: (user: IUser) => dispatch(userSave(user)),
        setFlashMessage: (message: string) => dispatch(flashMessageSet(message)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserList);