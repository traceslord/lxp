## 微信小程序 - 视频课

### 项目介绍
视频课小程序，在小程序中实现极客视频资源的观看。

### 教学目标
1. 微信小程序开发规范 eslint 接入
2. 微信小程序开发规范 commitlint 接入
3. 微信小程序开发数据流动规范 Service

### 前置技能
- HTML
- CSS
- JavaScript 初阶
- 微信小程序

### 学习周期
60 min

### 项目解析
通过视频课小程序，了解极客在微信小程序的开发规范。例如：要工程化、数据流。

### 任务步骤
#### 任务 1：新建项目
> 使用微信小程序模块构建基础框架（ 开发模式：小程序 ）

![image.png](https://assets.jiker.com/_for_common_project/2021/1213/admin/Mij87B7r9GgHnxUS6KnFKSgg3PbIxpa1RFGSCQOD.png)

#### 任务 2：文件迁移
> 把开发目录迁移到 miniprogram 文件夹中 （ 除了 project.config.js ）
1. 进入微信小程序根目录
2. 在根目录中创建文 miniprogram 文件夹
3. 把所有文件迁移到 miniprogram 目录中（ 除了 project.config.js ）
4. 修改 project.config.js 文件，添加 miniprogramRoot 属性，并配置值为 ./miniprogram

``` JavaScript
{
	"miniprogramRoot": "miniprogram/",
	"description": "项目配置文件",
	"packOptions": {
		"ignore": []
	},
  ...
}
```

结构如下：

``` JavaScript
.
├── miniprogram
│   ├── app.js
│   ├── app.json
│   ├── app.wxss
│   ├── pages
│   │   ├── index
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   └── logs
│   │       ├── logs.js
│   │       ├── logs.json
│   │       ├── logs.wxml
│   │       └── logs.wxss
│   ├── sitemap.json
│   └── utils
│       └── util.js
└── project.config.json
```

#### 任务 3：工程规范
> 配置 commitlint eslint
1. npm init
2. yarn add -D @commitlint/{cli,config-conventional} husky
3. yarn add -D eslint eslint-plugin-json eslint-config-prettier eslint-plugin-prettier prettier
4. 配置 commitlint.config.js
5. 配置 .eslintrc.js
6. 配置 .eslintignore
7. 配置 package.json
8. 配置 .gitignore

*commitlint.config.js*
``` JavaScript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

*.eslintrc.js*
``` JavaScript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  "globals": {
    'window': true,
    'document': true,
    'App': true,
    'Page': true,
    'Component': true,
    'Behavior': true,
    'wx': true,
    'worker': true,
    'getApp': true,
    'regeneratorRuntime': true,
    'getCurrentPages': true
  },
  extends: [
    "eslint:recommended", 
    "plugin:json/recommended", 
    "plugin:prettier/recommended"
  ],
  rules: {
    "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
    "no-console": "error",
    "no-debugger": "error"
  },
  parserOptions: {
    "ecmaVersion": 8,
    "sourceType": "module",
    "allowImportExportEverywhere": true
  }
};
```

*.eslintignore*
``` Bash
// .eslintignore
node_modules/*
miniprogram/libs/*
```

*package.json*
``` Json
// package.json
{
  "scripts": {
    "lint": "eslint 'miniprogram/**/*.js' --fix"
  },
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
      "pre-commit": "npm run lint"
    }
  }
}
```

*.gitignore*
``` Bash
node_modules
```

#### 任务 4：请求流程
> 配置 request、service , 请求课程数据

1. 创建 miniprogram/globals/request/api.js 用于存放 API
2. 创建 miniprogram/globals/request/wxrequest.js 用于封装微信内置请求为 promise 形式
3. 创建 miniprogram/globals/service/course.js 用于封装课程相关数据

*miniprogram/globals/request/api.js*
``` JavaScript
const MODE = "devlopment";
// const MODE = 'production';
const VERSION = "V0.0.1";
const PRODUCTION_APPID = 7;
const PRODUCTION_PREFIX = "https://course.jiker.com";
const DEVELOPMENT_PREFIX = "https://course.jiker.vip";
const PREFIX = MODE === "production" ? PRODUCTION_PREFIX : DEVELOPMENT_PREFIX;
export default {
  MODE,
  version: VERSION,
  app_id: PRODUCTION_APPID,
  courseIndex: `${PREFIX}/api/miniprogram/course`,
  category: `${PREFIX}/api/miniprogram/course/category`,
  courseSearch: `${PREFIX}/api/miniprogram/course/search`,
  courseItem: id => `${PREFIX}/api/miniprogram/course/${id}`
};
```

*miniprogram/globals/request/wxrequest.js*
``` JavaScript
import API from "./api.js";

