<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand" tag="a" active-class="active" :to="{name:'home'}">Vue.js Sample</router-link>
            <ul class="navbar-nav mr-auto">
                <router-link class="nav-item" tag="li" active-class="active" to='/profile'><a class="nav-link">Profile</a></router-link>
                <router-link class="nav-item" tag="li" active-class="active" to='/list'><a class="nav-link">List</a></router-link>
                <router-link class="nav-item" tag="li" active-class="active" to='/complex'><a class="nav-link">Complex</a></router-link>
            </ul>
        </nav>
        <div class="container-fluid">
            <router-view/>
        </div>
    </div>
</template>

<style>
</style>

<script>
import Vue from 'vue';
import store from './store';

export default Vue.extend({
  name: 'app',
  store
});
</script>