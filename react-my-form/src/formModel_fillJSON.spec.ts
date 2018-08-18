import {updateAllControlState, FormControlValue, FormControlMap, FormControlArray, fillFromJSON} from './formModel';
import {IValidator, required, numeric, min, max, composeValidators, minLength, maxLength, email} from './validators';

describe("For a formModel ", function() {

    let value;

    beforeEach(() => {
    });

    it("set value updates the state for a ControlValue", function() {
        const initialValue = {
            name: 'abc',
            email: 'ade@ads.de',
            array: [
                {key: '1', value: 'v1'},
                {key: '2', value: 'v2'},
                {key: '3', value: 'v3'}
            ]
        };

        let formControl = new FormControlMap({
            name: new FormControlValue(composeValidators(required('must specify a name'), minLength(3)('must a 3 chars'), maxLength(10)('max 10 chars'))),
            email: new FormControlValue(composeValidators(required('must specify a name'), email('must a valid email'))),
            array: new FormControlArray(
                () => new FormControlMap({
                    key: new FormControlValue<string>(composeValidators(required('must specify a key'), numeric('key must be numeric'))),
                    value: new FormControlValue<string>(composeValidators(required('must specify a name'), email('must a valid email')))
                })
            )
        })
        fillFromJSON(formControl, initialValue);

        let m2 = new FormControlMap({
            key: new FormControlValue<string>(composeValidators(required('must specify a key'), numeric('key must be numeric'))),
            value: new FormControlValue<string>(composeValidators(required('must specify a name'), email('must a valid email')))
        });

        let v2 = new FormControlArray(() => new FormControlMap({
            key: new FormControlValue<string>(composeValidators(required('must specify a key'), numeric('key must be numeric'))),
            value: new FormControlValue<string>(composeValidators(required('must specify a name'), email('must a valid email')))
        }));
        let v22= v2.value;

        let value = formControl.value;
        expect(JSON.stringify(value)).toBe(JSON.stringify(initialValue));
    });


});