const errorMessage = (error_code, message, successCallback) => {
  wx.showModal({
    title: String(error_code),
    content: message,
    confirmText: "确定",
    showCancel: false,
    success: res => {
      successCallback &&
        typeof successCallback === "function" &&
        successCallback();
    }
  });
};

const interceptorsRequest = (method, url, data, header = {}) => {
  let params = { method, url, data, header };
  let userInfoKey = `${API.MODE}_userInfo`;
  let storageUserInfo = wx.getStorageSync(userInfoKey);
  if (storageUserInfo) {
    header["Authorization"] = `Bearer ${storageUserInfo.token}`;
  }
  return params;
};

const request = (method, url, data, header) => {
  let params = interceptorsRequest(method, url, data, header);
  return new Promise((resolve, reject) => {
    wx.request({
      method,
      url: params.url,
      header: params.header,
      data: params.data,
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.error_code) {
            const message = res.data.msg || res.data.message;
            errorMessage("提示", message);
            reject(res.data);
          } else {
            if (res.data.data) {
              resolve(res.data.data);
            } else {
              resolve(res.data);
            }
          }
        } else if (res.statusCode === 401) {
          errorMessage("登录过期", "请重新登录", () => {
            wx.reLaunch({ url: "/pages/index/index" });
          });
          wx.clearStorageSync();
          reject(res.data);
        } else {
          wx.clearStorageSync();
          reject(res.data.message);
          errorMessage(res.statusCode, res.data.message);
        }
      },
      fail: err => {
        wx.showModal({
          title: "网络",
          content: "网络出现问题，请检查网络是否连接畅通！",
          confirmText: "确定",
          showCancel: false
        });
        reject(err);
      }
    });
  });
};

/* [请求库]
 ** @params url         { string }   @default => '' [接口地址，统一在 api 文件中]
 ** @params data/params { object }   @default => {} [发送数据]
 ** @params header      { object }   @default => {} [请求 Header 配置]
 */

export default {
  post: function(url = "", data = {}, header = {}) {
    return request("POST", url, data, header);
  },
  put: function(url = "", data = {}, header = {}) {
    return request("PUT", url, data, header);
  },
  get: function(url, data = {}, header = {}) {
    return request("GET", url, data, header);
  },
  delete: function(url = "", data = {}, header = {}) {
    return request("DELETE", url, header);
  }
};
```

*miniprogram/globals/service/course.js*
``` JavaScript
import wxRequest from "./../request/wxrequest.js";
import API from "./../request/api.js";

export default {
  index(params = {}) {
    return wxRequest.get(API.courseIndex, params);
  },
  item(id) {
    return wxRequest.get(API.courseItem(id));
  },
  category(params = {}) {
    return wxRequest.get(API.category, params);
  },
  search(params = {}) {
    return wxRequest.get(API.courseSearch, params);
  }
};
```

#### 任务 5：课程渲染
> 首页完成渲染课程列表
1. 编辑 index.js 业务逻辑
2. 编辑 index.wxml 业务结构
3. 编辑 index.wxss 业务样式
4. 删除 app.wxss 公共样式

*index.js*
``` JavaScript
import courseService from "../../globals/service/course.js";

