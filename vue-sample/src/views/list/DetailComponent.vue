<template>
    <div>
        <h5 class="card-title"><router-link :to="{ name: 'list'}"><i class="text-dark fa fa-arrow-circle-left"></i></router-link> View item
        <div class="ml-auto" style="float: right"><router-link :to="{ name: 'list.edit', params: { value: item.value }}"><i class="text-dark fa fa-edit"></i></router-link></div>
        </h5>

            <div v-if="message" class="alert alert-success" role="alert">
                 {{message}}
            </div>

        <form>
            <div class="form-group">
                <label for="name">Label:</label>{{item.label}}
            </div>
            <div class="form-group">
                <label for="name">Value:</label>
                {{item.value}}
            </div>
            <div class="form-group">
                <label for="name">Minimum Value:</label>
                {{item.minValue}}
            </div>
            <div class="form-group">
                <label for="name">Maximum Value:</label>
                {{item.maxValue}}
            </div>
            <div class="form-group">
                <label for="name">Step:</label>
                {{item.step}}
            </div>
        </form>
    </div>

</template>

<script>
import Vue from "vue";
import {beforeEnterListItem, beforeUpdateListItem} from './routeEvents';

export default Vue.extend({
    name: "listdetails",
    created() {
        this.message = this.$store.getters.getFlashMessage;
        this.$store.dispatch('popLastFlashMessage');
    },
    data() {
        console.log("data");
        return {
            item: {
                label: '-',
                value: '-',
                minValue: 0,
                maxValue: 0,
                step: 0
            },
            message: ''
        };
    },
    beforeRouteEnter (to, from, next) {
        beforeEnterListItem(to, from, next);
    },
    beforeRouteUpdate (to, from, next) {
        beforeUpdateListItem(this, to, from, next);
    },
    methods: {
        edit() {
            this.$router.push({name: 'list.edit', params:{value: this.item.value}});
        },
        back() {
            this.$router.push({name: 'list'});
        }
    }
});
</script>
