import { expect } from 'chai'
import {allowedSelections} from '@/helpers';

describe('helpers', () => {
  it('allowedComboboxes works', () => {
    let selections = [
        { selected: 'B', amount: 10, price: null},
        { selected: 'D', amount: 20, price: null},
        { selected: 'E', amount: 30, price: null}
    ];
    let comboBoxValues = [
        { label: 'A', value: 'A', minValue: 10, maxValue: 100, step: 5 },
        { label: 'B', value: 'B', minValue: 10, maxValue: 100, step: 5 },
        { label: 'C', value: 'C', minValue: 10, maxValue: 100, step: 5 },
        { label: 'D', value: 'D', minValue: 10, maxValue: 150, step: 5 },
        { label: 'E', value: 'E', minValue: 10, maxValue: 150, step: 5 }
    ];

    let allowed = allowedSelections(comboBoxValues, selections, selections[2].selected);
    expect(allowed.length).to.equal(3);
    expect(allowed[0].value).to.equal('A');
    expect(allowed[1].value).to.equal('C');
    expect(allowed[2].value).to.equal('E');
  })
})
