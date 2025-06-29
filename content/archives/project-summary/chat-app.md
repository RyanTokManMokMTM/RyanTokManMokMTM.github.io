---
title: "[DONE] Chat App - 2024/04/20"
date: 2023-05-15T13:49:17+08:00
draft: false
description: |
  完整的即時通訊應用程式，支援單聊、群聊、語音/視頻通話
  特色功能：限時動態、貼圖商店、多媒體訊息
  技術棧：SwiftUI + Go-Zero + WebSocket + WebRTC
tags: 
    - ios-app
    - app-dev
categories: 
    - project
author: jackson.tmm
---

[**Chat App - Frontend**](https://github.com/RyanTokManMokMTM/swiftui-chat-app)   
[**Chat App - Backend**](https://github.com/RyanTokManMokMTM/chat-app-server)

![new-ver](/imgs-custom/chat-app/2024-04-20-final.png)

### 簡介
因為之前的`OTT電影社群APP`中有包含通訊的功能，但是那個App所實現的功能就只是簡單的存文字聊天而已，而那個app主要的focus點並不在通訊上，所以只有簡簡單單的實作了通訊，沒有到完整的通訊，例如：發送文字，發送圖片，發送文件等等的通訊功能。所以這次的side project所實作的app則主要focus在**通訊**這個點上。

### 主要功能
Chat-App主要會包含一下之功能  
* 用戶登入/註冊
* 修改用戶資料
* 新增用戶為好友(聊天)
* 刪除用戶
* 新增聊天群
* 加入聊天群
* 退出聊天群
* 修改聊天群資訊(群主特權)
* 查看群資訊
* 查看用戶資訊
* 單聊 - 與已加好友通訊
* 群聊 - 與加入之群組通訊
* 語音通訊(單人)
* 視頻通訊(單人)
---
特別之功能 - 限時動態(24小時動態)
* 限時動態的新增與刪除 
* 好友動態查看 
* 好友動態回覆 
* 限時動態內容多元 
  *  允許文字與多張圖片且可縮放、旋轉、邊界對齊 
* 好友動態新增
  * 點讚
  * 分享動態
  * 查看已看列表，且可留言
* 新增貼圖商店 & 貼圖下載保存於用戶端
* 聊天內容新增 - 貼圖
* 語音通訊(多人)
* 視頻通訊(多人)

### 技術棧/工具
* SwiftUI
* UIKit
* Go-Zero
* MySQL
* Gorm
* Docker
* Websocket
* WebRTC
* ~~K8S~~
* ~~AWS~~


### App 測試影片

#### 開發階段Demo #1
<video src="/videos/chat-app/demo.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #2
<video src="/videos/chat-app/demo1.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #3
<video src="/videos/chat-app/message-update1.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #4
<video src="/videos/chat-app/full-demo-1.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #5
<video src="/videos/chat-app/voice-chat.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #6
<video src="/videos/chat-app/voice-chat.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #7
<video src="/videos/chat-app/instance-story-alignment.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #8
<video src="/videos/chat-app/instance-story-editor.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #9
<video src="/videos/chat-app/instance-story-view.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #10
<video src="/videos/chat-app/sticker-shop.mp4" controls="controls" width="500" height="300"></video> 

#### 開發階段Demo #11
<video src="/videos/chat-app/sticker-demo.mp4" controls="controls" width="500" height="300"></video> 
