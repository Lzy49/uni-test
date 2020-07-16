
// 已经加载过的图片 ( 用来存储本小程序使用该方法加载过的全部图片，方便下次重复加载)
const complete = {} // 已经加载好存好了的图片
const Loading = {} // 已经被加载，还在加载中的 Promise
// 加载单一张图片方法 （内部）
const getImageInfo = (src)=>{
  Loading[src] = new Promise((resolve, reject) => {
    uni.getImageInfo({
      src,
      success: function(e) {
        if (e.errMsg === "getImageInfo:ok") {
          complete[src] = e
          delete Loading[src]
          resolve(e);
        } else {
          reject(e);
        }
      },
      fail: function(e) {
        reject(e);
      }
    });
  });
  return Loading[src]
}
// 加载单张图片
const getImgItem =(imgSrc)=>{
  return new Promise( async (resolve, reject) => {
    if(complete[imgSrc] !== undefined){ // 图已经加载进来了
      resolve(complete[imgSrc])
    } else if(Loading[imgSrc] !== undefined){ // 图在以前加载过还在加载中
      resolve(Loading[imgSrc])
    } else { // 图是新图需要重新加载
      resolve( await getImageInfo(imgSrc))
    }
  })
}
// 加载多张图片
const getImgAll = (imgSrcArr)=>{
  return new Promise((resolve, reject)=>{
    const completeImg = {}
    Promise.all(
      imgSrcArr.map(item => getImgItem(item))
    ).then((imageInfos) => {
      resolve(imageInfos)
    }).catch((e)=>{
      reject(e)
    })
  })
}
// 获取当前已经缓存过的图片合集
const getComplete = ()=>{
  return complete
}
export {
  getComplete,
  getImgItem, // 返回一个 Promise 成功值为单个图片的info （ 传入 String）
  getImgAll, // 返回一个 Promise 成功值为 key 为 图片路径的多info obj （ 传入 多 String []）
}