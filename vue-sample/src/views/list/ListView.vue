<template>
    <div class="row justify-content-center m-4">
        <div class="col-8">
            <div class="card">
                <div class="card-body">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  name: "list",
  components: {},
  computed: {
  }

});
</script>