Page({
  data: {
    total: 0,
    page: 1,
    page_size: 12,
    courses: [],
  },
  onShow: function() {
    this.getData();
  },
  getData: function() {
    const params = {
      page: this.data.page,
      page_size: this.data.page_size,
    };
    courseService.index(params)
      .then( res => {
        this.setData({
          courses: res.list
        })
    })
  },
  onShareAppMessage: function() {
    return {
      title: "视频课",
      path: "/pages/index/index"
    };
  }
});
```

*index.wxml*
``` Html
<view class="page-container">
  <view class="course-section">
    <view class="course-list">
      <view class="course-item" wx:for="{{ courses }}" wx:key="index"
        hover-class="course-item-hover" data-id="{{item.id}}" bindtap="goToCourseDetail">
        <view class="course-item-top">
          <image class="course-cover" src="{{item.cover_url}}" lazy-load mode="aspectFill"></image>
          <view class="course-status-label" wx:if="{{item.status_label}}">
            {{item.status_label}}
          </view>
        </view>
        <view class="course-item-bottom">
          <view class="course-name">
            {{item.name}}
          </view>
          <view class="course-introduction">
            {{item.introduction}}
          </view>
          <view class="course-message">
            {{item.total_duration}}
            <span class="divider"></span>
            {{item.contents_children_count}}课时
          </view>
          <view class="course-price-content">
            <span class="course-price-label">￥</span>
            <span class="course-price-current">{{ item.current_price }}</span>
            <span class="course-price-original">￥{{ item.original_price }}</span>
          </view>
        </view>
      </view>
    </view>
  </view>
</view>
```

*index.wxss*
``` css
.page-container{
  padding-top: 12rpx;
  padding: 12rpx 0;
  display: flex;
  flex-direction: column;
}
.count-section{
  padding: 30rpx 30rpx;
  text-align: center;
}

.course-list{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding:0 30rpx;
}

.course-item {
  position: relative;
  width: 335rpx;
  margin-bottom: 20rpx;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgba(214, 214, 214, 0.5);
}

.course-item-hover {
  opacity: 0.8;
}

.course-item-top {
  width: 100%;
  height: 192rpx;
  position: relative;
}

.course-item-top .course-cover {
  width: 100%;
  height: 100%;
}

.course-item-top .course-level-label {
  position: absolute;
  width: 36px;
  top: 0px;
  right: 8px;
}
.course-item-top .course-status-label {
  position: absolute;
  width: 35px;
  top: 0px;
  left: 0px;
  height: 21px;
  background: rgba(15, 199, 0, 1);
  border-radius: 0px 0px 10px 0px;
  font-size: 10px;
  color: #fff;
  line-height: 21px;
  text-align: center;
}

.course-item-bottom {
  padding: 20rpx 14rpx 28rpx 24rpx;
}

.course-item-bottom .course-name {
  font-size: 24rpx;
  line-height: 34rpx;
  height: 68rpx;
  color: #333;
  margin-bottom: 4rpx;
  font-weight: bold;
  font-family: PingFangSC-Semibold;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.course-item-bottom .course-introduction {
  font-size: 20rpx;
  color: #666;
  line-height: 24rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.course-item-bottom .course-message {
  height: 24rpx;
  line-height: 24rpx;
  margin: 16rpx 0;
  font-size: 20rpx;
  display: flex;
  width: 100%;
  color: #999;
  align-items: center;
}
.course-message .course-duration-icon {
  width: 20rpx;
  height: 24rpx;
  margin-right: 8rpx;
}

.course-message >.divider {
  margin: 0 10rpx;
}

.course-price-content{
 font-size: 20rpx;
 color: #FF4000;
}
.course-price-content .course-price-label{
  font-size: 20rpx;
}
.course-price-content .course-price-current{
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  font-size: 28rpx;
}
.course-price-content .course-price-original{
  color: #999;
  margin-left: 12rpx;
  text-decoration-line: line-through;
}
```
