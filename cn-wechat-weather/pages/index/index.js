//映射
const weatherMap={
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
//通过映射动态修改背景图片
// const imageMap = {
//   'sunny': '/images/sunny-bg.png',
//   'cloudy': '/images/cloudy-bg.png',
//   'overcast': '/images/overcast-bg.png',
//   'lightrain': '/images/lightrain-bg.png',
//   'heavyrain': '/images/heavyrain-bg.png',
//   'snow': 'snow-bg.png'
// }

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({
  data:{
    nowTemp:'14°',
    nowWeather:'大雨',
    nowWeatherImage:'',
    hourWeather:[]
  },
  onPullDownRefresh:function(){
    //传入回掉函数
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.getNow()
  },
  //传参，参数类型：函数
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '天津市'
      },
      success: res => {
        console.log(res.data)
        let result = res.data.result
        this.setNow(result)
        this.setHourWeather(result)
      },
      complete:()=>{
        //根据传入的函数进行相应操作，传入则执行，不传入不管
        callback && callback()
      }
    })
  },
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      //         nowWeatherImage: imageMap[weather]
      nowWeatherImage: '/images/' + weather + '-bg.png',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourWeather(result){
    //设置预测列表
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    let hourWeather = []
    for (let i = 0; i < 8; i += 1) {
      hourWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourWeather[0].time = '现在'
    this.setData({
      hourWeather: hourWeather
    })
  }
})