import store from '../../store';

export let beforeEnterListItem = (to, from, next) => {
    let item = store.getters.getComboBoxValue(to.params.value);
    if (item) {
        next(vm => vm.item = item);
    } else {
        next('/list');
    }
};

export let beforeUpdateListItem = (vm, to, from, next) => {
    let item = store.getters.getComboBoxValue(to.params.value);
    if (item) {
        vm.item = item;
        next();
    } else {
        next('/list');
    }
};