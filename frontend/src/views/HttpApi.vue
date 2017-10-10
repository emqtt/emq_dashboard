<template>
  <div class="http-api">
    <div class="page-title">{{ $t('leftbar.api') }}</div>
    <el-card class="box-card">
      <div slot="header">
        <span>{{ $t('httpApi.introduction') }}</span>
      </div>
      <div v-html="$t('httpApi.desc')"></div>
    </el-card>
    <el-card class="box-card" style="margin-top: 30px;">
      <div slot="header">
        <span>{{ $t('httpApi.reference') }}</span>
      </div>
      <el-table border :data="tableData">
        <el-table-column prop="method" width="120" :label="$t('httpApi.method')"></el-table-column>
        <el-table-column min-width="160" :label="$t('httpApi.path')">
          <template scope="props">
            <a
              target="_blank"
              :href="isLink(props.row) ?  props.row.target : 'javascript:;'"
              :class="['link', isLink(props.row) ? '' : 'link-disabled']">{{ props.row.path }}
            </a>
          </template>
        </el-table-column>
        <el-table-column min-width="240" :label="$t('httpApi.description')">
          <template scope="props">
            <div v-html="props.row.description"></div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>


<script>
import { mapActions } from 'vuex'
import { Tabs, TabPane, TableColumn, Table, Button, Tag, Popover, Card } from 'element-ui'

import { httpGet } from '../store/api'
import { CURRENT_NODE } from '../store/mutation-types'
import { getLocalStorage } from '../common/storage'


