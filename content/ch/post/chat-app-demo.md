---
title: "[開發者日記] 聊天通訊APP(二) - Demo"
date: 2023-04-24T12:24:38+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

這篇文章主要是展示一下整個App的Demo，廢話不多說，先上視頻:  
<video src="/videos/chat-app/full-demo-1.mp4" controls="controls" width="500" height="300"></video> 

### Demo說明
這個App的詳細介紹在[[開發者日記] 聊天通訊APP(一)](/post/project-chatapp-state_1)中已經有基本的介紹，這裡就不作過多的介紹了。  
這裡主要是說明一下以上Demo中所展示的內容：
* 用戶登入和註冊
* 用戶資訊修改，包括上傳Avatar, Cover, 修改Status Message等
* 新增好友
* 給好友發訊息，另外一方如果上線則會即時收到訊息,否則會視為離線消息保存，待用戶上線後再發送。
* 建立用戶群組
* 加入用戶群組
* 查找群組
* 群組通訊,只有加入了群組的使用者才能收到訊息
* 單人聊天，其中一方為好友即可發送訊息，無須都戶為好友
* 發布個人動態到限時動態，只有加了好友者才能觀看
* 下拉刷新更新好友動態
* 給動態留言，並透過socket發送給特定之用戶

[Backend Github](https://github.com/RyanTokManMokMTM/chat-app-server)  
[IOS Client Github](https://github.com/RyanTokManMokMTM/swiftui-chat-app)