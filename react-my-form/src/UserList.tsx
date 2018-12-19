import * as React from 'react';
import './App.css';
import {Formik, Field, FieldArray} from 'formik';
import {alwaysTrue, required, minLength, maxLength, pattern, email, composeValidators} from './validators';
import {EGeschlecht, IProfileData, IUser} from './types'
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
    setFlashMessage: typeof flashMessageSet
}

interface IState {
    users: IUser[],
    editing: string,
    message: string
}

class UserList extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            users: props.users,
            editing: '',
            message: ''
        };
        this.saveUser = this.saveUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any) {
        this.setState({message: event.target.value});
    }

    editUser(id: string) {
        console.log("editUser", id);
        this.setState({editing: id});
    }

    saveUser(user: IUser) {
        console.log("saveUser", user);
        this.props.userSave(user);
    }

    handleGeschlechtChange(event: any) {

    }

    render() {
        //let editing = this.state.editing;
        return (
            <div>
                <div className="row">
                    <div className="col-2">Name</div>
                    <div className="col-2">Vorname</div>
                    <div className="col-2">Aktiv</div>
                    <div className="col-2">{this.state.editing}</div>
                </div>
                {        //this.state =;
                    this.state.users.map((user: IUser) => {
                        return this.renderUser(user);
                    })
                }
                <div className="row">
                    <div className="col-10"></div>
                    <div className="col-2">

                        <button className="btn btn-primary">Neu</button>
                    </div>
                </div>

            </div>
        );

    }

    renderUser(user: IUser) {
        const isEdited = (this.state.editing === user.id);
        let handleChange = (event: any) => {
            console.log("handleChange", event);
            return true;
        };
        return (
            <div className="row" key={user.id}>
                <div className="col-2">
                    {
                        isEdited ?
                            <input name="user.name" type="text" value={user.name} onChange={handleChange}/>
                            :
                            <label>{user.name}</label>
                    }
                </div>
                <div className="col-2">
                    <label>{user.vorname}</label>
                </div>
                <div className="col-2">
                    <input
                        type="checkbox" checked={user.aktiv} onChange={this.handleChange}/>
                </div>
                <div className="col-2">
                    {
                        isEdited ?
                            <label>{user.geschlecht}</label>
                            //<select onChange={this.handleGeschlechtChange} value={user.geschlecht}></select>-->
                            :
                            <label>{user.geschlecht}</label>
                    }
                </div>
                <div className="col-2">{user.id}
                    {this.state.editing}
                    {this.state.editing === user.id}
                </div>
                <div className="col-2">
                    {
                        this.state.editing === user.id ?
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