<template>
  <div class="pagination d-flex align-center mt-2 mt-md-0">
    <v-row>
      <v-col class="py-0 d-flex align-center text-no-wrap">
        <div class="hidden-xs-only">
          <span>show</span>
          <v-menu class="menu-select">
            <template v-slot:activator="{on}">
              <v-btn v-on="on" depressed small rounded class="mx-2">{{size}} <v-icon small>mdi-chevron-down</v-icon></v-btn>
            </template>

            <v-list class="menu-items">
              <v-list-item dense @click="updateSize(10)">10</v-list-item>
              <v-list-item dense @click="updateSize(20)">20</v-list-item>
              <v-list-item dense @click="updateSize(30)">30</v-list-item>
              <v-list-item dense @click="updateSize(50)">50</v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
      <v-col class="d-flex py-1 align-center page-item text-no-wrap justify-center">
        <v-btn depressed small style="color:var(--v-text-base);" @click="goFirst" :disabled="page == 1"><v-icon color="text">mdi-chevron-double-left</v-icon><span class="hidden-xs-only">first</span></v-btn>
        <v-btn depressed small class="ml-2" @click="prev" :disabled="!canPrev || (page && page == 1)"><v-icon color="text">mdi-chevron-left</v-icon></v-btn>
        <span class="mx-2" v-if="page">{{(1 + size * ((page || 1) - 1)).toLocaleString()}} ~ {{(size * (page || 1)).toLocaleString()}}  <span v-if="total"> of {{total.toLocaleString()}}</span></span>
        <span class="mx-2" v-else>{{before}} ~</span>
        <v-btn depressed small @click="next" :disabled="!canNext"><v-icon color="text">mdi-chevron-right</v-icon></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
    name: 'Pagination',
    components: {},
    props: {
        size: {
            type: Number,
            default: 20
        },
        page: {
            type: Number,
            default: null
        },
        total: {
            type: Number,
            default: null
        },
        before: {
            type: String,
            default: ''
        },
        canNext: {
            type: Boolean,
            default: true
        },
        canPrev: {
            type: Boolean,
            default: false
        }
    },
    mixins: [],
    data() {
        return {
        }
    },
    computed: {
    },
    async created() {
    },
    methods: {
        goFirst() {
            this.$emit('goFirst')
        },
        next() {
            this.$emit('next')
        },
        prev() {
            this.$emit('prev')
        },
        updateSize(size) {
            this.$emit('updateSize', size)
        }
    }
}
</script>
<style scoped lang="scss">
.pagination {
  position: relative;
  z-index: 11;
  font-size: 12px;color:#777;font-weight:400;
  @media screen and (max-width:599px) {
    width: 100%;
  }
  .page-item {
    font-size: 13px;
    font-weight: 500;
  }
  ::v-deep .v-btn {
    &.v-btn--disabled {
      background-color: #f5f5f5 !important;
    }
  }

  ::v-deep .v-input__slot {
    height: 30px !important;
    min-height: 30px !important;

    .v-input__append-inner {
      margin-top: 4px !important;
    }
  }
}

.v-list.menu-items {
  background-color: #fafafa;
  .v-list-item {
    color: #333 !important;
    font-weight: 500;
    font-size: 0.9em;
    min-height: 28px;
  }
}
</style>
