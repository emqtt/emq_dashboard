<template>
  <div class="datas-view">
    <div class="page-title">
      {{ $t(`leftbar.${activeTab}`) }}
      <div style="float: right" @keyup.enter.native="searchChild">
        <el-input
          v-model="searchValue"
          class="input-radius"
          size="small"
          icon="search"
          :disabled="loading"
          :on-icon-click="searchChild"
          :placeholder="searchPlaceholder"
          @keyup.enter.native="searchChild">
        </el-input>
      </div>
    </div>

    <!-- clients -->
    <el-table v-show="activeTab==='clients'" v-loading="loading" border :data="clients">
      <el-table-column prop="client_id" min-width="160" :label="$t('clients.clientId')">
      </el-table-column>
      <el-table-column prop="username" min-width="130" :label="$t('clients.username')">
      </el-table-column>
      <el-table-column prop="ipaddress" min-width="150" :label="$t('clients.ipAddr')">
      </el-table-column>
      <el-table-column prop="port" min-width="80" :label="$t('clients.port')">
      </el-table-column>
      <el-table-column prop="clean_sess" min-width="110" :label="$t('clients.cleanSess')">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="proto_ver" width="90" :label="$t('clients.protoVer')">
      </el-table-column>
      <el-table-column prop="keepalive" width="120" :label="$t('clients.keepalive')">
      </el-table-column>
      <el-table-column prop="connected_at" width="180" :label="$t('clients.connectedAt')">
      </el-table-column>
    </el-table>

    <!-- sessions -->
    <el-table v-show="activeTab==='sessions'" v-loading="loading" border :data="sessions">
      <el-table-column prop="client_id" min-width="160" :label="$t('sessions.clientId')">
      </el-table-column>
      <el-table-column prop="clean_sess" :label="$t('sessions.cleanSess')">
        <template scope="scope">
          <span>{{ scope.row.clean_sess ? 'true' : 'false' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subscriptions" min-width="120" :label="$t('sessions.subscriptions')"></el-table-column>
      <el-table-column prop="max_inflight" min-width="150" :label="$t('sessions.maxInflight')"></el-table-column>
      <el-table-column prop="inflight_len" min-width="150" :label="$t('sessions.inflightLen')"></el-table-column>
      <el-table-column prop="mqueue_len" min-width="150" :label="$t('sessions.mqueueLen')"></el-table-column>
      <el-table-column prop="mqueue_dropped" min-width="150" :label="$t('sessions.mqueueDropped')"></el-table-column>
      <el-table-column prop="awaiting_rel_len" min-width="150" :label="$t('sessions.awaitingRelLen')"></el-table-column>
      <el-table-column prop="deliver_msg" min-width="150" :label="$t('sessions.deliverMsg')"></el-table-column>
      <el-table-column prop="enqueue_msg" min-width="180" :label="$t('sessions.enqueueMsg')"></el-table-column>
      <el-table-column prop="created_at" min-width="180" :label="$t('sessions.createdAt')"></el-table-column>
    </el-table>

    <!-- topics -->
    <el-table v-show="activeTab==='topics'" v-loading="loading" border :data="topics">
      <el-table-column prop="topic" label="Topic"></el-table-column>
      <el-table-column prop="subTopicCount" label="SubTopicCount"></el-table-column>
    </el-table>

     <!-- routes -->
    <el-table :data="routes" v-show="activeTab==='routes'" v-loading="loading" border>
      <el-table-column prop="topic" :label="$t('routes.topic')"></el-table-column>
      <el-table-column prop="node" :label="$t('routes.node')"></el-table-column>
    </el-table>

    <!-- subscriptions -->
    <el-table v-loading="loading" v-show="activeTab==='subscriptions'" border :data="subscriptions">
      <el-table-column prop="client_id" :label="$t('subscriptions.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('subscriptions.topic')"></el-table-column>
      <el-table-column prop="qos" :label="$t('subscriptions.qoS')"></el-table-column>
    </el-table>

    <!-- refresh button -->
    <el-row v-show="searchView" type="flex" justify="end">
      <el-col :span="24">
        <el-button
          class="back-btn"
          style="float: right;"
          size="small"
          type="text"
          icon="arrow-left"
          @click="loadChild">Back
        </el-button>
      </el-col>
    </el-row>

    <!-- pagination -->
    <el-pagination
      v-if="total>0"
      layout="prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="currentPageChanged">
    </el-pagination>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import {
  Tabs, TabPane, TableColumn, Table, Button, Tag, Popover, Breadcrumb, BreadcrumbItem,
  Row, Input, Select, Pagination, Option, Col,
} from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'

export default {
  name: 'datas-view',
  components: {
    'el-col': Col,
    'el-select': Select,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-tag': Tag,
    'el-popover': Popover,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-row': Row,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-option': Option,
  },
  data() {
    return {
      searchView: false,
      loading: false,
      nodeName: '',
      nodes: [],
      activeTab: 'clients',
      popoverVisible: false,
      searchKey: '',
      searchValue: '',
      searchPlaceholder: 'ClientId',
      clients: [],
      sessions: [],
      topics: [],
      routes: [],
      subscriptions: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
    }
  },
  watch: {
    $route: 'init',
    nodeInfo: 'init',
  },
  computed: {
    nodeInfo() {
      return this.$store.state.node.nodeName
    },
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setNode() {
      this.CURRENT_NODE({ nodeName: this.nodeName, nodes: this.nodes })
    },
    // get path
    init() {
      this.activeTab = this.$route.path.split('/')[1]
      switch (this.activeTab) {
        case 'clients':
        case 'sessions':
        case 'subscriptions':
          this.searchPlaceholder = 'ClientId'
          break
        case 'topics':
        case 'routes':
          this.searchPlaceholder = 'Topic'
          break
        default:
          this.searchPlaceholder = 'ClientId'
          break
      }
      this.loadData()
    },
    loadData() {
      this.loading = true
      this.currentPage = 1
      this.searchValue = ''
      // load routes needn't nodes
      if (this.activeTab === 'routes') {
        this.loadChild()
        return
      }
      // set default of select
      const currentNode = this.$store.state.node.nodeName
      httpGet('/management/nodes').then((response) => {
        this.nodeName = currentNode || response.data.result[0].name || ''
        this.nodes = response.data.result
        this.setNode()
        // load child with sync
        this.loadChild()
      })
    },
    // load child with pagination
    currentPageChanged(target) {
      this.currentPage = target
      this.loadChild()
    },
    loadChild(reload = false) {
      this.searchView = false
      this.searchValue = ''
      if (!this.nodeName && this.activeTab !== 'routes') {
        return
      }
      // load child with the currentPage asc
      if (reload) {
        this.currentPage = 1
      }
      this.loading = true
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      if (this.activeTab === 'routes') {
        requestURL = `/routes?curr_page=${this.currentPage}&page_size=${this.pageSize}`
      }
      httpGet(requestURL).then((response) => {
        this[this.activeTab] = response.data.result.objects
        this.total = response.data.result.total_num || 0
        this.loading = false
      })
    },
    searchChild() {
      if (!this.searchValue) {
        this.$message.error(`${this.searchPlaceholder} ${this.$t('alert.required')}`)
        return
      }
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${this.searchValue}`
      if (this.activeTab === 'routes') {
        requestURL = `/routes/${this.searchValue}`
      }
      this.loading = true
      httpGet(requestURL).then((response) => {
        if (response.data.result.objects.length === 0) {
          this.searchView = false
          this[this.activeTab] = []
          this.searchView = true
          // reset page
          this.total = 0
          this.currentPage = 0
        } else {
          this[this.activeTab] = response.data.result.objects
          this.searchView = true
          // reset page
          this.total = 0
          this.currentPage = 0
        }
        this.loading = false
      })
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.datas-view {
  padding-top: 20px;
  .page-title {
    padding: 10px 0;
  }
  .el-table {
    margin-top: 60px;
  }
  .el-row {
    margin-top: 20px;
  }
  .el-input {
    width: 240px;
  }
  .search-btn {
    margin-left: 8px
  }
  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 20px;
  }
}
</style>
