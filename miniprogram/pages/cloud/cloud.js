// miniprogram/pages/index.js
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[]
  },
  // 增
  insert:function(){
    // 箭头函数
    // db.collection('user').add({
    //   data:{
    //     name:'jerry',
    //     age:20
    //   },
    //   success:res => {
    //     console.log(res)
    //   },
    //   fail:err => {
    //     console.log(err)
    //   }
    // })

    // promise
    db.collection('user').add({
      data:{
        name:'jack',
        age:18
      },
    }).then(res => {
      console.log(res)
    }).catch(err =>{
      console.log(err)
    })
  },
  //删
  del:function(){
    db.collection('user').doc('42d70ff05e8d83fe005c748e631c023b')
    .remove()
    .then(res =>{
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
  },

  //改
  update:function(){
    db.collection('user').doc('dc65fe3e5e8d8203004f44557604e329').update({
      data:{
        name:'suwan',
        age:1000
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  
  //查
  search:function(){
    db.collection('user').where({
      name:"lpp"
    }).get().then(res =>{
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  // 调用sum云函数
  sum:function(){
    wx.cloud.callFunction({
      name:'sum',
      data:{
        a:2,
        b:3
      }
    }).then(res =>{
      console.log(res)
    }).catch(err =>{
      console.log(err)
    })
  },

   // 获取用户的OpenId 
  getOpenId:function(){
    wx.cloud.callFunction({
      name:'login'
    }).then(res =>{
      console.log(res)
    }).catch(err =>{
      console.log(err)
    })
  },

  //批量删除数据
  batchDelete:function(){
    wx.cloud.callFunction({
      name:'batchDelete'
    }).then(res =>{
      console.log(res)
    }).catch(err =>{
      console.log(err)
    })
  },

  //上传图片
  upload:function(){
    //选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.png',
          filePath:tempFilePaths[0],
          success:res =>{
            // 返回文件ID
            console.log(res.fileID)

            //存进云数据库汇总
            db.collection('image').add({
              data:{
                fileID:res.fileID
              }
            }).then(res =>{
              console.log(res)
            }).catch(err =>{
              console.log(err)
            })

          },
          fail:console.error
        })
      }
    })
  },

  //展示图片
  getFile:function(){
    wx.cloud.callFunction({
      name:'login'
    }).then(res =>{
    db.collection('image').where({
      _openid:res.result._openid
    }).get().then(res2 =>{
      console.log(res2);
      this.setData({
        images:res2.data
      })
    }) 
    })
  },

  //文件下载
  downloadFile:function(e){
    console.log(e.target.dataset.fileid)
    wx.cloud.downloadFile({
      fileID:e.target.dataset.fileid,//文件ID
      success:res =>{
        console.log(res.tempFilePath)
        // 保存图片到手机相册
        wx.saveImageToPhotosAlbum({
          filePath:res.tempFilePath,
          success(res){
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      },
      fail:console.error
    })
    
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})