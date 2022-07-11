<template>
  <v-app id="app">
    <toolbar></toolbar>
    <global-search v-if="$route.name != 'index'"></global-search>
    <router-view id="router"/>
    <common-footer class="mt-12 pt-12"></common-footer>
  </v-app>
</template>

<script>
import Toolbar from "@/components/Toolbar"
import CommonFooter from "@/components/Footer"
import GlobalSearch from "@/components/GlobalSearch";
export default {
    name: 'App',
    components: {
        GlobalSearch,
        CommonFooter,
        Toolbar
    },
    created() {
        this.$store.dispatch('Block/init')
        this.$store.dispatch('Price/init')
    }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700;900&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
#app {
    font-family: Pretendard;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    background-color: #fcfcfc;
    text-underline-offset: 2px;

    a {
      font-family: Helvetica,Arial,sans-serif !important;
      color: var(--v-pointlink-base);
      transition-property: opacity;
      transition-duration: 0.3s;
      font-weight: 500;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
        opacity: 0.83;
      }
      &:link {
        background-color: transparent !important;
      }


      &.v-btn--active:before {
        background-color: transparent !important;
      }
      &.v-btn:hover {
        text-decoration: none;
      }

    }
}
.theme-font {
  font-family: "Frank Ruhl Libre";
}
.hex {
  font-family: Helvetica,Arial,sans-serif;
  word-break: break-all;
}
@keyframes fadein {
  0% {opacity: 0; }
  100% {opacity: 1; }
}
.page-wide-wrap {
  max-width: 1440px !important;
  padding: 20px 16px !important;
  margin: auto !important;
  min-width: 300px !important;
  > .row {
    margin: 0px !important;
  }

  @media screen and (max-width:959px) {
    padding: 16px 16px !important;
  }

  @media screen and (max-width:599px) {
    padding: 16px 6px !important;
  }
}
.page-wrap {
  max-width: 1000px;
  min-width: 300px !important;
  padding: 20px;
  margin: auto;
  > .row {
    margin: 0px !important;
  }
  @media screen and (max-width:959px) {
    padding: 12px !important;
  }
  @media screen and (max-width:599px) {
    padding: 12px 0px !important;
  }
}
.ellipsis {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.ellipsis2 {
  text-overflow:ellipsis;
  overflow:hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.ellipsis5 {
  text-overflow:ellipsis;
  overflow:hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.ellipsis7 {
  text-overflow:ellipsis;
  overflow:hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 7;
  -webkit-box-orient: vertical;
  white-space: normal;
}
.v-btn.rect {
  border-radius: 0px !important;
  font-family: Pretendard !important;
  &.v-size--default {
    height: 40px !important;
    font-size: 15px !important;
    padding: 0px 24px !important;
    font-weight: normal !important;
  }
  .v-btn__content {
    letter-spacing: 0 !important;
    text-transform: none !important;
  }
}

.pointred-text {color: var(--v-pointred-base) !important}
.pointlink-btn {
  background-color: transparent;
  border-color: var(--v-pointlink-lighten1) !important;
  color: var(--v-pointlink-base) !important;
  font-weight: 600 !important;
}
.pointred-btn {
  background-color: var(--v-pointred-base) !important;
  color: white !important;
}
.pointtext-btn {
  background-color: var(--v-bg-base) !important;
  color: white !important;
  border: 1px solid var(--v-text-base) !important;
}

div.v-menu__content.menuable__content__active {
  border-radius: 3px !important;
}


.skeleton-loading {
  position: relative;
  overflow: hidden;
  background-color: black;
  &:after {
    background: linear-gradient(90deg,hsla(0,0%,100%,0),hsla(0,0%,100%,.3),hsla(0,0%,100%,0));
    animation: loading 1.5s infinite;
    position: absolute;
    z-index: 0;
    content: "";
    left: 0;
    top: 0;
    right: 0;
    transform: translateX(-100%);
    height: 100%;
  }
}

thead {
  background-color: #f5f7fa;
  position: relative;
  z-index: 10;
  text-align: center;
  th {
    border-top: 1px solid #ddd;
    text-align: center !important;
    color: #111 !important;
    font-size: 14px !important;
    font-weight: 600;
  }
}

.detail-page {
  .page-title {
    text-align: left;
    font-size: 28px;
    font-weight: 500;
    > span {
      font-weight: 500;
      color:#777;
      font-size: 0.8em;
    }
  }
  .table-info {
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color:#777;
    padding: 16px 0px 0px 20px;
  }
  .v-tab {
    text-transform: none;
    font-weight: 700;
  }


  .info-item {
    font-size: 14px;
    width: 100%;
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    .item-title {
      text-align: left;
      padding: 0px 0px 0px 24px;
      font-weight: 500;
      color: #111;
    }
    .item-value {
      padding: 0px 12px 0px 24px;
      text-align: left;
      color: #111;
    }
  }
}
</style>