export default {
  name: 'http-api',
  components: {
    'el-tabs': Tabs,
    'el-tab-pane': TabPane,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-tag': Tag,
    'el-popover': Popover,
    'el-card': Card,
  },
  data() {
    return {
      popoverVisible: false,
      nodeName: 'emq@127.0.0.1',
      tableData: [],
      nodes: [],
    }
  },
  computed: {
    nodeInfo() {
      return this.$store.state.node.nodeName
    },
  },
  watch: {
    nodeInfo: 'setApiData',
  },
  methods: {
    ...mapActions([CURRENT_NODE]),
    // set global nodeName
    setNode() {
      this.CURRENT_NODE({ nodeName: this.nodeName, nodes: this.nodes })
    },
    isLink(row = {}) {
      // could click
      return row.target && row.target.indexOf('{') === -1 && row.method === 'GET'
    },
    init() {
      const currentNodeName = this.$store.state.node.nodeName
      httpGet('/management/nodes').then((response) => {
        this.nodeName = currentNodeName || response.data.result[0].name || ''
        this.nodes = response.data.result
        this.setNode()
        this.setApiData()
      })
    },
    setApiData() {
      this.nodeName = this.$store.state.node.nodeName
      const language = getLocalStorage('language') || 'en'
      if (language === 'zh') {
        this.tableData = [
          {
            method: 'GET',
            path: '/api/v2/management/nodes',
            target: '/api/v2/management/nodes',
            description: '获取全部节点的基本信息',
          },
          {
            method: 'GET',
            path: '/api/v2/management/nodes/emq@127.0.0.1',
            target: `/api/v2/management/nodes/${this.nodeName}`,
            description: '获取指定节点的基本信息',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes',
            target: '/api/v2/monitoring/nodes',
            description: '获取全部节点的监控数据',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes/emq@127.0.0.1',
            target: `/api/v2/monitoring/nodes/${this.nodeName}`,
            description: '获取指定节点的监控数据',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients',
            target: `/api/v2/nodes/${this.nodeName}/clients`,
            description: '获取指定节点的客户端连接列表',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients/{clientid}',
            target: `/api/v2/nodes/${this.nodeName}/clients/{clientid}`,
            description: '获取节点指定客户端连接的信息',
          },
          {
            method: 'GET',
            path: '/api/v2/clients/{clientid}',
            target: '/api/v2/clients/{clientid}',
            description: '获取集群内指定客户端的信息',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/sessions',
            target: `/api/v2/nodes/${this.nodeName}/sessions`,
            description: '获取指定节点的会话列表',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/sessions/{clientid}',
            target: `/api/v2/nodes/${this.nodeName}/sessions/{clientid}`,
            description: '获取节点上指定客户端的会话信息',
          },
          {
            method: 'GET',
            path: '/api/v2/sessions/{clientid}',
            target: '/api/v2/sessions/{clientid}',
            description: '获取集群内指定客户端的会话信息',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
            target: `/api/v2/nodes/${this.nodeName}/subscriptions`,
            description: '获取某个节点上的订阅列表',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/subscriptions/{clientid}',
            target: `/api/v2/nodes/${this.nodeName}/subscriptions/{clientid}`,
            description: '获取节点上指定客户端的订阅信息',
          },
          {
            method: 'GET',
            path: '/api/v2/subscriptions/{clientid}',
            target: '/api/v2/subscriptions/{clientid}',
            description: '获取集群内指定客户端的订阅信息',
          },
          {
            method: 'GET',
            path: '/api/v2/routes',
            target: '/api/v2/routes',
            description: '获取集群路由表',
          },
          {
            method: 'GET',
            path: '/api/v2/routes/{topic}',
            target: '/api/v2/routes/{topic}',
            description: '获取集群内指定主题的路由信息',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/publish',
            target: '/api/v2/mqtt/publish',
            description: '发布消息',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/subscribe',
            target: '/api/v2/mqtt/subscribe',
            description: '创建订阅',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/unsubscribe',
            target: '/api/v2/mqtt/unsubscribe',
            description: '取消订阅',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/plugins',
            target: `/api/v2/nodes/${this.nodeName}/plugins`,
            description: '获取节点的插件列表',
          },
          {
            method: 'PUT',
            path: '/api/v2/nodes/emq@127.0.0.1/plugins/{name}',
            target: `/api/v2/nodes/${this.nodeName}/plugins/{name}`,
            description: '开启/关闭节点的指定插件',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners',
            target: '/api/v2/monitoring/listeners',
            description: '获取集群节点的监听器列表',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners/emq@127.0.0.1',
            target: `/api/v2/monitoring/listeners/${this.nodeName}`,
            description: '获取指定节点的监听器列表',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/',
            target: '/api/v2/monitoring/metrics/',
            description: '获取全部节点的收发报文统计',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/emq@127.0.0.1',
            target: `/api/v2/monitoring/metrics/${this.nodeName}`,
            description: '获取指定节点的收发报文统计',
          },
          {
            method: 'GET',
            path: 'api/v2/monitoring/stats',
            target: 'api/v2/monitoring/stats',
            description: '获取全部节点的连接会话统计',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/stats/emq@127.0.0.1',
            target: `/api/v2/monitoring/stats/${this.nodeName}`,
            description: '获取指定节点的连接会话统计',
          },
        ]
      } else {
        this.tableData = [
          {
            method: 'GET',
            path: '/api/v2/management/nodes',
            target: '/api/v2/management/nodes',
            description: 'List all Nodes in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/management/nodes/emq@127.0.0.1',
            target: `/api/v2/management/nodes/${this.nodeName}`,
            description: 'Retrieve a Node’s Info',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes',
            target: '/api/v2/monitoring/nodes',
            description: 'List all Nodes’statistics in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/nodes/emq@127.0.0.1',
            target: `/api/v2/monitoring/nodes/${this.nodeName}`,
            description: 'Retrieve a node’s statistics',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients',
            target: `/api/v2/nodes/${this.nodeName}/clients`,
            description: 'List all Clients on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/clients/{client_id}',
            target: `/api/v2/nodes/${this.nodeName}/clients/{client_id}`,
            description: 'Retrieve a Client on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/clients/{client_id}',
            target: '/api/v2/clients/{client_id}',
            description: 'Retrieve a Client in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/node/emq@127.0.0.1/sessions?curr_page=1&page_size=20',
            target: `/api/v2/node/${this.nodeName}/sessions?curr_page=1&page_size=20`,
            description: 'List all Sessions on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/sessions/{client_id}',
            target: `/api/v2/nodes/${this.nodeName}/sessions/{client_id}`,
            description: 'Retrieve a Session on a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/sessions/{client_id}',
            target: '/api/v2/sessions/{client_id}',
            description: 'Retrieve a Session in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/subscriptions',
            target: `/api/v2/nodes/${this.nodeName}/subscriptions`,
            description: 'List all Subscriptions of a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/subscriptions/{cliet_id}',
            target: '/api/v2/subscriptions/{cliet_id}',
            description: 'List Subscriptions of a Client',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/subscribe',
            target: '/api/v2/mqtt/subscribe',
            description: 'Create a Subscription',
          },
          {
            method: 'GET',
            path: '/api/v2/routes',
            target: '/api/v2/routes',
            description: 'List all Routes in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/routes/{topic}',
            target: '/api/v2/routes/{topic}',
            description: 'Retrieve a Route in the Cluster',
          },
          {
            method: 'GET',
            path: '/api/v2/nodes/emq@127.0.0.1/plugins/',
            target: `/api/v2/nodes/${this.nodeName}/plugins/`,
            description: 'List all Plugins of a Node',
          },
          {
            method: 'PUT',
            path: '/api/v2/nodes/plugins/{name}',
            target: '/api/v2/nodes/plugins/{name}',
            description: 'Start/Stop a Plugin',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners',
            target: '/api/v2/monitoring/listeners',
            description: 'List all Listeners',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/listeners/emq@127.0.0.1',
            target: `/api/v2/monitoring/listeners/${this.nodeName}`,
            description: 'List listeners of a Node',
          },
          {
            method: 'POST',
            path: '/api/v2/mqtt/publish',
            target: '/api/v2/mqtt/publish',
            description: 'Publish MQTT Message',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/',
            target: '/api/v2/monitoring/metrics/',
            description: 'Get Metrics of all Nodes',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/metrics/emq@127.0.0.1',
            target: `/api/v2/monitoring/metrics/${this.nodeName}`,
            description: 'Get Metrics of a Node',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/stats',
            target: '/api/v2/monitoring/stats',
            description: 'Get Statistics of all Nodes',
          },
          {
            method: 'GET',
            path: '/api/v2/monitoring/stats/emq@127.0.0.1',
            target: `/api/v2/monitoring/stats/${this.nodeName}`,
            description: 'Get Statistics of a Node',
          },
        ]
      }
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.http-api {
  padding-top: 20px;
  margin-top: 0 !important;
  .link-disabled {
    cursor: not-allowed;
  }
  .box-card {
    margin-top: 60px;
  }
  .el-table {
    border-width: 0 !important;
  }
}
</style>
