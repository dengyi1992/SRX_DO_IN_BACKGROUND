/**
 * Created by deng on 16-3-22.
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