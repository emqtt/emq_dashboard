<template>
  <div class="listeners-view">
    <div class="page-title">{{ $t('leftbar.listeners') }}</div>
    <el-table v-loading="loading" border :data="listeners">
      <el-table-column prop="protocol" width="240" :label="$t('listeners.protocol')">
      </el-table-column>
      <el-table-column prop="listen" min-width="240" :label="$t('listeners.listenOn')">
      </el-table-column>
      <el-table-column prop="max_clients" min-width="180" :label="$t('listeners.maxClients')">
      </el-table-column>
      <el-table-column prop="current_clients" min-width="120" :label="$t('listeners.currentClients')">
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
  import { mapActions } from 'vuex'
  import {
    Breadcrumb, BreadcrumbItem, Table, TableColumn, Select, Option, Row, Input,
    Button, Popover, Dialog, Col, Form, FormItem, Card,
  } from 'element-ui';

  import { httpGet } from '../store/api'
  import { CURRENT_NODE } from '../store/mutation-types'

  export default{
    name: 'listeners-view',
    components: {
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
        loading: false,
        nodeName: '',
        nodes: [],
        listeners: [],
      }
    },
    computed: {
      nodeInfo() {
        return this.$store.state.node.nodeName
      },
    },
    watch: {
      nodeInfo: 'loadData',
    },
    methods: {
      ...mapActions([CURRENT_NODE]),
      // set global nodeName
      setNode() {
        this.CURRENT_NODE({ nodeName: this.nodeName, nodes: this.nodes })
      },
      loadData() {
        const currentNode = this.$store.state.node.nodeName
        httpGet('/management/nodes').then((response) => {
          // set default of select
          this.nodeName = currentNode || response.data.result[0].name || ''
          this.nodes = response.data.result
          this.setNode()
          this.loadListeners()
        })
      },
      // load listener
      loadListeners() {
        this.loading = true
        httpGet(`/monitoring/listeners/${this.nodeName}`).then((response) => {
          this.listeners = response.data.result
          this.loading = false
        })
      },
    },
    created() {
      this.loadData()
    },
  }
</script>


<style lang="scss">
.listeners-view {
  padding-top: 20px;
  .page-title {
    padding: 10px 0;
  }
  .el-row {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 60px;
  }
}
</style>
