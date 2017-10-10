const jsonServer = require('json-server')
const server = jsonServer.create()
const dbFile = require('./db.js');
const router = jsonServer.router(dbFile)
const middlewares = jsonServer.defaults()


server.use(middlewares)

server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/monitoring/nodes': '/monitoring_nodes',
  '/management/nodes': '/management_nodes'
}))


server.use(jsonServer.bodyParser)
server.use('/auth', (req, res, next) => {
  if (req.method === 'POST') {
    const password = req.body.password
    if (password === 'public') {
      res.jsonp({ status: 'success' })
    } else {
      res.jsonp({ status: 'error' })
    }
  }
})


server.use(router)
server.listen(3001, function () {
  console.log('JSON Server is running')
})
