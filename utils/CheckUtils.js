/**
 * Created by deng on 16-3-22.
 * 写一些通用的工具类，可以简化代码结构
 */
exports.ifUndefined=function(value){
  if(value==undefined) {
      return true;
  }else {
      return false;
  }
};
exports.toutiaoUtil=function(value){
    return (value==undefined)?null:value;
};