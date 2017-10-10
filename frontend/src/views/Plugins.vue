<template>
  <div class="plugins-view">
    <!-- plugin list -->
    <div v-show="!plugin.nodeName" class="page-title">
      {{ $t('leftbar.plugins') }}
    </div>
    <el-table v-show="!plugin.nodeName" v-loading="loading" border :data="tableData">
      <el-table-column prop="name" width="240" :label="$t('plugins.name')">
      </el-table-column>
      <el-table-column prop="version" width="100" :label="$t('plugins.version')">
      </el-table-column>
      <el-table-column prop="description" min-width="340" :label="$t('plugins.description')">
      </el-table-column>
      <el-table-column
        prop="active"
        width="120"
        :label="$t('plugins.status')"
        :filters="[{ text: $t('plugins.stopped'), value: false }, { text: $t('plugins.running'), value: true }]"
        :filter-method="filterStatus">
        <template scope="props">
          <span :class="[props.row.active ? 'running' : 'stopped', 'status']">
            {{ props.row.active ? $t('plugins.running'): $t('plugins.stopped')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="180" :label="$t('plugins.oper')">
        <template scope="props">
          <el-button
            slot="reference"
            size="mini"
            :disabled="props.row.name === 'emq_dashboard'"
            :type="props.row.active ? 'warning' : 'success'"
            @click="update(props.row)" :plain="true">
            {{ props.row.active ? $t('plugins.stop') : $t('plugins.start') }}
          </el-button>
          <el-button
            type="success"
            size="mini"
            :disabled="props.row.name === 'emq_dashboard'"
            :plain="true"
            @click="config(props.row)">
            {{ $t('plugins.config') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- plugin config-->
    <div v-show="plugin.nodeName" class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/plugins' }">{{ plugin.nodeName }}</el-breadcrumb-item>
        <el-breadcrumb-item class="plugin-name">{{ plugin.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-card
      v-show="plugin.nodeName"
      v-loading="loading"
      class="plugin-config"
      style="margin-top: 32px">
      <div slot="header" class="config-dialog">
        <span>{{ plugin.name }}</span>
      </div>
      <el-row type="flex" justify="center">
        <el-col
          v-if="displayConfig === ''"
          style="text-align: center; font-size: 16px"
          :span="24">No Default Configuration
        </el-col>
      </el-row>
      <!--  Plugin Config -->
      <el-form
        ref="record"
        v-loading="loading"
        label-position="top"
        :model="record"
        @keyup.enter.native="putConfig(false)">
        <el-row :gutter="20">
          <el-col v-for="item in plugin.option" :lg="8" :md="12" :sm="12" :key="item.key">
            <el-form-item v-if="record.hasOwnProperty(item.key)" :label="item.key">
              <!--icon="plus" @click="setAdvancedOption(item)"-->
              <el-input
                v-if="item.value.length < 36 && record.hasOwnProperty(item.key) && isAutoIncrement(item.key)[0]"
                v-model="record[item.key]"
                size="small"
                style="width: 100%"
                :placeholder="item.desc">
              </el-input>
              <el-input
                v-if="item.value.length < 36 && record.hasOwnProperty(item.key) && !isAutoIncrement(item.key)[0]"
                v-model="record[item.key]"
                size="small"
                style="width: 100%"
                :placeholder="item.desc">
              </el-input>
              <el-input
                v-if="item.value.length > 35 && record.hasOwnProperty(item.key)"
                v-model="record[item.key]"
                type="textarea"
                size="small"
                :rows="2"
                :placeholder="item.desc">
              </el-input>
            </el-form-item>
          </el-col>

          <!-- Advanced Keys-->
          <el-col
            class="config-area"
            style="margin-top: 20px"
            :span="24">
            <el-button
              v-show="displayConfig !== ''"
              type="success"
              size="small"
              :plain="true"
              :disabled="!changeListener"
              @click="putConfig(false)"
              @keyup.enter.native="putConfig(false)">
              {{ $t('plugins.confirm') }}
            </el-button>
            <el-button
              class="cancel-btn"
              size="small"
              :plain="true"
              @click="abortOperation(false)"
              @keyup.enter.native="abortOperation(false)">
              <i v-if="displayConfig === ''" class="el-icon-arrow-left"></i>
              {{ displayConfig === '' ? $t('plugins.back') : $t('plugins.cancel') }}
            </el-button>
            <el-button
              v-if="advancedConfig.length !== 0"
              type="text"
              title="More configuration"
              class="oper-btn"
              size="small"
              :plain="true"
              @click="setAdvancedConfig(false)">
              {{ $t('plugins.advancedConfig') }}
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-dialog title="Notice" size="tiny" :visible.sync="dialogVisible">
      <span>{{ notic }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="small"
          @click="handleOperation(true, false)"
          @keyup.enter.native="handleOperation(true, false)">
          {{ $t('plugins.confirm') }}
        </el-button>
        <el-button
          size="small"
          @click="handleOperation(false, false)"
          @keyup.enter.native="handleOperation(false, false)">
          {{ $t('plugins.cancel') }}
        </el-button>
      </span>
    </el-dialog>

    <el-dialog
      size="tiny"
      :title="$t('plugins.advancedConfig')"
      :visible.sync="isAdvancedConfig"
      @keyup.enter.native="setAdvancedConfig(true)">
     <el-row type="flex" justify="left" class="advanced-key" :gutter="20">
       <el-col :span="24">
         <label v-if="advancedConfig.length === 0">No Advanced Config</label>
         <el-checkbox-group v-model="selectedAdvancedConfig">
           <el-checkbox v-for="item in advancedConfig" :label="item" :key="item.key">
             {{ item.key }}
           </el-checkbox>
         </el-checkbox-group>
       </el-col>
     </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="small"
          @click="setAdvancedConfig(true)"
          @keyup.enter.native="setAdvancedConfig(true)">
          {{ $t('plugins.add') }}
        </el-button>
        <el-button
          size="small"
          @click="isAdvancedConfig = false"
          @keyup.enter.native="isAdvancedConfig = false">
          {{ $t('plugins.cancel') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Breadcrumb, BreadcrumbItem, Table, TableColumn, Select, Option, Row, Input, Checkbox,
  CheckboxGroup, Button, Popover, Dialog, Col, Form, FormItem, Card,
} from 'element-ui'

import { httpGet, httpPut } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default{
  name: 'plugins-view',
  components: {
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-form-item': FormItem,
    'el-form': Form,
    'el-col': Col,
    'el-select': Select,
    'el-dialog': Dialog,
    'el-row': Row,
    'el-card': Card,
    'el-option': Option,
    'el-input': Input,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-popover': Popover,
  },
  data() {
    return {
      filtered: false,
      notic: '',
      oper: '',
      nextPath: '/plugins',
      dialogVisible: false,
      loading: false,
      nodeName: '',
      popoverVisible: false,
      tableData: [],
      nodes: [],
      searchValue: '',
      record: {},
      hashCode: '',
      advancedConfig: [],
      isAdvancedConfig: false,
      selectedAdvancedConfig: [],
      plugin: {
        nodeName: '',
        name: '',
        desc: '',
        option: [],
      },
    }
  },
  computed: {
    displayConfig() {
      if (Object.keys(this.record).length !== 0) {
        return 'default'
      }
      return ''
    },
    changeListener() {
      return this.hashCode !== JSON.stringify(this.record)
    },
    nodeInfo() {
      return this.$store.state.node.nodeName
    },
  },
  watch: {
    $route: 'loadData',
    nodeInfo: 'reloadOnSelectChange',
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setNode() {
      this.CURRENT_NODE({ nodeName: this.nodeName, nodes: this.nodes })
    },
    isAutoIncrement(item = '') {
      const key = item.split('$')
      if (key.length === 1) {
        return [false, null]
      }
      return [true]
    },
    // reload config page with the nodeName change
    reloadOnSelectChange() {
      // is in plugin list ?
      if (!this.$route.params.nodeName) {
        this.loadData()
        return
      }
      const currentNode = this.$store.state.node.nodeName || ''
      const pluginName = this.$route.params.pluginName || ''
      if (currentNode && pluginName) {
        // url
        const url = `/plugins/${btoa(currentNode)}/${pluginName}`
        this.$router.push({ path: url })
      }
    },
    filterStatus(value, row) {
      this.filtered = true
      return row.active === value
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    update(row) {
      this.hidePopover()
      this.loading = true
      const data = { active: !row.active }
      httpPut(`/nodes/${this.nodeName}/plugins/${row.name}`, data).then((response) => {
        this.loading = false
        if (response.data.code === 0) {
          this.$message.success(`${row.active ? this.$t('plugins.stop') : this.$t('plugins.start')}${this.$t('alert.success')}`)
          this.loadPlugins()
        } else {
          this.$message.error(`${row.active ? this.$t('plugins.stop') : this.$t('plugins.start')}${this.$t('alert.failure')}:${response.data.code} ${response.data.message}`)
        }
      })
    },
    sortObject() {
      return (objFirst, objSecond) => {
        if (objFirst.value.length > objSecond.value.length) {
          return objFirst.value.length - objSecond.value.length
        }
        return 0
      }
    },
    loadData() {
      // To config plugins
      const nodeName = this.$route.params.nodeName
      this.selectedAdvancedConfig = []
      this.advancedConfig = []
      this.record = {}
      // nodeName in url
      if (nodeName) {
        if (this.$route.params.pluginName === 'emq_dashboard') {
          this.$router.push({ path: '/not_found' })
          return
        }
        // set nodeName to store
        this.setNode()
        this.plugin.nodeName = atob(nodeName)
        this.nodeName = this.plugin.nodeName
        this.plugin.name = this.$route.params.pluginName || ''
        this.clockStatus = true
        this.loading = true
        // load & render pluginOption
        httpGet(`nodes/${this.plugin.nodeName}/plugin_configs/${this.plugin.name}`).then((response) => {
          this.plugin.option = response.data.result
          // sort & define
          this.plugin.option.sort(this.sortObject())
          this.plugin.option.forEach((item) => {
            if (item.key.indexOf('$') !== -1) {
              return
            }
            if (item.required) {
              /*
              if (item.value.length < 35) {
                recordList.unshift(item)
              } else {
                recordList.push(item)
              }
              */
              this.$set(this.record, item.key, item.value)
            } else {
              this.advancedConfig.push(item)
            }
          })
          // hashCode
          this.hashCode = JSON.stringify(this.record)
          this.loading = false
        })
      } else {
        // load with plugin page
        const currentNode = this.$store.state.node.nodeName
        httpGet('/management/nodes').then((response) => {
          this.nodes = []
          // set default of select
          this.nodeName = currentNode || response.data.result[0].name || ''
          this.nodes = response.data.result
          this.setNode()
          this.loading = false
          if (!this.filtered) {
            this.loadPlugins()
          }
        })
        // this.nodeName = this.plugin.nodeName
        this.plugin.nodeName = ''
      }
    },
    loadPlugins() {
      if (!this.nodeName) {
        return
      }
      this.loading = true
      this.searchValue = ''
      // set nodeName to store
      this.setNode()
      httpGet(`/nodes/${this.nodeName}/plugins`).then((response) => {
        this.tableData = response.data.result
        this.loading = false
      })
    },
    // to config view
    config(row) {
      this.plugin.name = row.name
      this.plugin.desc = row.description
      this.$router.push({ path: `/plugins/${btoa(this.nodeName)}/${row.name}` })
    },
    putConfig(confirm = false) {
      if (confirm) {
        // check $
        /*
         如果是 value = " config1!#!config2!#!config3!#!config4!#!config5 "这种配置：
           ===> 使用正则匹配 $ <---> .  用于匹配 web.hook.$id.rule [占位符在中间]
                使用正则匹配 $ <---> \n 用于匹配 web.hook.rule.$id [占位符在后面]
          将其替换为 length = value.split('!#!').length 的自增序列 ;
         如： web.hook.rule.client.unsubscribe.$name 在发送之前将会被分解为
           web.hook.rule.client.unsubscribe.0 : config[0]
           web.hook.rule.client.unsubscribe.1 : config[1]
           web.hook.rule.client.unsubscribe.2 : config[2]
         但是下一次我查看返回的配置的时候，配置的key已经变成了 web.hook.rule.client.unsubscribe.[index]
         有好的显示方案？让用户知道这个index占领的占位符是 name 还是 password 或者其他？
        */
        // update the config
        // load pluginOption
        httpPut(`nodes/${this.plugin.nodeName}/plugin_configs/${this.plugin.name}`, this.record).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('Config Success.')
            this.hashCode = JSON.stringify(this.record)
            this.$router.push({ path: '/plugins' })
          } else {
            this.$message.error('Config failure!')
          }
        })
      } else {
        // waiting the confirm
        this.notic = 'Are you sure you want to submit changes and apply them ?'
        this.oper = 'update'
        this.handleOperation(true)
      }
    },
    handleOperation(confirm = false, alert = true) {
      // not ok
      if (!confirm) {
        this.dialogVisible = false
      } else if (alert) {
        this.dialogVisible = true
      } else {
        this.dialogVisible = false
        switch (this.oper) {
          case 'update': this.putConfig(true)
            break
          case 'default': this.resetDefault(true)
            break
          case 'cancel': this.abortOperation(true)
            break
          default: this.dialogVisible = false
        }
      }
    },
    resetDefault(confirm = false) {
      if (confirm) {
        this.plugin.option.forEach((item) => {
          this.$set(this.record, item.key, item.default[0])
        })
      } else {
        this.notic = 'Are you sure the reset configuration is the default?'
        this.oper = 'default'
        this.handleOperation(true)
      }
    },
    abortOperation(confirm = false) {
      if (confirm) {
        this.$message({
          message: 'You have given up this change',
          type: 'warning',
        })
        this.hashCode = JSON.stringify(this.record)
        this.$router.push({ path: this.nextPath })
      } else if (this.hashCode !== JSON.stringify(this.record)) {
        this.notic = 'Are you sure you want to give up the change and exit?'
        this.oper = 'cancel'
        // reset current node
        this.setNode()
        this.handleOperation(true)
      } else {
        this.$router.push({ path: '/plugins' })
      }
    },
    setAdvancedConfig(set = true) {
      if (set) {
        // remove
        this.plugin.option.forEach((item) => {
          if (!item.required) {
            this.$delete(this.record, item.key)
          }
        })
        // set
        this.selectedAdvancedConfig.forEach((item) => {
          this.$set(this.record, item.key, item.value)
        })
        this.isAdvancedConfig = false
      } else {
        this.isAdvancedConfig = true
      }
    },
  },
  created() {
    this.loadData()
  },
  // to modify protection
  beforeRouteLeave(to, from, next) {
    const isChange = this.hashCode !== JSON.stringify(this.record)
    if (this.plugin.nodeName && isChange) {
      this.nextPath = to.path
      this.abortOperation()
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
/* Advanced Config DiaLog */
.plugins-view {
  .el-table {
    margin-top: 60px;
  }
  padding-top: 20px;
  .page-title {
    padding: 10px 0;
  }
  .el-row {
    margin-top: 20px;
  }
  .advanced-key {
    .el-checkbox-group {
      .el-checkbox {
        &:first-child {
          margin-left: 15px;
        }
        margin-bottom: 10px;
        margin-top: 10px;
      }
    }
  }
}
</style>
