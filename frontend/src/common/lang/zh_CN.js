import zhLocale from 'element-ui/lib/locale/lang/zh-CN'


export default {
  ...zhLocale,
  // leftbar
  leftbar: {
    // MONITORING
    monitoring: '数据',
    overview: '首页',
    clients: '客户端',
    sessions: '会话',
    routes: '路由',
    subscriptions: '订阅',
    // MANAGEMENT
    management: '管理',
    plugins: '插件',
    listeners: '端口监听',
    // TOOLS
    tools: '工具',
    websocket: 'Websocket',
    api: 'HTTP接口',
    // ADMIN
    admin: '管理员',
    users: '用户管理',
  },
  // overview
  overview: {
    // Broker
    broker: '系统信息',
    systemName: '系统名称',
    version: '版本',
    uptime: '运行时间',
    systemTime: '系统时间',
    // Nodes
    nodes: '节点信息',
    name: '节点名称',
    erlangProcesses: 'Erlang进程',
    cpuInfo: '处理器',
    memoryInfo: '内存',
    maxFds: '最大Fds',
    status: '状态',
    // Stats
    stats: '运行统计',
    clientsCount: '已连接',
    clientsMax: '连接峰值',
    retainedCount: '保有量',
    retainedMax: '最大保有量',
    routesCount: '路由数',
    routesMax: '路由峰值',
    sessionsCount: '会话数',
    subscribersCount: '最大会话数',
    topicsCount: '主题数',
    topicsMax: '最大主题数',
    // Metrics
    metrics: '度量指标',
    packetsData: '数据包',
    messagesData: '消息',
    bytesData: '数据流量',
  },
  // Clients
  clients: {
    clientId: '客户端ID',
    username: '用户名',
    ipAddr: 'IP地址',
    port: '端口',
    cleanSess: '清除会话',
    protoVer: '样机版本',
    keepalive: '心跳(s)',
    connectedAt: '创建时间',
  },
  // sessions
  sessions: {
    clientId: '客户端ID',
    cleanSess: '清除会话',
    subscriptions: '订阅数',
    maxInflight: '最大拥塞',
    inflightLen: '当前拥塞',
    mqueueLen: '队列长度',
    mqueueDropped: '删除队列',
    awaitingRelLen: '等待释放',
    deliverMsg: '总消息数',
    enqueueMsg: '队列消息数',
    createdAt: '创建时间',
  },
  // routes
  routes: {
    topic: '主题',
    node: '节点',
  },
  // subscriptions
  subscriptions: {
    clientId: '客户端ID',
    topic: '主题',
    qoS: '服务质量',
  },
  // plugins
  plugins: {
    name: '插件名称',
    version: '版本',
    description: '描述',
    status: '状态',
    stopped: '已停止',
    running: '运行中',
    oper: '操作',
    start: '启动',
    stop: '停止',
    config: '配置',
    back: '返回',
    confirm: '确认',
    cancel: '取消',
    advancedConfig: '高级配置',
    add: '新增',
  },
  // listeners
  listeners: {
    protocol: '协议',
    listenOn: '监听地址',
    maxClients: '最大客户端连接数',
    currentClients: '当前客户端连接数',
  },
  // websocket
  websocket: {
    // Connect
    connect: '连接',
    host: '主机地址',
    port: '端口',
    clientID: '客户端ID',
    username: '用户名',
    password: '密码',
    keepAlive: '心跳',
    cleanSession: '清除会话',
    disconnect: '断开连接',
    currentState: '当前状态',
    // Subscribe
    subscribe: '订阅',
    topic: '主题',
    qoS: '服务质量',
    date: '订阅时间',
    oper: '操作',
    // Messages
    messages: '消息',
    retained: '保留',
    send: '发送',
    messagesAlreadySent: '已发送消息',
    messagesReceived: '已保存信息',
    time: '时间',
    connectError: '错误: 尝试向非法主题发布消息',
    connectFailure: '连接失败',
    connectLeave: '尚未连接到服务器',
    subscribeSuccess: '订阅成功',
    messageSendOut: '消息已发出',
  },
  // http_api
  httpApi: {
    introduction: '说明',
    desc: '除了帮助页面，所有URI返回application/json格式的的资源，每个请求都需要HTTP基本认证。默认用户是admin / public。<br/>' +
    'emq_dashboard插件提供了一个Web管理控制台, dashboard有助于监控代理的运行状态，数据统计和MQTT包计数监测。',
    reference: '参考',
    method: '请求方法',
    path: '路径',
    description: '描述',
  },
  // users
  users: {
    newUser: '新建用户',
    editUser: '编辑用户',
    username: '用户名',
    remark: '备注',
    password: '密码',
    confirmPassword: '确认密码',
    oldPassword: '旧密码',
    newPassword: '新密码',
    confirmNewPassword: '确认新密码',
    changePassword: '修改密码',
    dontChangePassword: '不修改密码',
    oper: '操作',
    edit: '编辑',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    confirm: '确定',
    confirmDelete: '确认删除',
    usernameRequired: '请填写用户名',
    remarkRequired: '请填写备注',
    usernameIllegal: '用户名长度非法',
    passwordRequired: '请填写密码',
    newPasswordRequired: '请填写新密码',
    passwordInconsistent: '密码不一致',
    authenticate: '你已成功修改已登录用户密码，请重新登录',
    createUser: '新建用户成功',
  },
  alert: {
    required: '字段是必填项',
    success: '成功',
    failure: '失败',
    connect: '连接',
  },
}
