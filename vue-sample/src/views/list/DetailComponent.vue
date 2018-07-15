<template>
    <div>
        <h5 class="card-title"><router-link :to="{ name: 'list'}"><i class="text-dark fa fa-arrow-circle-left"></i></router-link> View item
        <div class="ml-auto" style="float: right"><router-link :to="{ name: 'list.edit', params: { value: value }}"><i class="text-dark fa fa-edit"></i></router-link></div>
        </h5>

            <div v-if="message" class="alert alert-success" role="alert">
                 {{message}}
            </div>

        <form>
            <div class="form-group">
                <label for="name">Label:</label>{{label}}
            </div>                        
            <div class="form-group">
                <label for="name">Value:</label>
                {{value}}
            </div>                        
            <div class="form-group">
                <label for="name">Minimum Value:</label>
                {{minValue}}
            </div>                        
            <div class="form-group">
                <label for="name">Maximum Value:</label>
                {{maxValue}}
            </div>                        
            <div class="form-group">
                <label for="name">Step:</label>
                {{step}}
            </div>                        
        </form>
    </div>

</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "list",
  created() {
    console.log("created");
    if (!this.valid) {
        this.$router.push({name: 'list'});
    }
    this.message = this.$store.getters.getFlashMessage;
    this.$store.dispatch('popLastFlashMessage');
  },
  data() {
    console.log("data", this.message);
    let value = this.$store.getters.getComboBoxValue(this.$route.params.value);
    if (!value) {
        return {
            label: '',
            value: '',
            minValue: '',
            maxValue: '',
            step: '',    
            valid: false,
        };
    }
    return {...value, message:'hello', valid: true};
  },
  methods: {
      edit() {
          console.log("edit");
          this.$router.push({name: 'list.edit', params:{value: this.value}});
      },
      back() {
          console.log("BACK");
          this.$router.push({name: 'list'});
      }
  },
  components: {},
});
</script>
