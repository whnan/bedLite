// ./request.js
export const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data); // 成功时返回数据
        } else {
          reject(res); // 返回错误信息
        }
      },
      fail: (err) => {
        reject(err); // 网络请求失败
      }
    });
  });
};
