"use strict";
const common_vendor = require("../common/vendor.js");
const getNavInfo = () => {
  let navInfo = common_vendor.index.getStorageSync("navInfo");
  const top = navInfo.top + "px";
  const height = navInfo.height + "px";
  const width = navInfo.width + "px";
  const right = navInfo.right + "px";
  const bottom = navInfo.bottom + "px";
  const left = navInfo.left + "px";
  const setViewHeight = navInfo.top + navInfo.height + 10 + "px";
  return {
    top,
    height,
    width,
    right,
    bottom,
    left,
    setViewHeight
  };
};
exports.getNavInfo = getNavInfo;
