import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ListView from './views/list/ListView.vue';
import ListComponent from './views/list/ListComponent.vue';
import DetailComponent from './views/list/DetailComponent.vue';
import EditComponent from './views/list/EditComponent.vue';
import Profile from './views/Profile.vue';
import Complex from './views/Complex.vue';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/list',
            component: ListView,
            children: [
                {
                    path: '',
                    name: 'list',
                    component: ListComponent
                },
                {
                    path: ':value/view',
                    name: 'list.view',
                    component: DetailComponent,
                },
                {
                    path: ':value/edit',
                    name: 'list.edit',
                    component: EditComponent,
                },
            ]},
            {
                path: '/profile',
                name: 'profile',
                component: Profile,
            },
            {
                path: '/complex',
                name: 'complex',
                component: Complex,
            },
        ],
    });

export default router;
