import {TTypeFromIFormControlState, TTypeStructureFromControlStateMap, updateAllControlState, FormControlValue, FormControlMap, FormControlArray, IFormControlState, TFormControlMap} from './formModel';
import {IValidator, required, numeric, min, max, composeValidators, minLength, alwaysTrue} from './validators';

type TCheck<V, T> = V extends T ? T extends V ? true : never : never;

describe("For a formModel ", function() {

    let value;

    beforeEach(() => {
    });

    it("set value updates the state for a ControlValue", function() {
        let f = new FormControlValue(minLength(2)('must be at least 2 chars'));
        f.value = 'abc';
        f.value = 'defg';
        expect(f.dirty).toBe(true);
        expect(f.touched).toBe(false);
        expect(f.invalid).toBe(false);

        f.value = '1';
        expect(f.dirty).toBe(true);
        expect(f.touched).toBe(false);
        expect(f.invalid).toBe(true);

        f.value = '12';
        expect(f.dirty).toBe(true);
        expect(f.touched).toBe(false);
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
        expect(name.touched).toBe(false);
        expect(name.invalid).toBe(false);

        expect(map.dirty).toBe(true);
        expect(map.touched).toBe(false);
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
        expect(name.touched).toBe(false);
        expect(name.invalid).toBe(false);

        expect(map.dirty).toBe(true);
        expect(map.touched).toBe(false);
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
        expect(name.touched).toBe(false);
        expect(name.invalid).toBe(false);

        expect(array.dirty).toBe(true);
        expect(array.touched).toBe(false);
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

    it('type inference works works for literal object of FormControls', function() {
        interface IData {
            string: string;
            number: number;
            nested: {
                boolean: boolean;
            }
        }

        interface INested {
            boolean: boolean;
        };


        const initalValue : IData = {
            string: 'abc',
            number: 123,
            nested: {
                boolean: true
            }
        };

        let map = {
            string: new FormControlValue<string>(alwaysTrue),
            number: new FormControlValue<number>(alwaysTrue),
            nested: new FormControlMap({
                    boolean: new FormControlValue<boolean>(alwaysTrue)
            })
        };


        type Tmap = typeof map;
        type TmapValue = TTypeFromIFormControlState<Tmap>;
        let data : TmapValue = initalValue;

        type tt1 =  TFormControlMap<Tmap>;
        let controlMap : TFormControlMap<Tmap> = map;


        let formControlMap = new FormControlMap(map);

        type Tvalue = typeof formControlMap.value;

        let assrt: boolean;

        let str = formControlMap.value.string;
        let assertStr: TCheck<string, typeof str> = true;
        let num = formControlMap.value.number;
        let assert_num: TCheck<number, typeof num> = true;
        let nested: INested = formControlMap.value.nested;
        let assert_nested: TCheck<INested, typeof nested> = true;
    });

    it('type inference works works for FormControlValue', function() {
        let name: FormControlValue<string> = new FormControlValue(alwaysTrue, 'abc');
        let check: FormControlValue<boolean> = new FormControlValue(alwaysTrue, true);

        type typeName = TTypeFromIFormControlState<FormControlValue<string>>;
        let assert_typeName: TCheck<typeName, string> = true;
        type typeCheck = TTypeFromIFormControlState<FormControlValue<boolean>>;
        let assert_typeCheck: TCheck<typeCheck, boolean> = true;

        let verifyNameIsString : typeName = 'string';
        let verifyCheckIsBooelan : typeCheck = true;

        let valueName : string = name.value;
        expect(typeof valueName).toBe('string');

        let valueBoolean : boolean = check.value;
        expect(typeof valueBoolean).toBe('boolean');
    })

    it('type inference works works for primitive FormControlArray', function() {
        let nameArray = new FormControlArray((val:string) => new FormControlValue<string>(alwaysTrue));
        let checkArray = new FormControlArray(() => new FormControlValue<boolean>(alwaysTrue, true));

        let nameArrayValues = nameArray.value;
        let assert_nameArrayValues: TCheck<typeof nameArrayValues, string[]> = true;

        let checkArrayValue = checkArray.value;
        let assert_checkArrayValue: TCheck<typeof checkArrayValue, boolean[]> = true;
    })

    it('type inference works works for nested FormControlArray', function() {
        let fn = (val:string) => new  FormControlMap({
            name: new FormControlValue<string>(alwaysTrue, 'abc')
        });
        let nameArray = new FormControlArray(fn, alwaysTrue, ['abc']);

        let values = nameArray.value;
        let assert_values: TCheck<typeof values, Array<{name: string}>> = true;

        let name = values[0].name;
        let assert_name: TCheck<typeof name, string> = true;
    })
});