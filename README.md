# custom-print-template

## 介绍
自定义卡片并打印的页面模板
使用了vue3、element-plus、jsbarcode、vue-cropperjs

## 构成
- InfoExtract 提取数据的组件
- ItemInfo 组件信息
- ItemInfoImgUpload 用于组件图片上传
- ItemInfoImgUploadCropper 用于组件图片上传后裁剪
- ItemSelect 用于选择组件
- PrintMain 打印及预览

## 使用须知
1. 第一个卡片中所有元素可拖动
2. 选中元素后可以使用方向键移动，delete或backspace删除

## 已知问题
火狐浏览器样式丢失
