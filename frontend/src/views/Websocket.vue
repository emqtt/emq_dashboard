<template>
  <div class="websocket-view">
    <div class="page-title">{{ $t('leftbar.websocket') }}</div>

    <el-card class="box-card blank-top" @keyup.enter.native="mqttConnect">
      <div slot="header">
        <span>{{ $t('websocket.connect') }}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>{{ $t('websocket.host') }}:</label>
          <el-input v-model="clientOption.host" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.port') }}:</label>
          <el-input v-model.number="clientOption.port" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.clientID') }}:</label>
          <el-input v-model="clientOption.clientId" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>{{ $t('websocket.username') }}:</label>
          <el-input v-model="clientOption.username" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.password') }}:</label>
          <el-input v-model="clientOption.password" size="small"></el-input>
        </el-col>
        <el-col :span="8">
          <label>{{ $t('websocket.keepAlive') }}:</label>
          <el-input v-model.number="clientOption.keepalive" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
          <el-checkbox v-model="clientOption.clean">{{ $t('websocket.cleanSession') }}</el-checkbox>
      </el-row>

      <el-row class="connect-area" type="flex" justify="start" align="middle">
        <el-button
          type="success"
          size="small"
          :icon="loading ? 'loading': 'check'"
          :disabled="loading || client.connected"
          :plain="true"
          @keyup.enter.native="mqttConnect"
          @click="mqttConnect">
          {{ $t('websocket.connect') }}
        </el-button>

        <el-button
          class="close-btn"
          type="danger"
          icon="close"
          size="small"
          :plain="true"
          :loading="loading && client.connected"
          :disabled="!loading && !client.connected"
          @keyup.enter.native="disconnectSwitch"
          @click="disconnectSwitch">
          {{ $t('websocket.disconnect') }}
        </el-button>

        <div class="connect-state">{{ $t('websocket.currentState') }}:
          <span :style="client.connected ? 'color: #42d885' : ''">
          {{ getStatus }}
        </span>
        </div>
      </el-row>
    </el-card>

    <el-card class="box-card blank-top" style="max-height: 450px">
      <div slot="header">
        <span>{{ $t('websocket.subscribe') }}</span>
      </div>
      <el-row :gutter="20" @keyup.enter.native="mqttSubscribe">
        <el-col :span="12">
          <label>{{ $t('websocket.topic') }}:</label>
          <el-input v-model="clientOption.subTopic" size="small"></el-input>
          <label>{{ $t('websocket.qoS') }}:</label>
          <el-select v-model.number="clientOption.subQos" size="small" style="display: block;">
            <el-option value="0"></el-option>
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
          </el-select>
          <div class="between">
            <el-button
              type="success"
              icon="check"
              size="small"
              :plain="true"
              @keyup.enter.native="mqttSubscribe"
              @click="mqttSubscribe">
              {{ $t('websocket.subscribe') }}
            </el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <label>{{ $t('websocket.subscribe') }}:</label>
          <el-table :data="clientOption.subscriptions" :max-height="320">
            <el-table-column prop="topic" min-width="150" :label="$t('websocket.topic')">
            </el-table-column>
            <el-table-column prop="qos" min-width="120" :label="$t('websocket.qoS')">
            </el-table-column>
            <el-table-column prop="time" min-width="180" :label="$t('websocket.time')">
            </el-table-column>
            <el-table-column prop="time" width="70" :label="$t('websocket.oper')">
              <template scope="props">
                <el-button
                  title="Unsubscribe"
                  class="unsubscribe"
                  icon="close"
                  size="mini"
                  type="text"
                  @click="mqttCacheScuscribe(props.row.topic)">
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="box-card blank-middle" style="max-height: 800px;padding-bottom: 20px">
      <div slot="header">
        <span>{{ $t('websocket.messages') }}</span>
      </div>
      <el-row :gutter="20" @keyup.enter.native="mqttPublish">
        <el-col :span="6">
          <label>{{ $t('websocket.topic') }}:</label>
          <el-input v-model="clientOption.publishTopic" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>{{ $t('websocket.messages') }}:</label>
          <el-input v-model="clientOption.publishMessage" size="small"></el-input>
        </el-col>
        <el-col :span="6">
          <label>{{ $t('websocket.qoS') }}:</label>
          <el-select v-model.number="clientOption.publishQos" size="small" style="display: block;">
            <el-option value="0"></el-option>
            <el-option value="1"></el-option>
            <el-option value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-top: 21px">
          <el-checkbox v-model="clientOption.publishRetain" style="margin-right: 15px;">
            {{ $t('websocket.retained') }}
          </el-checkbox>
          <el-button
            type="success"
            icon="check"
            size="small"
            :plain="true"
            @click="mqttPublish"
            @keyup.enter.native="mqttPublish">
            {{ $t('websocket.send') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <label>{{ $t('websocket.messagesAlreadySent') }}:
            <i
             title="clear message"
              class="fa fa-refresh refresh-btn"
              aria-hidden="true"
              @click="clearMessage(false)">
           </i>
          </label>
          <el-table border :data="clientOption.publishedMessages" :max-height="600">
            <el-table-column prop="message" :label="$t('websocket.messages')">
            </el-table-column>
            <el-table-column prop="topic" :label="$t('websocket.topic')">
            </el-table-column>
            <el-table-column prop="qos" min-width="120" :label="$t('websocket.qoS')">
            </el-table-column>
            <el-table-column prop="time" min-width="180" :label="$t('websocket.time')">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <label>{{ $t('websocket.messagesReceived') }}:
            <i
              title="clear message"
              class="fa fa-refresh refresh-btn"
              aria-hidden="true"
              @click="clearMessage">
            </i>
          </label>
          <el-table border :data="clientOption.receivedMessages" :max-height="600">
            <el-table-column prop="message" :label="$t('websocket.messages')">
            </el-table-column>
            <el-table-column prop="topic" :label="$t('websocket.topic')">
            </el-table-column>
            <el-table-column prop="qos" min-width="120" :label="$t('websocket.qoS')">
            </el-table-column>
            <el-table-column prop="time" width="180" :label="$t('websocket.time')">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>


<script>
/*
* https://www.npmjs.com/package/mqtt
* MQTT.js 2.13.0版本中
* 连接中： 网络不可达时 ==> 尝试重连 ==> 触发 reconnect ==> 无限重连
* 使用IP地址连接时： IP地址格式错误 ==> 未能捕捉到WS库的校验报错 ==> 不会触发任何事件 ==> 连接状态锁死
*   以上两条 ==> 用户期望可以手动终止，客户端也应该超时终止
* 发布时： 非法发布(非法主题) ==> 服务器断开连接 ==> 客户端触发 reconnect ==> 回调函数error值为空
* 其中 Qos, Topic, Message等必须是Number, String/Buffer, String/Buffer ==> 防止因为ElementUI 下拉选择切换
* 导致Qos变为String ==> 强制类型转换相关值后再发送 or 使用vue绑定修饰符
* */
import NProgress from 'nprogress'
import mqtt from 'mqtt'
import dateformat from 'dateformat'
import {
  Card, Row, Col, Input, Checkbox, Button, Select, Option, Table, TableColumn,
} from 'element-ui'

import clientObject from '../store/mqttConnect'

export default {
  name: 'websocket-view',
  components: {
    'el-card': Card,
    'el-row': Row,
    'el-col': Col,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-button': Button,
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
  data() {
    return {
      retryTimes: 0,
      loading: false,
      sending: false,
      clientOption: {
        host: window.location.hostname,
        port: '8083',
        username: '',
        password: '',
        keepalive: 60,
        clean: true,
        clientId: '',
        subQos: 0,
        publishQos: 0,
        publishMessage: 'Hello world!',
        subTopic: '/World',
        publishTopic: '/World',
        publishRetain: false,
        receivedMessages: [],
        publishedMessages: [],
        subscriptions: [],
      },
      client: {},
    }
  },
  computed: {
    getStatus() {
      if (this.client.connected) {
        return 'CONNECTED'
      }
      if (this.loading) {
        return 'CONNECTING'
      }
      return 'DISCONNECTED'
    },
  },
  methods: {
    now() {
      return dateformat(new Date(), 'yyyy-mm-dd hh:MM:ss')
    },
    disconnectSwitch() {
      // connecting
      if (this.loading && !this.client.connected) {
        this.loading = false
        NProgress.done()
        this.client.end()
        this.client = {}
      } else {
        this.mqttDisconnect()
      }
    },
    mqttConnect() {
      // prevent the connect from keyboard event
      if (this.client.connected || this.loading) {
        return
      }
      NProgress.start()
      this.loading = true
      this.retryTimes = 0
      const options = {
        keepalive: this.clientOption.keepalive,
        username: this.clientOption.username,
        password: this.clientOption.password,
        clientId: this.clientOption.clientId,
        clean: this.clientOption.clean,
        connectTimeout: 4000,
      }
      this.client = mqtt.connect(`ws://${this.clientOption.host}:${this.clientOption.port}/mqtt`, options)
      this.client.on('connect', () => {
        this.loading = false
        clientObject.client = this.client
        clientObject.clientOption = this.clientOption
        NProgress.done()
      })
      this.client.on('reconnect', () => {
        if (this.retryTimes > 1) {
          if (this.sending) {
            this.$message.error(this.$t('websocket.connectError'))
          } else {
            this.$message.error(`${this.$t('websocket.connectFailure')} ${this.clientOption.host}:${this.clientOption.port}`)
          }
          this.retryTimes = 0
          this.sending = false
          this.loading = false
          NProgress.done()
          this.client.end()
          this.client = {}
        }
        // trigger by sending illegal topic
        if (this.sending) {
          this.$message.error(this.$t('websocket.connectError'))
        }
        this.retryTimes += 1
      })
      this.client.on('error', (error) => {
        this.$message.error(error)
        // to prevent reconnect
        this.retryTimes = 0
        NProgress.done()
      })
      this.client.on('message', (topic, message, packet) => {
        this.clientOption.receivedMessages.unshift({
          topic,
          message: message.toString(),
          qos: packet.qos,
          time: this.now(),
        })
      })
    },
    mqttDisconnect() {
      if (this.client.connected) {
        NProgress.start()
        this.client.end()
        this.client.on('close', () => {
          this.loading = false
          this.reset()
          this.client = {}
          NProgress.done()
        })
      } else {
        this.$message.error(this.$t('websocket.connectLeave'))
      }
    },
    mqttSubscribe() {
      if (this.client.connected) {
        this.clientOption.subscriptions.forEach((x, index) => {
          if (x.topic === this.clientOption.subTopic) {
            this.clientOption.subscriptions.splice(index, index + 1)
          }
        })
        NProgress.start()
        this.client.subscribe(this.clientOption.subTopic,
        { qos: this.clientOption.subQos },
        (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error.toString())
          } else {
            this.clientOption.subscriptions.unshift({
              topic: this.clientOption.subTopic,
              qos: this.clientOption.subQos,
              time: this.now(),
            })
            this.$message.success(this.$t('websocket.subscribeSuccess'))
            NProgress.done()
          }
        })
      } else {
        this.$message.error(this.$t('websocket.connectLeave'))
      }
    },
    mqttPublish() {
      if (this.client.connected) {
        NProgress.start()
        const options = { qos: this.clientOption.publishQos,
          retain: this.clientOption.publishRetain }
        // to mark which trigger the reconnect
        this.sending = true
        this.client.publish(this.clientOption.publishTopic,
        this.clientOption.publishMessage, options, (error) => {
          if (error) {
            NProgress.done()
            this.$message.error(error.toString())
          } else {
            this.clientOption.publishedMessages.unshift({
              message: this.clientOption.publishMessage,
              topic: this.clientOption.publishTopic,
              qos: this.clientOption.publishQos,
              time: this.now(),
            })
            this.$message.success(this.$t('websocket.messageSendOut'))
            NProgress.done()
          }
        })
      } else {
        this.$message.error(this.$t('websocket.connectLeave'))
      }
    },
    mqttCacheScuscribe(topic) {
      if (!this.client.connected) {
        this.$message.error(this.$t('websocket.connectLeave'))
        return
      }
      this.client.unsubscribe(topic, (error) => {
        if (error) {
          this.$message.error(`${this.$t('websocket.unsubscribeFailure')} ${error.toString()}!`)
          return
        }
        this.clientOption.subscriptions.forEach((element, index) => {
          if (element.topic === topic) {
            this.clientOption.subscriptions.splice(index, 1)
            // clear message which in this topic
          }
        })
      })
    },
    reset() {
      this.clientOption.subscriptions = []
      this.clientOption.receivedMessages = []
      this.clientOption.publishedMessages = []
      this.clientOption.publishMessage = 'Hello world!'
      this.clientOption.subTopic = '/World'
      this.clientOption.publishTopic = '/World'
    },
    loadConnect() {
      if (!clientObject.client.connected) {
        // reset
        this.clientOption.clientId = `mqttjs_${Math.random().toString(16).substr(2, 10)}`
      } else {
        // reload
        this.client = clientObject.client
        this.clientOption = clientObject.clientOption
      }
    },
    clearMessage(received = true) {
      if (received) {
        this.clientOption.receivedMessages = []
      } else {
        this.clientOption.publishedMessages = []
      }
    },
  },
  created() {
    this.loadConnect()
  },
}
</script>


<style lang="scss">
.websocket-view {
  padding-top: 20px;
  .page-title {
    padding: 10px 0 ;
  }
  .el-select {
    width: 100%;
  }
  .refresh-btn {
    font-size: 12px;
    margin-left: 8px;
    cursor: pointer;
  }
  .el-table {
    margin-top: 5px;
    /* 增加内边距 */
    border-width: 0 !important;
  }
  .blank-top {
    margin-top: 60px;
  }
  .blank-middle {
    margin-top: 20px;
  }
  .el-input,
  .el-checkbox {
    margin: 5px 0 20px;
  }
  .el-button {
    display: inline-block;
    width: 100px;
    &.unsubscribe {
      width: auto;
    }
  }
}
</style>
