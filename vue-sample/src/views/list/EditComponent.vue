<template>
    <div>
        <h5 class="card-title">
            <router-link :to="{ name: 'list.view', params: { value: value }}"><i class="text-dark fa fa-arrow-circle-left"></i></router-link> View item
        <!--
        <div class="ml-auto" style="float: right"><a href="#" @click.prevent="save"><i class="fa fa-check-circle"></i></a></div>
        -->
        </h5>

        <form>
            <div class="form-group">
                <label for="name">Value:</label>
                <input type="text" class="form-control" :value="value" name="name" disabled="disabled"/>
            </div>                        
            <div class="form-group">
                <label for="name">Label:</label>
                <input type="text" :class="{'is-invalid' : $v.label.$error, 'form-control': true}" v-model.lazy.trim="$v.label.$model" name="name" placeholder="Enter label"/>
                <div v-if="$v.label.$error" class="invalid-feedback">{{errorsLabel}}</div>
            </div>                        
            <div class="form-group">
                <label for="name">Minimum Value:</label>
                <input type="text" :class="{'is-invalid' : $v.minValue.$error, 'form-control': true}" v-model.lazy.trim="$v.minValue.$model" name="name" placeholder="Enter min value"/>
                <div v-if="$v.minValue.$error" class="invalid-feedback">{{errorsMinValue}}</div>
            </div>                        
            <div class="form-group">
                <label for="name">Maximum Value:</label>
                <input type="text" :class="{'is-invalid' : $v.maxValue.$error, 'form-control': true}" v-model.lazy.trim="$v.maxValue.$model" name="name" placeholder="Enter max value"/>
                <div v-if="$v.maxValue.$error" class="invalid-feedback">{{errorsMaxValue}}</div>
            </div>                        
            <div class="form-group">
                <label for="name">Step:</label>
                <input type="text" :class="{'is-invalid' : $v.step.$error, 'form-control': true}" v-model.lazy.trim="$v.step.$model" name="name" placeholder="Enter step"/>
                <div v-if="$v.step.$error" class="invalid-feedback">{{errorsStep}}</div>
            </div>                        
            <div class="mt-2">
                <button type="button" href="#" class="btn btn-primary" @click="save" :disabled="$v.$invalid">Save</button>
                <button type="button" href="#" class="ml-3 btn btn-secondary" @click="back">Cancel</button>
            </div>

        </form>
    </div>
</template>

<script>
import Vue from "vue";
import { required, minLength, minValue, maxValue, maxLength, numeric } from 'vuelidate/lib/validators'

let  smallerThanMax = function(value) {
    if (!value) return true;
    if (this.$v.maxValue.$error) return true;
    return Number(value) < Number(this.maxValue);
};
let buildErrorMessages = function(v, messages) {
    let r = [];
    for (let key in messages) {
        if (!v[key]) return messages[key];
    }
    return r;
}

export default Vue.extend({
  name: "list",
  created() {
    console.log("created");
    if (!this.valid) {
        this.$router.push({name: 'list'});
    }
  },
  data() {
    console.log("data");
    let value = this.$store.getters.getComboBoxValue(this.$route.params.value);
    if (!value) {
        return {
            label: '',
            value: '',
            minValue: '',
            maxValue: '',
            step: '',    
            valid: false
        };
    }
    return {...value, valid: true, dirty: false};
  },
  methods: {
      back() {
          console.log("BACK");
          this.$router.push({name: 'list.view', params: {value: this.value}});
      },
      save() {
          console.log("SAVE");
          this.$store.dispatch("updateListItem", {
              label: this.label,
              value: this.value,
              minValue: Number(this.minValue),
              maxValue: Number(this.maxValue),
              step: Number(this.step),
          });
          this.$store.dispatch('pushFlashMessage', 'update was successful');
          this.$router.push({name: 'list.view', params: {value: this.value,}});
      }
  },
  computed: {
      errorsLabel() {
          return buildErrorMessages(this.$v.label, {
              required: 'Must not be empty',
              minLength: 'Must be at least 1 character',
              maxLength: 'Must be at most 5 characters',
          });
      },
      errorsValue() {
          return buildErrorMessages(this.$v.value, {
              required: 'Must not be empty',
              minLength: 'Must be at least 1 character',
              maxLength: 'Must be at most 5 characters',
          });
      },
      errorsMinValue() {
          return buildErrorMessages(this.$v.minValue, {
            required: 'Must not be empty',
            numeric: 'Must be a number',
            minValue:  'Must be at least 10',
            maxValue:  'Must be at most 1000',
            smallerThanMax: 'Must be less than the maximum value',
          });
      },
      errorsMaxValue() {
          return buildErrorMessages(this.$v.maxValue, {
            required: 'Must not be empty',
            numeric: 'Must be a number',
            minValue:  'Must be at least 10',
            maxValue:  'Must be at most 1000',
          }).concat(
            this.$v.minValue.numeric && !this.$v.minValue.smallerThanMax ?
                 'Must be bigger than the minimum value' : []
          );
      },
      errorsStep() {
          return buildErrorMessages(this.$v.step, {
            required: 'Must not be empty',
            numeric: 'Must be a number',
            minValue:  'Must be at least 5',
            maxValue:  'Must be at most 100',
          })
      },
  },
  components: {},
  validations: {
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
        maxValue: maxValue(1000),
        smallerThanMax,

    },
    maxValue: {
        required,
        numeric,
        minValue: minValue(10),
        maxValue: maxValue(1000),
    },
    step: {
        required,
        numeric,
        minValue: minValue(5),
        maxValue: maxValue(100),
    },
  }
});
</script>
