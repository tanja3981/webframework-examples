<template>
    <div>
        <h5 class="card-title">
            <router-link :to="{ name: 'list.view', params: { value: item.value }}"><i class="text-dark fa fa-arrow-circle-left"></i></router-link> View item
        </h5>

        <form>
            <div class="form-group">
                <label for="name">Value:</label>
                <input type="text" class="form-control" :value="item.value" name="item.name" disabled="disabled"/>
            </div>
            <div class="form-group">
                <label for="name">Label:</label>
                <input type="text" :class="{'is-invalid': $v.item.label.$error, 'form-control': true}" v-model.lazy.trim="$v.item.label.$model" name="name" placeholder="Enter label"/>
                <div v-if="!$v.item.label.required" class="invalid-feedback">{{errorsLabel}}</div>
            </div>
            <div class="form-group">
                <label for="name">Minimum Value:</label>
                <input type="text" :class="{'is-invalid': $v.item.minValue.$error, 'form-control': true}" v-model.lazy.trim="$v.item.minValue.$model" name="name" placeholder="Enter min value"/>
                <div v-if="$v.item.minValue.$error" class="invalid-feedback">{{errorsMinValue}}</div>
            </div>
            <div class="form-group">
                <label for="name">Maximum Value:</label>
                <input type="text" :class="{'is-invalid': $v.item.maxValue.$error||$v.item.minSmallerThanMax.$error, 'form-control': true}" v-model.lazy.trim="$v.item.maxValue.$model" name="name" placeholder="Enter max value"/>
                <div v-if="$v.item.maxValue.$error" class="invalid-feedback">{{errorsMaxValue}}</div>
                <div v-if="$v.item.minSmallerThanMax.$error" class="invalid-feedback">Must be bigger than the minimum value</div>
            </div>
            <div class="form-group">
                <label for="name">Step:</label>
                <input type="text" :class="{'is-invalid': $v.item.step.$error, 'form-control': true}" v-model.lazy.trim="$v.item.step.$model" name="name" placeholder="Enter step"/>
                <div v-if="$v.item.step.$error" class="invalid-feedback">{{errorsStep}}</div>
            </div>
            <div class="mt-2">
                <button type="button" href="#" class="btn btn-primary" @click="save" :disabled="$v.item.$invalid">Save</button>
                <button type="button" href="#" class="ml-3 btn btn-secondary" @click="back">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
import Vue from "vue";
import { required, minLength, minValue, maxValue, maxLength, numeric } from 'vuelidate/lib/validators';
import {beforeEnterListItem, beforeUpdateListItem} from './routeEvents';

let  minSmallerThanMax = function() {
    if (this.$v.item.minValue.$error) return true;
    if (this.$v.item.maxValue.$error) return true;
    if (Number(this.item.maxValue) < Number(this.item.minValue)) return false;
    return true;
};

let buildErrorMessages = function(v, messages) {
    let r = '';
    for (let key in messages) {
        if (!v[key]) return messages[key];
    }
    return r;
}

export default Vue.extend({
    name: "listedit",
    data() {
        console.log("data called", this);
        return {item: {
            label: '-',
            value: '-',
            minValue: 0,
            maxValue: 0,
            step: 0
        }};
    },
    beforeRouteEnter (to, from, next) {
        console.log("beforeRouteEnter", this);
        beforeEnterListItem(to, from, next);
    },
    beforeRouteUpdate (to, from, next) {
        console.log("beforeRouteUpdate", this);
        beforeUpdateListItem(this, to, from, next);
    },
    methods: {
        back() {
            this.$router.push({name: 'list.view', params: {value: this.item.value}});
        },
        save() {
            this.$store.dispatch("updateListItem", {
                label: this.item.label,
                value: this.item.value,
                minValue: Number(this.item.minValue),
                maxValue: Number(this.item.maxValue),
                step: Number(this.item.step),
            });
            this.$store.dispatch('pushFlashMessage', 'update was successful');
            this.$router.push({name: 'list.view', params: {value: this.item.value,}});
        }
    },
    watch: {
        'item.minValue': function() {
            this.$v.item.minSmallerThanMax.$touch()
        },
        'item.maxValue': function() {
            this.$v.item.minSmallerThanMax.$touch()
        }
    },
    computed: {
        errorsLabel() {
            return buildErrorMessages(this.$v.item.label, {
                required: 'Must not be empty',
                minLength: 'Must be at least 1 character',
                maxLength: 'Must be at most 5 characters',
            });
        },
        errorsValue() {
            return buildErrorMessages(this.$v.item.value, {
                required: 'Must not be empty',
                minLength: 'Must be at least 1 character',
                maxLength: 'Must be at most 5 characters',
            });
        },
        errorsMinValue() {
            return buildErrorMessages(this.$v.item.minValue, {
                required: 'Must not be empty',
                numeric: 'Must be a number',
                minValue:  'Must be at least 10',
                maxValue:  'Must be at most 1000',
                smallerThanMax: 'Must be less than the maximum value',
            });
        },
        errorsMaxValue() {
            return buildErrorMessages(this.$v.item.maxValue, {
                required: 'Must not be empty',
                numeric: 'Must be a number',
                minValue:  'Must be at least 10',
                maxValue:  'Must be at most 1000',
            });
        },
        errorsStep() {
            return buildErrorMessages(this.$v.item.step, {
                required: 'Must not be empty',
                numeric: 'Must be a number',
                minValue:  'Must be at least 5',
                maxValue:  'Must be at most 100',
            })
        },
    },
    validations: {
        item: {
            label: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(5),
            },
            value: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(5),
            },
            minValue: {
                required,
                numeric,
                minValue: minValue(10),
                maxValue: maxValue(1000)
            },
            maxValue: {
                required,
                numeric,
                minValue: minValue(10),
                maxValue: maxValue(1000),
            },
            minSmallerThanMax: {
                minSmallerThanMax
            },
            step: {
                required,
                numeric,
                minValue: minValue(5),
                maxValue: maxValue(100),
            }
        }
    }
});
</script>
