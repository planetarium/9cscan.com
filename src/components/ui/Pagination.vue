<template>
  <div class="pagination d-flex align-center mt-2 mt-md-0">
    <v-row>
      <v-col class="py-0 d-flex align-center text-no-wrap">
        <div class="hidden-xs-only">
          <v-menu class="menu-select">
            <template v-slot:activator="{on}">
              <v-btn v-on="on" depressed color="grayButton" outlined rounded class="menu-down-btn px-2"><span class="mr-1">Show</span> {{take}} <v-icon small class="ml-1">mdi-chevron-down</v-icon></v-btn>
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
        <v-btn depressed rounded small style="color:var(--v-text-base);" @click="goFirst" :disabled="skip == 0"><v-icon color="text">mdi-chevron-double-left</v-icon><span class="hidden-xs-only">first</span></v-btn>
        <v-btn depressed rounded small class="ml-2" @click="prev" :disabled="!hasPreviousPage"><v-icon color="text">mdi-chevron-left</v-icon></v-btn>
        <span class="mx-2" v-if="skip !== null">{{(1 + take * ((skip / take) || 0)).toLocaleString()}} ~ {{(take * ((skip / take) + 1)).toLocaleString()}}  <span v-if="total"> of {{total.toLocaleString()}}</span></span>
        <v-btn depressed rounded small @click="next" :disabled="!hasNextPage"><v-icon color="text">mdi-chevron-right</v-icon></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
    name: 'Pagination',
    components: {},
    props: {
        skip: {
            type: Number,
            default: 0
        },
        take: {
            type: Number,
            default: 20
        },
        total: {
            type: Number,
            default: null
        },
        hasNextPage: {
            type: Boolean,
            default: false
        },
        hasPreviousPage: {
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
    font-weight: 700;
  }
  ::v-deep .v-btn {
    background-color: #fff !important;
    border: 1px solid #9aa1a8;
    &.v-btn--disabled {
      border: 1px solid #c6cbd0;
      background-color: #f6f6f6 !important;
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
