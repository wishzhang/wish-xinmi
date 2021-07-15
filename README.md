# 信迷



## 构想

一个将专业和生活联系在一起的社交APP。



## 版本功能

### V 1.0

#### 登录模块

<img width="480px" height="auto" src="https://github.com/wishzhang/wish-xinmi/blob/master/wish-xinmi-docs/img/app_5.jpg" style="zoom:25%;" />

- 仅支持邮箱注册
- 支持信迷号、邮箱两种登录方式
- 支持通过邮箱找回密码
- 支持默认显示上一次登录方式界面
- 查看相关协议



#### 联系人模块

<img width="480px" height="auto" src="https://github.com/wishzhang/wish-xinmi/blob/master/wish-xinmi-docs/img/app_8.jpg" style="zoom:25%;" />

- 支持添加所有的信迷用户为联系人
- 支持提醒待确认联系人数量
- 支持删除联系人，删除联系人后对应的联系人记录硬删除，其他的软删除



#### 消息模块

<img width="480px" height="auto" src="https://github.com/wishzhang/wish-xinmi/blob/master/wish-xinmi-docs/img/app_1.jpg" style="zoom:25%;" />

- 联系人之间才可以互相发送消息
- 支持发送消息提醒
- 支持查看接收到的消息列表



#### 想法模块

<img width="480px" height="auto" src="https://github.com/wishzhang/wish-xinmi/blob/master/wish-xinmi-docs/img/app_3.jpg" style="zoom:25%;" />

- 支持信迷用户发表想法
- 内容支持文字+图片
- 用户可查看自己发表的想法
- 用户可查看对应联系人发表的所有想法
- 用户可查看所有联系人的最新想法列表



#### 我的模块

<img width="480px" height="auto" src="https://github.com/wishzhang/wish-xinmi/blob/master/wish-xinmi-docs/img/app_4.jpg" style="zoom:25%;" />

- 支持修改邮箱
- 支持修改密码



## 涉及的技术

前端：

- vue2

- uni-app项目

后端：

- Node.js
- Koa

- TypeScript
- Mysql
- minio



## 本地启动项目



启动前端uni-app项目（不支持小程序）：

1. 用HBuilder开发工具打开wish-xinmi-uniapp-client项目
2. 修改App.vue里的接口路径、IP变量
3. 点击开发工具上的运行到Chrome或者运行到手机或模拟器



启动后端node项目：

1. 配置mysql5.7版本，注意不能使用8.0版本噢

1. 使用webstorm打开wish-xinmi-nodets-server项目
2. 配置服务端IP
3. 在控制台运行npm start



如果后端node项目启动成功，会自动创建数据库及所有数据表，可以打开页面尝试注册登录。

登录进去后发现图片获取失败，是因为还需要安装[minio](http://docs.minio.org.cn/docs)，安装完启动minio。



到这来项目就成功启动啦！



启动项目的过程可能会遇到各种问题，可以直接进QQ群提问噢(650297618)









