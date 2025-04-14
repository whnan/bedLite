"use strict";
const common_vendor = require("./common/vendor.js");
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.wx$1.request({
      url: options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: options.header || {
        "Content-Type": "application/json"
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};
exports.request = request;
