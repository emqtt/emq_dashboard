<template>
  <div class="login-view">
    <el-row style="height: 100%;">
      <el-col class="login-form" :xs="20" :sm="10" :md="8" :lg="8">
        <el-card class="box-card">
          <div slot="header">
            <span style="font-size: 16px">LOG IN</span>
          </div>
          <el-form label-position="top" @keyup.enter.native="login">
            <el-form-item label="Username">
              <el-input
                v-model="username"
                :class="{ error: loginError.username }"
                :placeholder="loginError.username"
                @focus="loginError.username=''">
              </el-input>
            </el-form-item>
            <el-form-item label="Pasword">
              <el-input
                type="password"
                v-model="password"
                :class="{ error: loginError.password }"
                :placeholder="loginError.password"
                @focus="loginError.password=''">
              </el-input>
            </el-form-item>
          </el-form>
          <div class="login-footer">
            <div class="checkbox">
              <el-checkbox v-model="remember">Remember</el-checkbox>
            </div>
            <el-button type="success" @click="login">Log In</el-button>
          </div>
          <!--<div>-->
            <!--Not a member?-->
            <!--&lt;!&ndash;<a href="javascript:;" @click="signup"> Sign up now</a>&ndash;&gt;-->
          <!--</div>-->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>
import axios from 'axios'
import { Col, Row, Card, Form, FormItem, Input, Checkbox, Button } from 'element-ui'
import { mapActions } from 'vuex'

import { USER_LOGIN } from '../store/mutation-types'

export default {
  name: 'login-view',
  components: {
    'el-col': Col,
    'el-row': Row,
    'el-card': Card,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-button': Button,
  },
  data() {
    return {
      username: '',
      password: '',
      remember: false,
      loginError: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapActions([USER_LOGIN]),
    signup() {
      this.$router.push({ path: '/signup' })
    },
    login() {
      if (!this.username) {
        this.loginError.username = 'Username Required'
        return false
      } else if (!this.password) {
        this.loginError.password = 'Password Required'
        return false
      }
      const user = {
        username: this.username,
        password: this.password,
      }
      const config = {
        baseURL: '/api/v2',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
      axios.create(config).post('/auth', user).then((response) => {
        if (response.data.code === 0) {
          const password = user.password
          this.USER_LOGIN({ user: { ...user, password }, remember: this.remember })
          const path = decodeURIComponent(this.$route.query.redirect || '/')
          this.$router.push({ path })
        } else {
          this.loginError.username = 'Username Or Password Error'
          this.username = ''
          this.password = ''
        }
      })
    },
  },

}
</script>


<style lang="scss">
.login-view {
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .el-button {
    padding: 9px 25px;
  }
  .checkbox {
    float: left;
    display: inline-block;
    margin: 6.5px 0 0;
  }
}
</style>
