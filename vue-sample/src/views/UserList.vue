<template>
    <div class="row justify-content-center m-4">
        <div>Edited: {{$v.editItem.$model}}</div>
        <table>
            <thead>
            <tr>
                <td>Name</td>
                <td>Vorname</td>
                <td>Aktiv</td>
                <td>Geschlecht</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(user,index) in $v.users.$each.$iter" :key="index">
                <td>
                    <label v-if="$v.editItem !== user.id" >{{user.name.$model}}</label>
                    <input v-if="$v.editItem === user.id" :value="user.name.$model"/>
                </td>
                <td>{{user.vorname.$model}}</td>
                <td><input type="checkbox" :checked="user.aktiv.$model" :disable="editItem !== user.id.$model"/>
                    {{$v.editItem !== user.id.$model}}
                </td>
                <td>
                    {{user.geschlecht.$model}}</td>
                <td>
                    <button class="btn btn-primary" v-if="editItem !== user.id.$model"
                            v-on:click="edit(user.id.$model)">Bearbeiten</button>
                    <button class="btn btn-primary" v-if="editItem === user.id.$model"
                            v-on:click="cancel(user.id.$model)">Abbrechen</button>
                    <button class="btn btn-primary" v-if="editItem === user.id.$model"
                            v-on:click="save(index, user.$model)">Speichern</button>
                </td>
                <td v-if="$v.editItem === user.id.$model">wird gerade editiert</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
  import Vue from 'vue';
  import cloneDeep from 'lodash/cloneDeep';

  export default Vue.extend({
    name: "UserList",
    data() {
      return {
        users: cloneDeep(this.$store.state.users),
        valid: true,
        message: '',
        editItem: ''
      }
    },
    validations: {
      editItem: {},
        users: {
          $each: {
            name: {},
            vorname: {},
            geschlecht: {},
            aktiv: {},
            id: {}
          }
        }
    },
    methods: {
      edit: function (id) {
        console.log("edit ", id);
        this.editItem = id;
      },
      cancel: function(id) {
        console.log("cancel", id);
        this.editItem = '';
      },
      save: function(index, user) {
        console.log("save", index, user);
        this.$store.commit('updateUser', index, user);
        this.editItem = '';
      }
    }
  })
</script>

<style scoped>

</style>
