<template>
    <form class="row justify-content-center m-4">
        <div class="col-4" v-for="(c, c_idx) in $v.columns.$each.$iter" :key="c_idx">
            <div class="card">
                <div class="card-body" v-for="(s, s_idx) in c.selections.$each.$iter" :key="s_idx">
                    <div class="row">
                        <div class="col-3">
                            <select class="form-control" :value="s.selected.$model" @change="changeSelect(s, c_idx, s_idx, $event)">
                                <option :key="opt.value" v-for="opt in allowedSelections(comboBoxValues, c.$model.selections, s.selected.$model)" :value="opt.value">{{opt.label}}</option>
                            </select>
                        </div>
                        <div class="col-4">
                            <input type="text"  autocomplete="off" :class="{'is-invalid' : s.amount.$error, 'form-control': true}" :value="s.amount.$model" 
                                @input="inputAmount(s, c_idx, s_idx, $event)" 
                                @change="changeAmount(s, c_idx, s_idx, $event)" name="amount" placeholder="Enter amount"/>
                            <div v-if="s.amount.$error" class="invalid-feedback">{{messageFor(s.amount)}}</div>
                        </div>
                        <div class="col-3">
                            {{s.$model.price}} €
                        </div>
                        <div class="col-1">
                            <a href="#" @click="remove(c_idx, s_idx)"><i class="text-dark fa fa-trash-o"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-1 pb-3 pt-3">
                    <a href="#" @click="add(c_idx)"><i class="text-dark fa fa-plus"></i></a>
                </div>
            </div>
        </div>
    </form>                 
</template>

<script>
import Vue from 'vue';
import {allowedSelections} from '../helpers';
import { required, numeric, minValue, maxValue } from 'vuelidate/lib/validators'

export default Vue.extend({
  name: 'complex',
  data() { return {
    columns: [
        {
            selections: [
                { selected: 'B', amount: 10, price: null},
                { selected: 'D', amount: 20, price: null},
                { selected: 'E', amount: 30, price: null}
            ]
        }
        ,
        {
            selections: [{ selected: 'E', amount: 30, price: null}]
        },
        {
            selections: []
        },
    ],
  }},
  methods: {
      debug(v) { console.log("[debug] ", v);},
      changeSelect(selectModelData, c_idx, s_idx, evt) {
          selectModelData.$model.selected = evt.target.value; 
          this.updatePrice(c_idx, s_idx, selectModelData, 'selected')
      },
      changeAmount(selectModelData, c_idx, s_idx, evt) {
          console.log("evt", evt);
          selectModelData.amount.$model = evt.target.value; 
          this.updatePrice(c_idx, s_idx, selectModelData, 'selected')
      },
      inputAmount(selectModelData, c_idx, s_idx, evt) {
          console.log("evt", evt);
          selectModelData.amount.$model = evt.target.value; 
      },
      allowedSelections: allowedSelections,
      messageFor(v) {
          console.log("messageFor", v);
          if (!v.$error) return '-';
          else if (!v.required) return 'enter value';
          else if (!v.numeric) return 'must be a number';
          else if (!v.minValue) return 'must be at least 15';
          else if (!v.maxValue) return 'must be at most 150';
          return ''; 
      },
      updatePrice (columnIdx, selectionIdx, selectionModel, cause) {
          if (selectionModel.$invalid) {
              console.log("can't compute - error", cause);
                this.columns[columnIdx].selections[selectionIdx].price = '';  
          } else {
            console.log("start update price", cause)
            window.setTimeout(() => {
            console.log("finsish update price", cause)
                let price = (Math.random()*100+20).toFixed();
                this.columns[columnIdx].selections[selectionIdx].price = price;
            }, 1000);
          }
      },
      remove(columnIdx, selectionIdx) {
          this.columns[columnIdx].selections.splice(selectionIdx, 1);
      },
      add(columnIdx) {
          let newValue = allowedSelections(this.comboBoxValues, this.columns[columnIdx].selections, undefined);
          this.columns[columnIdx].selections.push({
              selected: newValue[0].value,
              amount: 10,
              price: null,
          });
      }
  },
  computed: {
    comboBoxValues() {
        return this.$store.state.comboBoxValues;
    }
  },
  validations: {
      columns: {
          $each: {
              selections: {
                $each:  {
                    selected: {
                        required
                    },
                    amount: {
                        required,
                        numeric,
                        minValue: minValue(15),
                        maxValue: maxValue(150)
                    }
                }
              }
          }
      }
  }
});
</script>
