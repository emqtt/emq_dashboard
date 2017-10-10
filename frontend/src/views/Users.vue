<template>
  <div class="users-view">
    <div class="page-title">
      {{ $t('leftbar.users') }}
      <div style="float: right">
        <el-button class="add-btn" icon="plus" size="small" @click="showDialog('new', {})">
          {{ $t('users.newUser') }}
        </el-button>
      </div>
    </div>

    <el-table v-loading="loading" border :data="users">
      <el-table-column prop="username" :label="$t('users.username')">
      </el-table-column>
      <el-table-column prop="tags" :label="$t('users.remark')">
      </el-table-column>
      <el-table-column width="140" :label="$t('users.oper')">
        <template scope="props">
          <el-button
            size="mini"
            type="warning"
            :plain="true"
            @click="showDialog('edit', props.row)">
            {{ $t('users.edit') }}
          </el-button>
          <el-popover ref="popoverDeleted" placement="right" :value="popoverVisible">
            <p>{{ $t('users.confirmDelete') }}？</p>
            <div style="text-align: right">
              <el-button
                size="mini"
                type="text"
                @click="hidePopover">
                {{ $t('users.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                :loading="btnLoading"
                @click="deleteUser(props.row.username)">
                {{ $t('users.confirm') }}
              </el-button>
            </div>
          </el-popover>
          <el-button
            v-if="props.row.username!=='admin'"
            size="mini"
            type="danger"
            v-popover:popoverDeleted
            :plain="true">
            {{ $t('users.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="oper === 'new' ? $t('users.newUser') : $t('users.editUser')"
      @keyup.enter.native="save">
      <label>{{ $t('users.username') }}</label>
      <el-input
        v-model="user.username"
        :class="{ error: formError.username }"
        :placeholder="formError.username"
        :disabled="oper==='edit'"
        @focus="formError.username=''">
      </el-input>
      <label>{{ $t('users.remark') }}</label>
      <el-input
        v-model="user.tags"
        :class="{ error: formError.tags }"
        :placeholder="formError.tags"
        @focus="formError.tags=''">
      </el-input>

      <div v-show="oper === 'new' || changePassword">
        <!--add password & edit.Oldpassword-->
        <label>{{ changePassword && oper === 'edit' ? $t('users.oldPassword') : $t('users.password') }}</label>
        <el-input
          v-model="user.password"
          type="password"
          :class="{ error: formError.password }"
          :placeholder="formError.password"
          @focus="formError.password=''">
        </el-input>
        <!--edit new password-->
        <label v-show="oper === 'edit'">{{ $t('users.newPassword') }}</label>
        <el-input
          v-show="oper === 'edit'"
          v-model="user.newPassword"
          type="password"
          :class="{ error: formError.newPassword }"
          :placeholder="formError.newPassword"
          @focus="formError.newPassword=''">
        </el-input>
        <!--add confirm password & edit.OldPassword-->
        <label>{{ oper === 'edit' && changePassword ? $t('users.confirmNewPassword') : $t('users.confirmPassword') }}</label>
        <el-input
          v-model="user.repeatPassword"
          type="password"
          :class="{ error: formError.repeatPassword }"
          :placeholder="formError.repeatPassword"
          @focus="formError.repeatPassword=''">
        </el-input>
      </div>

      <el-button
        v-if="oper === 'edit'"
        class="toggle-btn"
        type="text"
        @click="changePassword = !changePassword">
        {{ changePassword ? $t('users.dontChangePassword') : $t('users.changePassword')}}
      </el-button>

      <span slot="footer" class="dialog-footer">
        <el-button
          icon="close"
          size="small"
          style="margin-right: 20px"
          @click="dialogVisible=false">
          {{ $t('users.cancel') }}
        </el-button>
        <el-button
          type="success"
          icon="check"
          size="small"
          :loading="btnLoading"
          @click="save">
          {{ $t('users.save') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { Row, Button, Table, TableColumn, Popover, Dialog, Input } from 'element-ui'

import { USER_LOGOUT } from '../store/mutation-types'
import { httpGet, httpPost, httpPut, httpDelete } from '../store/api'

export default {
  name: 'users-view',
  components: {
    'el-row': Row,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-popover': Popover,
    'el-dialog': Dialog,
    'el-input': Input,
  },
  data() {
    return {
      loading: false,
      btnLoading: false,
      changePassword: false,
      users: [],
      user: {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: '',
      },
      formError: {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: '',
      },
      popoverVisible: false,
      dialogVisible: false,
      oper: '', // 'new' or 'edit'
    }
  },
  methods: {
    ...mapActions([USER_LOGOUT]),
    logout() {
      this.USER_LOGOUT()
      this.$router.push({ path: '/login' })
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    showDialog(oper, row) {
      this.formError = {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: '',
      }
      this.user = {
        username: '',
        password: '',
        repeatPassword: '',
        newPassword: '',
        tags: 'viewer',
      }
      this.oper = oper
      this.changePassword = false
      if (oper === 'edit') {
        this.user = { ...row }
      }
      this.dialogVisible = true
    },
    loadData() {
      this.loading = true
      httpGet('/users').then((response) => {
        this.users = response.data.result
        this.loading = false
      })
    },
    save() {
      if (!this.user.username) {
        this.formError.username = this.$t('users.usernameRequired')
        return false
      }
      if (!this.user.tags) {
        this.formError.tags = this.$t('users.remarkRequired')
        return false
      }
      if (this.user.username.length > 12 || this.user.username.length < 2) {
        this.user.username = ''
        this.formError.username = this.$t('users.usernameIllegal')
        return false
      }
      // add new user
      if (this.oper === 'new') {
        if (!this.user.password) {
          this.formError.password = this.$t('users.passwordRequired')
          return false
        }
        if (this.user.password !== this.user.repeatPassword) {
          this.user.repeatPassword = ''
          this.user.password = ''
          this.formError.repeatPassword = this.$t('users.passwordInconsistent')
          this.formError.password = this.$t('users.passwordInconsistent')
          return false
        }
        this.btnLoading = true
        this.user.tag = this.user.tags
        httpPost('/users', this.user).then((response) => {
          if (response.data.code === 0) {
            this.$message.success(`${this.$t('users.createUser')}`)
            this.dialogVisible = false
            this.$router.push({ path: '/users' })
            this.loadData()
          } else {
            this.$message.error(response.data.message)
            this.formError.username = response.data.message
          }
          this.btnLoading = false
        })
      } else {
        // edit
        // edit password
        if (this.changePassword) {
          if (!this.user.password) {
            this.formError.password = this.$t('users.passwordRequired')
            return false
          }
          if (!this.user.newPassword) {
            this.formError.newPassword = this.$t('users.newPasswordRequired')
            return false
          }
          if (this.user.newPassword !== this.user.repeatPassword) {
            this.user.repeatPassword = ''
            this.user.newPassword = ''
            this.formError.repeatPassword = this.$t('users.passwordInconsistent')
            this.formError.newPassword = this.$t('users.passwordInconsistent')
            return false
          }
          // this.updateUser()
          // change password
          const chageUser = {
            old_pwd: this.user.password,
            new_pwd: this.user.newPassword,
          }
          this.btnLoading = true
          httpPut(`/change_pwd/${this.user.username}/`, chageUser).then((response) => {
            if (response.data.code === 0) {
              // old === now && user.now === edit.user, need't re authentication
              if (this.$store.state.user.username === this.user.username &&
              this.user.password !== this.user.newPassword) {
                this.$message.error(this.$t('users.authenticate'))
                this.logout()
              } else {
                this.updateUser()
              }
            } else {
              this.$message.error(response.data.message)
              this.formError.password = response.data.message
            }
            this.btnLoading = false
          })
        } else {
          this.updateUser()
        }
        this.btnLoading = true
      }
    },
    deleteUser(username) {
      this.btnLoading = true
      httpDelete(`/users/${username}`).then((response) => {
        if (response.data.code === 0) {
          this.$message.success(`${this.$t('users.delete')}${this.$t('alert.success')}`)
          this.loadData()
        } else {
          this.$message.error(`${this.$t('users.delete')}${this.$t('alert.failure')}`)
        }
        this.btnLoading = false
        this.hidePopover()
      })
    },
    updateUser(changePassword = false) {
      this.btnLoading = true
      httpPut(`/users/${this.user.username}`, this.user).then((response) => {
        if (response.data.code === 0) {
          if (!changePassword) {
            this.$message.success(`${this.$t('users.edit')}${this.$t('alert.success')}`)
          }
          this.dialogVisible = false
          this.loadData()
        } else if (!changePassword) {
          this.$message.error(`${this.$t('users.edit')}${this.$t('alert.failure')}`)
        }
        this.btnLoading = false
      })
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.users-view {
  padding-top: 20px;
  .el-table {
    margin-top: 60px;
  }
  .el-input {
    margin: 5px 0 20px;
  }
}
</style>
