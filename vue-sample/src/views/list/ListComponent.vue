<template>
    <div>
        <h5 class="card-title">Search list of combobox entries</h5>
        <div class="list-group">
            <router-link :to="{ name: 'list.view', params: { value: item.value }}" class="list-group-item list-group-item-action flex-column align-items-start" v-for="(item, index) in comboBoxValues" :key="item.value">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ item.label }}</h5>
                    <small>{{ index+1 }}</small>
                </div>
                <small class="text-muted">Label: {{item.label}}, value: {{item.value}}, minValue: {{item.minValue}}, maxValue: {{item.maxValue}}, step: {{item.step}}</small>
            </router-link>    
        </div>
    </div>
</template>

<script>
import Vue from "vue";
import { mapState } from 'vuex';

export default Vue.extend({
  name: "list",
  computed: {
      ...mapState(['comboBoxValues'])
  }

});
</script>
