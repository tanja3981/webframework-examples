import * as React from 'react';
import {required, numeric, min, max, composeValidators, alwaysTrue} from './validators';
import {ISelectionData, IColumnSelection, IComboBoxValue} from './types';
import { connect } from 'react-redux';
import FormModel, {ComponentProps, ComponentState, TPropsForComponent} from './formModelReact';
import { FormControlMap, FormControlValue, FormControlArray } from './formModel';

export function allowedSelections(comboBoxValues: IComboBoxValue[], columnSelections: IColumnSelection[], selected: string|undefined) {
    let forbidden = columnSelections.map(s => s.selected).filter(v => v !== selected);
    return comboBoxValues.filter(cbv => !forbidden.find(v => v===cbv.value));
}

export function updatePrice(selectionModel: ReturnType<typeof forSelection>) {
    console.log("updatePrice", selectionModel);
    if (selectionModel.invalid) {
        console.log("ignore updatePrice due to error");
    } else {
        window.setTimeout(() => {
            selectionModel.children.price.value = Number(selectionModel.children.amount.value ) * 5;
        }, 1000);
    }
}

const amountValidator = composeValidators(required('Please enter amount'), numeric('must be a number'), min(5)('Must be at least 5'), max(100)('Must be less than 100'));

interface IProps {
    comboBoxValues: IComboBoxValue[];
    complex: ISelectionData[];
}

let forSelection = (selection: IColumnSelection) => {
    console.log('*forSelection', selection);
    return new FormControlMap({
    selected: new FormControlValue<string>({value: selection.selected}),
    amount: new FormControlValue<string>({value: selection.amount}),
    price: new FormControlValue<number|null>({value: null})
})};

let forSelectionsInColumn = (selections: IColumnSelection[]) => {
    console.log("*forSelectionsInColumn", selections);
    return new FormControlArray(forSelection, {values: selections});
}

let forColumn = (selectionData: ISelectionData) => {
    return new FormControlMap({
        selections: forSelectionsInColumn(selectionData.selections)
    })
}


const SingleSelection = ({selection, propsForComponent, comboBoxValues, remove, selectionsInColumn} :
    {selection: ReturnType<typeof forSelection>,
        propsForComponent: TPropsForComponent,
        comboBoxValues: IComboBoxValue[],
        remove: (evt: React.SyntheticEvent) =>void,
        selectionsInColumn: IColumnSelection[]
    }) => (
        <div className="card-body">
            <div className="row">
            <div className="col-3">
                <select className="form-control" {...propsForComponent(selection.children.selected)}
                    onChange={(evt) => {propsForComponent(selection.children.selected).onChange(evt); updatePrice(selection);}}
                    onBlur={(evt) => propsForComponent(selection.children.selected).onBlur(evt)}
                    value={propsForComponent(selection.children.selected).value}
                >
                {
                    allowedSelections(comboBoxValues, selectionsInColumn, selection.children.selected.value).map(opt =>
                    (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))
                }
                </select>
            </div>
            <div className="col-4">
                <input type="text"  autoComplete="off" className={selection.children.amount.invalid ? 'is-invalid form-control' : 'form-control'}
                    {...propsForComponent(selection.children.amount)}
                    onBlur={(evt) => {propsForComponent(selection.children.amount).onBlur(evt); updatePrice(selection);}}
                    placeholder="Enter amount"/>
                {selection.children.amount.invalid && <div className="invalid-feedback">{selection.children.amount.message}</div>}
            </div>
            <div className="col-3">
                {selection.children.price.value} €
            </div>
            <div className="col-1">
                <a href="#" onClick={remove}><i className="text-dark fa fa-trash-o"/></a>
            </div>
        </div>
    </div>)

const Column = ({formModel, propsForComponent, comboBoxValues} :
    {formModel: ReturnType<typeof forColumn>,
        propsForComponent: TPropsForComponent,
        comboBoxValues: IComboBoxValue[],
    }) => (<div className="col-4">
            <div className="card">
            {formModel.children.selections.children.map((formControlMap, idx) => {
                return <SingleSelection key={idx}
                        comboBoxValues={comboBoxValues}
                        propsForComponent = {propsForComponent}
                        selectionsInColumn = {formModel.children.selections.value}
                        remove = {(evt) => {evt.preventDefault(); formModel.children.selections.remove(idx)}}
                        selection = {formControlMap}
                    />
            }
            )}
            { formModel.children.selections.children.length < comboBoxValues.length ?
                (<div className="col-1 pb-3 pt-3">
                    <a href="#" onClick={(evt) =>
                        {   evt.preventDefault();
                            formModel.children.selections.add(
                           {selected: allowedSelections(comboBoxValues, formModel.children.selections.value, undefined)[0].value,
                            amount: '15',
                            price: null})}
                    }><i className="text-dark fa fa-plus"/></a>
                </div>) : null
            }
        </div>
    </div>);

function createFormModel(complex: ISelectionData[]) {
    return new FormControlArray((sel:ISelectionData) => forColumn(sel),
        {values: complex}
    );
}

class Complex extends React.Component<IProps, {}> {
    private formModel : ReturnType<typeof createFormModel>;

    constructor(props: IProps) {
        super(props);
        this.formModel = createFormModel(this.props.complex);
    }

    render() {
        let comboBoxValues = this.props.comboBoxValues;
        let formModel = this.formModel;

        return (<div>
            <FormModel
                formModel = { formModel }
                render = { (props) => {
                    {/*console.log("render form ", props);*/}
                    return (<div className="row justify-content-center m-4">
                        {props.formModel.children.map((col, idx) => (
                        <Column
                            formModel = {col}
                            comboBoxValues = {comboBoxValues}
                            propsForComponent = {props.propsForComponent}
                            key={idx}/>
                        ))}
                    </div>
                )}}
            />
            </div>);
    }
}

const mapStateToProps = (state: any, props: any) => {
    console.log("Detail Component mapStateToProps", state, props);
    return {
        comboBoxValues: state.comboBoxValues,
        complex: state.complex,
    }
}

export default connect(mapStateToProps)(Complex);
