---
title: "[開發者日記] 聊天通訊APP - 小更新"
date: 2023-05-13T23:58:58+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project 
---

#### 簡介
我在[[開發者日記] 聊天通訊APP(一)](/post/chat-app-init)中有提及過這app會有
* 語音通訊
* 視頻通訊 - 待完成

這次他們真的來了！！廢話少說先看視頻  
<video src="/videos/chat-app/voice-chat.mp4" controls="controls" width="500" height="300"></video> 

#### 說明
雖然現在只有展示了語音通訊(Voice-chat),但是他們的工作原理其實是差不多的，就差在有沒有傳送視頻數據而已。老實說，這個功能其實言研究了2個月都不知道要從何入手，而github上的simple-demo又是UIKit的版本，所以就一直拖，一直研究。知道最近就想試試也無妨，最多也就不成功，萬一它成功了呢！於是我便開始寫，寫了1-2天，發現失敗了，哈哈哈。然後debug了一下，發現好像是沒有連接上的問題，於是又花了一整天來測試是否有成功連接，當成功連接上且文字數據傳送成功的那一刻，那個激動的心啊❤️！！！然後打開視訊，還真的成功了！！！！好開心！  

而我這裡用到是WebRTC這個框架。根據網絡上的文章以及我的理解說：要使用P2P連結，就要先繞過NAT，知道自己的Public IP，並通過STUN/TRUN Server來操作！哪這裡我是怎麼做的呢？
* 首先，要先跟另外一方交換SDP(Session Description Protocal),這裡的資訊包括很多，例如攝像機的sepc，解碼的資訊等等，有興趣可以自行google！而這裡我是透過Websocket 進行交換的。發起人發送offer的SDP，而接收人返回answer的SDP。這樣設備的資訊就交換完成了
* 接下來就是交換IP和進行連結,這邊我是有過google的public 的ICEServer，並把Ice Server 返回回來的candidate資訊也交換一樣，然後就可以建立P2P連結了！

以上便是解決這個問題的心得，如果之後還有什麼心得，會繼續更新！
