<template>
    <div class="row justify-content-center m-4">
        <div class="col-8">
            <div v-if="message" class="alert alert-success" role="alert">
                 {{message}}
            </div>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Profile</h5>
                    <form>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" :class="{'is-invalid' : $v.profile.name.$error, 'form-control': true}" v-model.lazy.trim="$v.profile.name.$model" name="name" placeholder="Enter name" :disabled="readonly"/>
                            <div v-if="$v.profile.name.$error" class="invalid-feedback">Please enter a name with 4 to 13 characters</div>
                        </div>                        
                        <div class="form-group">
                            <label for="email">E-mail</label>
                            <input type="text" :class="{'is-invalid' : $v.profile.email.$error, 'form-control': true}" v-model.lazy.trim="$v.profile.email.$model" name="email" placeholder="Enter e-mail" :disabled="readonly"/>
                            <div v-if="$v.profile.email.$error" class="invalid-feedback">Please enter a valid e-mail address</div>
                        </div>                               
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" v-model="$v.profile.allowPhone.$model" id="allowPhone" :disabled="readonly">
                            <label class="form-check-label" for="allowPhone">
                                Allow phone calls
                            </label>
                        </div>             
                        <div class="form-group">
                            <label for="phone">Phone number</label>
                            <input type="text" :class="{'is-invalid' : $v.profile.phone.$error, 'form-control': true}" v-model.lazy.trim="$v.profile.phone.$model" name="phone" placeholder="Enter phone number" :disabled="readonly || !profile.allowPhone"/>
                            <div v-if="$v.profile.phone.$error" class="invalid-feedback">Please enter a valid phone number</div>
                        </div>                               
                    </form>
                    <div>
                        name:{{profile.name}} mail:{{profile.email}} phone:{{profile.phone}}
                    </div>
                    <div class="mt-2">
                        <button type="button" href="#" class="btn btn-primary" @click="save" :disabled="$v.$invalid">Save</button>
                        <button type="button" href="#" class="ml-3 btn btn-secondary" @click="cancel">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>     
</template>

<script>
import Vue from 'vue';
// import { mapGetters, mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

let  phoneOk = function(value) {
        if (!this.profile.allowPhone) return true;
        return minLength(3)(value) && maxLength(14)(value);
    };

export default Vue.extend({
  name: 'profile',
  data() {
        return {
            profile: cloneDeep(this.$store.state.profile),
            valid: true,
            message: '',
            readonly: false,
        };
  },
  validations: {
    profile: {
        name: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(13),
        },
        email: {
            required,
            email
        },
        allowPhone: {},
        phone: {
            phoneOk: phoneOk,
        },
    },
  },
  methods: {      
      cancel() {
          this.$router.push({name: 'home'});
      },
      save() {
          this.$store.commit('updateProfile', this.profile);
          this.message = 'Profile updated';
          this.readonly = true;
      },
  },
});
</script>