export function allowedSelections(comboBoxValues, columnSelections, selected) {
    let forbidden = columnSelections.map(s => s.selected).filter(v => v!=selected);
    return comboBoxValues.filter(cbv => !forbidden.find(v => v===cbv.value));
}
