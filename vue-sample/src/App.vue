<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand" tag="a" active-class="active" :to="{name:'home'}"><span @click.prevent="navigate('home')">Vue.js Sample</span></router-link>
            <ul class="navbar-nav mr-auto">
                <router-link class="nav-item" tag="li" active-class="active" to='/profile'><a class="nav-link"><span @click.prevent="navigate('profile')">Profile</span></a></router-link>
                <router-link class="nav-item" tag="li" active-class="active" to='/list'><a class="nav-link"><span @click.prevent="navigate('list')">List</span></a></router-link>
                <router-link class="nav-item" tag="li" active-class="active" to='/complex'><a class="nav-link"><span @click.prevent="navigate('complex')">Complex</span></a></router-link>
            </ul>
        </nav>
        <div class="container-fluid" :key="$store.state.forceNavigationKey">
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
  store,
  components: {
    // HelloWorld,
  },
  methods: {
      navigate(path) {
        console.log('navigate to', path);
        this.$router.push({name: path});
        this.$store.commit('forceNavigationKey');
      },
  },
});
</script>