---
title: "[Side-Project] Movie App"
date: 2022-12-10T15:45:56+08:00
draft: false
description: |
  電影社群應用程式，整合OTT資源搜尋與社群討論
  解決電影資源分散問題，提供合法OTT平台連結
  技術棧：SwiftUI + Go-Zero + MySQL + AWS + K8S
tags: 
    - ios-app
    - app-dev
categories: 
    - project
author: jackson.tmm
---

[**Movie App - Frontend**](https://github.com/RyanTokManMokMTM/MovieAppSwiftUI.git)   
[**Movie App - Backend**](https://github.com/RyanTokManMokMTM/movie-server)

![client](/imgs-custom/ott_app/movie-app/AppImg.png)

### 簡介
開發這個App的目的主要是為了解決在搜尋電影OTT資源以及電影內容討論分散在多個不同平台等問題，如:搜尋到的資源是無效/不合法的，花費大量時間在搜尋上等等...。因此這個App主要分成2個組成部分，分別是電影資訊搜尋獲取OTT資源，並整合不同OTT平台的電影資源，供用戶選擇合法資源，並過濾無效資源以及電影分享社群，供用戶在觀看完電影後，直接在App中發佈相關文章以分享給其他用戶，而無需在不同平台發佈。

### 主要功能
* 用戶基本功能(登入/登出/修改資料等)
* 提供海量電影資源供用戶查閱(約100w+)
* 提供用戶點讚電影以及收藏電影
* 提供有效電影的OTT資源(如:Netfilx,Disney+,YoutubeTV等)
* 提供社群平台讓用戶發佈電影文章，對其他用戶的文章點讚,留言,回復留言等社群功能
* 提供用戶瀏覽其他用戶個人資訊(如:發佈之文章,點讚的電影,以及個人收藏的專輯)
* 用戶可與相互為朋友的用戶進行簡單文字交流,分享更多資訊
* 分享App文章到社交媒體(如: Instagram)


### 技術棧/工具
* SwiftUI
* UIKit
* Comebine
* Go-Zero
* MySQL
* Gorm
* Docker
* Websocket
* CI/CD Pipeline (Github Action + AWS CodeDeploy)
* TMDB - 電影數據來源處
* K8S
* AWS



### App 測試影片

#### 階段性測試
<video src="/videos/ott-app.mov" controls="controls" width="500" height="300"></video> 

#### 最新版本
<video src="/videos/final-version.mp4" controls="controls" width="500" height="300"></video> 