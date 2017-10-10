<template>
  <div class="leftbar">
    <div class="bar-title">
      <img class="logo" src="../assets/emqlogo.png">
      <span>Dashboard</span>
    </div>
    <el-menu
      mode="vertical"
      theme="dark"
      unique-opened
      router
      :default-active="'/' + $route.path.split('/')[1]">
      <el-menu-item-group :title="$t('leftbar.monitoring')">
        <el-menu-item index="/">
          <i class="fa fa-bar-chart"></i>
          {{ $t('leftbar.overview') }}
        </el-menu-item>
      </el-menu-item-group>
        <el-menu-item index="/clients">
          <i class="fa fa-microchip"></i>
          {{ $t('leftbar.clients') }}
        </el-menu-item>
        <el-menu-item index="/sessions">
          <i class="fa fa-exchange"></i>
          {{ $t('leftbar.sessions') }}
        </el-menu-item>
        <el-menu-item index="/routes">
          <i class="fa fa-random"></i>
          {{ $t('leftbar.routes') }}
        </el-menu-item>
        <el-menu-item index="/subscriptions">
          <i class="fa fa-rss-square"></i>
          {{ $t('leftbar.subscriptions') }}
        </el-menu-item>
      <el-menu-item-group :title="$t('leftbar.management')">
        <el-menu-item index="/plugins">
          <i class="fa fa-plug"></i>
          {{ $t('leftbar.plugins') }}
        </el-menu-item>
        <el-menu-item index="/listeners">
          <i class="fa fa-superpowers"></i>
          {{ $t('leftbar.listeners') }}
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group :title="$t('leftbar.tools')">
        <el-menu-item index="/websocket">
          <i class="fa fa-html5"></i>
          {{ $t('leftbar.websocket') }}
        </el-menu-item>
        <el-menu-item index="/http_api">
          <i class="fa fa-code"></i>
          {{ $t('leftbar.api') }}
        </el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group :title="$t('leftbar.admin')">
        <el-menu-item index="/users">
          <i class="fa fa-user-o"></i>
          {{ $t('leftbar.users') }}
        </el-menu-item>
      </el-menu-item-group>
    </el-menu>
  </div>
</template>


<script>
import { Menu, MenuItem, MenuItemGroup } from 'element-ui'
import { mapActions } from 'vuex'
import { USER_LOGOUT } from '../store/mutation-types'

export default {
  name: 'leftbar',
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-menu-item-group': MenuItemGroup,
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    ...mapActions([USER_LOGOUT]),
    logout() {
      this.USER_LOGOUT()
      this.$router.push({ path: '/login' })
    },
  },
}
</script>


<style lang="scss">
.leftbar {
  position: fixed;
  top: 60px;
  bottom: 0;
  width: 200px;
  z-index: 1000;
  overflow-y: auto;
  .el-menu {
    position: relative;
    left: 0;
    top: 0;
    width: 200px;
    padding-bottom: 52px;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item-group__title {
    font-weight: bolder;
    margin-bottom: 10px;
    margin-top: 15px;
    font-size: 14px;
  }
  .bar-title {
    position: fixed;
    top: 0;
    z-index: 1003;
    padding-left: 20px;
    display: flex;
    height: 63px;
    width: 180px;
    align-items: center;
    border-bottom: 1px solid #313437;
    span {
      font-size: 16px;
      color: #34c388;
      margin-left: 8px;
    }
    img {
      width: 48px;
    }
  }
  .fa {
    margin-right: 10px;
  }
  .el-submenu .el-menu-item {
    padding-left: 50px !important;
  }
}
</style>
