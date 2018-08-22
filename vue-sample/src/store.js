import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        profile: {
            name: '',
            email: '',
            allowPhone: true,
            phone: '',
            password: '',
            password2: ''
        },
        comboBoxValues: [
            { label: 'A', value: 'A', minValue: 10, maxValue: 100, step: 5 },
            { label: 'B', value: 'B', minValue: 10, maxValue: 100, step: 5 },
            { label: 'C', value: 'C', minValue: 10, maxValue: 100, step: 5 },
            { label: 'D', value: 'D', minValue: 10, maxValue: 150, step: 5 },
            { label: 'E', value: 'E', minValue: 10, maxValue: 150, step: 5 }
        ],
        flashMessage: '',
      },
      getters: {
        getComboBoxValue: state => value => {
            let vals = state.comboBoxValues.filter(f => f.value ===value);
            if (vals.length!=1) return null;
            return vals[0];
        },
        getFlashMessage: state => {
            return state.flashMessage;
        },
      },
      mutations: {
        updateProfile(state, profile) {
            console.log('update profile', profile);
            Object.assign(state.profile, profile);
        },
        updateListItem(state, {oldData, newData}) {
            console.log('updateListItem', oldData, newData);
            Object.assign(oldData, newData);
        },
        updateFlashMessage(state, message) {
            state.flashMessage = message;
        },
      },
      actions: {
            updateListItem({commit, state }, newData) {
                let oldData = state.comboBoxValues.find(cbv => cbv.value === newData.value);
                if (oldData) commit('updateListItem', {oldData, newData});
            },
            popLastFlashMessage({commit, state }) {
                let r = state.flashMessage;
                commit('updateFlashMessage', '');
                return r;
            },
            pushFlashMessage({commit }, message) {
                commit('updateFlashMessage', message);
            }
      },
});

export default store;