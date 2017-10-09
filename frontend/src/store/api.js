import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false });


const baseURL = '/api/v2'

function httpRequest() {
  NProgress.start()
  const config = {
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }

  const user = JSON.parse(sessionStorage.getItem('user')) ||
   JSON.parse(localStorage.getItem('user'))

  if (user && user.token) {
    config.auth = {
      username: user.token,
      password: '',
    }
  }

  // const user = JSON.parse(sessionStorage.getItem('user')) ||
  //   JSON.parse(localStorage.getItem('user'))

  if (user && user.password) {
    config.auth = {
      username: user.username,
      password: user.password,
    }
  }
  return axios.create(config)
}

function handleError(error) {
  NProgress.done()
  if (error.response.status === 401) {
    // token 无效的情况
    window.location.href = '/login'
  } else {
    console.log('Net work error ')
  }
  return Promise.reject(error)
}

function httpGet(url, config) {
  return httpRequest().get(url, config).then((response) => {
    NProgress.done()
    return response
  }).catch(handleError)
}

function httpPut(url, data, config = {}) {
  const jsonData = JSON.stringify(data)
  return httpRequest().put(url, jsonData, ...config).then((response) => {
    NProgress.done()
    return response
  }).catch(handleError)
}

function httpPost(url, data, config = {}) {
  const jsonData = JSON.stringify(data)
  return httpRequest().post(url, jsonData, ...config).then((response) => {
    NProgress.done()
    return response
  }).catch(handleError)
}

function httpDelete(url, config = {}) {
  return httpRequest().delete(url, config).then((response) => {
    NProgress.done()
    return response
  }).catch(handleError)
}

export { baseURL, httpGet, httpPut, httpPost, httpDelete }
