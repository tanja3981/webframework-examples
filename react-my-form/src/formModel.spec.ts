import {updateAllControlState, FormControlValue, FormControlMap, FormControlArray} from './formModel';
import {IValidator, required, numeric, min, max, composeValidators, minLength, alwaysTrue} from './validators';

describe("For a formModel ", function() {

    let value;

    beforeEach(() => {
    });

    it("set value updates the state for a ControlValue", function() {
        let f = new FormControlValue(minLength(2)('must be at least 2 chars'));
        f.value = 'abc';
        f.value = 'defg';
        expect(f.dirty).toBe(true);
        expect(f.touched).toBe(true);
        expect(f.invalid).toBe(false);

        f.value = '1';
        expect(f.dirty).toBe(true);
        expect(f.touched).toBe(true);
        expect(f.invalid).toBe(true);

        f.value = '12';
        expect(f.dirty).toBe(true);
        expect(f.touched).toBe(true);
        expect(f.invalid).toBe(false);
    });

    it("set value updates the state for its parent map", function() {
        let map = new FormControlMap({
            name: new FormControlValue(required('name must be specified')),
        });

        let name = map.children.name;
        updateAllControlState(map);

        expect(name.dirty).toBe(false);
        expect(name.touched).toBe(false);
        expect(name.invalid).toBe(true);

        expect(map.dirty).toBe(false);
        expect(map.touched).toBe(false);
        expect(map.invalid).toBe(true);

        name.value = 'abc';

        expect(name.dirty).toBe(true);
        expect(name.touched).toBe(true);
        expect(name.invalid).toBe(false);

        expect(map.dirty).toBe(true);
        expect(map.touched).toBe(true);
        expect(map.invalid).toBe(false);
    });

    it("set value updates the state for its parent map with children validation", function() {
        let validator : IValidator<{name: string}> =
            (map: any) => {
                let val = map.name;
                return val == 'evil' ?  'is evil' : undefined;
            };
        let map = new FormControlMap({
            name: new FormControlValue(required('name must be specified')),
        }, validator);

        let name = map.children.name;
        name.value = 'evil';

        expect(name.dirty).toBe(true);
        expect(name.touched).toBe(true);
        expect(name.invalid).toBe(false);

        expect(map.dirty).toBe(true);
        expect(map.touched).toBe(true);
        expect(map.invalid).toBe(true);
    });

    it("set value updates the state for its parent array", function() {
        let array = new FormControlArray(() => new FormControlValue(required('name must be specified')), alwaysTrue, ['']);
        let name = array.getChildren()[0];
        updateAllControlState(array);

        expect(name.dirty).toBe(false);
        expect(name.touched).toBe(false);
        expect(name.invalid).toBe(true);

        expect(array.dirty).toBe(false);
        expect(array.touched).toBe(false);
        expect(array.invalid).toBe(true);

        name.value = 'abc';

        expect(name.dirty).toBe(true);
        expect(name.touched).toBe(true);
        expect(name.invalid).toBe(false);

        expect(array.dirty).toBe(true);
        expect(array.touched).toBe(true);
        expect(array.invalid).toBe(false);
    });

    it("set value updates the state for its parent array with children validation", function() {
        let validator : IValidator<string[]> =
            (array: Array<string>) => {
                console.log('validate', array.length);
                return array.length < 2 ?  'too small' : undefined;
            };
        let array = new FormControlArray((initialValue) => new FormControlValue<string>(required('name must be specified'), initialValue), validator);

        let name1 = array.add('abc');
        updateAllControlState(array);

        expect(name1.dirty).toBe(false);
        expect(name1.touched).toBe(false);
        expect(name1.invalid).toBe(false);

        expect(array.dirty).toBe(false);
        expect(array.touched).toBe(false);
        expect(array.invalid).toBe(true);

        let name2 = array.add('abc');

        expect(name2.dirty).toBe(false);
        expect(name2.touched).toBe(false);
        expect(name2.invalid).toBe(false);

        expect(array.dirty).toBe(false);
        expect(array.touched).toBe(false);
        expect(array.invalid).toBe(false);

        array.remove(0);

        expect(name1.dirty).toBe(false);
        expect(name1.touched).toBe(false);
        expect(name1.invalid).toBe(false);

        expect(array.dirty).toBe(false);
        expect(array.touched).toBe(false);
        expect(array.invalid).toBe(true);
    });

});