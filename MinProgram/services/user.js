/**
 * 用户服务
 *@class UserService
 *@constructor
 */
class UserService {
  /**
   * 构造函数
   */
  constructor() {}

  // 发送openid进行认证
  auth() {
    wx.BaaS.auth.getCurrentUser().then(user => {

      let stu_id = wx.getStorageSync("account").username
      if (stu_id == undefined || stu_id == null) {
        stu_id = ""
      }
      let form = {
        // stu_id: stu_id,
        minapp_id: user.user_id,
        open_id: user.openid,
        union_id: user.unionid,
        avatar: user.avatar,
        nickname: user.nickname,
        city: user.city,
        province: user.province,
        country: user.country,
        gender: user.gender,
        language: user.language,
        phone: user._phone,
      }
      wx.$ajax({
          url: wx.$param.server["prest"] + "/auth",
          // url: "http://localhost:9000/api/v1/auth",
          method: "post",
          showErr: false,
          data: form,
          header: {
            "content-type": "application/json"
          }
        })
        .then(res => {
          console.log("auth", res)
          if (res.data.open_id == user.openid) {
            wx.setStorage({
              key: 'gzhupi_user',
              data: res.data,
            })
          }
        }).catch(err=>{
          console.log(err)
        })
    }).catch(err => {
      if (err.code === 604) {
        console.log('用户未登录，发送auth请求失败')
      }
    })

  }

  // getLevelList(successCallback) {
  //   db.collection('level')
  //     .get()
  //     .then(res => {
  //       console.log(res)
  //       //回调函数处理数据查询结果
  //       typeof successCallback == "function" && successCallback(res.data)
  //     })
  //     .catch(err => {
  //       console.log(err) //跳转出错页面
  //       wx.redirectTo({
  //         url: '../../errorpage/errorpage'
  //       })
  //       console.error(err)
  //     })
  // }

  update() {

    wx.BaaS.auth.getCurrentUser().then(user => {
      // console.log(user)
      let stu_id = wx.getStorageSync("account").username
      if (stu_id == undefined || stu_id == null) {
        stu_id = ""
      }
      let form = {
        stu_id: stu_id,
        minapp_id: user.user_id,
        open_id: user.openid,
        union_id: user.unionid,
        avatar: user.avatar,
        nickname: user.nickname,
        city: user.city,
        country: user.country,
        gender: user.gender,
        language: user.language,
        phone: user._phone,
      }
      wx.$ajax({
          url: wx.$param.server["prest"] + wx.$param.server["scheme"] + "/t_user",
          method: "put",
          data: form,
          showErr: false,
          header: {
            "content-type": "application/json"
          }
        })
        .then(res => {
          console.log(res)
        })

    }).catch(err => {
      if (err.code === 604) {
        console.log('用户未登录，发送user.update_create请求失败')
      }
    })
  }

  // 绑定公众号openid
  bind_mp(mp_id) {
    if (!mp_id) {
      console.error("mp_id length is not 28 " + mp_id)
      return
    }
    wx.$ajax({
        url: wx.$param.server["prest"] + "/auth?type=bind_mp&mp_open-id=" + mp_id,
        url: "http://localhost:9000/api/v1/auth?type=bind_mp&mp_open-id=" + mp_id,
        method: "post",
        data: {},
      })
      .then(res => {
        console.log(res)
      })
  }

}

export default UserService