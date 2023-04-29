---
title: "[開發者日記] 聊天通訊APP(三) - 聊天小更新"
date: 2023-04-29T20:17:18+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

廢話少說直接上影片   

<video src="/videos/chat-app/message-update1.mp4" controls="controls" width="500"></video> 

對上一次的[demo](/post/chat-app-demo/)中，雖然也包含了個人聊天和群組聊天的部分，但是只支援普通文本和圖片的傳送，而這次修復了文件發送，音頻發送已經視頻發送的部分。而音頻可以直接聆聽接收到的音頻，而視頻則可以直接觀看。  
除此之外還添加了系統資訊，例如：群組的建立，群組加入，群組退出並通知群組人員。

#### 更新 - 聊天
* 支援文本，圖片，音頻，文件，視頻
* 群組系統通知

#### 實作方法:
- 文本 ： 這個就比較簡單，就直接講發送文本設置到`content` field，透過Websocket發送即可。
- 圖片 ： 這個就不能直接發送了(也是可以直接發送，但是這樣`content`就會超大，你們猜猜用什麼方法，哈哈哈)。這邊我是透過先將圖片上傳到server，並將上傳API回傳的`path`，透過websocket發送。
- 文件，音頻，視頻：這個也是跟圖片發送相似，透過先上傳，再websocket發送。