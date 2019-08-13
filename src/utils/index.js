function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

// 经纬度算距离
export function space(lat1, lng1, lat2, lng2) {
  console.log(lat1, lng1, lat2, lng2)
  var radLat1 = lat1 * Math.PI / 180.0
  var radLat2 = lat2 * Math.PI / 180.0
  var a = radLat1 - radLat2
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
  s = s * 6378.137
  s = Math.round(s * 10000) / 10000
  return s  // 单位千米
}

export function formatTime(date,type) {
  console.log('formatTime',date)
  typeof date == 'number'?date=new Date(date): null;
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')
  if (type=='day') {
    return `${t1}`
  } else {
    return `${t1} ${t2}`
  }
}

// 格式化倒计时
export function getQueryString(url) {
  console.log(100001)
  if(url) { 
      url=url.substr(url.indexOf("?")+1); //字符串截取，比我之前的split()方法效率高 
  } 
  console.log(100002) 
  var result = {}, //创建一个对象，用于存name，和value 
  queryString =url || location.search.substring(1), //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。 
  re = /([^&=]+)=([^&]*)/g, //正则，具体不会用 
  m; 
  console.log(100003) 
  while (m = re.exec(queryString)) { //exec()正则表达式的匹配，具体不会用 
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码 
  } 
  console.log(100004) 
  return result; 
}

// 格式化倒计时
export function formatTimeout(timestamp) {
  let min = Math.floor(timestamp/1000/60%60),
      sec = Math.floor(timestamp/1000%60);

  if (min ==0 && sec == 0){
    return `结:束`
  }else{
    return `${formatNumber(min)}:${formatNumber(sec)}`;
  }
}

// 登陆改成Promise
export function getCode(){
  return new Promise((resolve, reject)=>{
    wx.login({
      success: res => {
        console.log('获取code成功',res)
        resolve(res.code);
      },
    })
  })
}

// 下载图片改成Promise
export function downFile(url){
  return new Promise((resolve, reject)=>{
    wx.downloadFile({
      url,
      success: function (res) {
        console.log('微信下载图片完成',res)
        resolve(res.tempFilePath);
      }
    })
  })
}

// 获取图片信息
export function wxGetImgInfo(src){
  return new Promise((resolve, reject)=>{
    wx.getImageInfo({
      src,
      success: function (res) {
        resolve(res);
      }
    })
  })
}

/**
 * 通用授权逻辑
 * @export
 * @param {*} scope 权限信息
 * @param {*} callback 授权成功回调
 */
export function getAuth(scope, callback, showTip = true) {
  wx.getSetting({
    success: res => {
      // 如果已授权
      console.log('获取授权情况',res)
      if (res.authSetting[scope]) {
        callback();
      } else {
        console.log('没有授权')
        callback('noScope')
        // showTip && wx.authorize({
        //   scope,
        //   success: callback,
        //   fail: () => {
        //     wx.showModal({
        //       title: '亲爱的用户', //提示的标题,
        //       content: '同意我们的授权，让我们为你提供更加优质的服务', //提示的内容,
        //       showCancel: false, //是否显示取消按钮,
        //       confirmText: '去设置', //确定按钮的文字，默认为取消，最多 4 个字符,
        //       confirmColor: '#3CC51F', //确定按钮的文字颜色
        //       success: res => {
        //         wx.openSetting()
        //       }
        //     })
        //   }
        // })
      }
    }
  })
}
export default {
  formatNumber,
  formatTime
}
