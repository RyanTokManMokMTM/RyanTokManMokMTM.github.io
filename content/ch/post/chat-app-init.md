---
title: "[開發日記] 聊天通訊APP(一) - 序章"
date: 2023-04-19T17:08:14+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

因為之前的`OTT電影社群APP`中有包含通訊的功能，但是那個App所實現的功能就只是簡單的存文字聊天而已，而那個app主要的focus點並不在通訊上，所以只有簡簡單單的實作了通訊，沒有到完整的通訊，例如：發送文字，發送圖片，發送文件等等的通訊功能。所以這次的side project所實作的app則主要focus在**通訊**這個點上。

這次的聊天通訊App主要會包含一下之功能  
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
* 語音通訊(暫定)
* 視頻通訊(暫定)
---
特別之功能 - 限時動態(24小時動態)
* 限時動態的新增與刪除
* 好友動態查看
* 好友動態回覆

### app 截圖
![chat-app-screen](/images/chat-app/screenshot.png)

### 階段性Demo
<video src="/videos/chat-app/demo.mp4" controls="controls" width="500" height="300"></video> 

<video src="/videos/chat-app/demo1.mp4" controls="controls" width="500" height="300"></video> 

### 進度
**完成**
- 用戶登入/註冊
- 好友添加/移除
- 好友查詢
- 建立群組
- 單聊/群聊
- 發布/移除個人限時動態
- 查看好友限時動態
- 限時動態留言
- 離線消息推送(上線時推送
  
**通訊功能**
- 發送文字
- 發送圖片
- 發送文件(doc,pdf,ppt,etc)
- 發送限動回覆

**待修復(發現問題)**
- 限動留言聊天室資訊錯誤(發送方)
- refresh 功能缺失
- 限動錯誤/提醒(限動不存在,已發送留言等)