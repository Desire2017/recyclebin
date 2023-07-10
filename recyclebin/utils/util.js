const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatTimes = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return [hour, minute].map(formatNumber).join(':')
}




const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var apiUrl = 'https://recycle.wxapplet.com/Api/'
var imgUrl = 'https://recycle.wxapplet.com/imgupload/'
var qrcodeUrl = 'https://recycle.wxapplet.com'
var msgApi = 'https://recycle.wxapplet.com/MsgApi/'
module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatTimes: formatTimes,
  apiUrl: apiUrl,
  imgUrl: imgUrl,
  qrcodeUrl: qrcodeUrl,
  msgApi: msgApi
}