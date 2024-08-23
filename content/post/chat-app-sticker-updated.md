---
title: "[開發者日記] 聊天通訊APP - 貼圖更新(I)"
date: 2023-05-24T21:32:47+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

## 簡介
關於這個專案我就不多說了，如果你對這個專案有興趣的話，請看我之前的貼文。在之前的文章中，我已經詳細介紹了這個專案。
[ChatApp(I)](/post/chat-app-init/)  
[ChatApp(II)](/post/chat-app-demo/)  
[ChatApp(III)](/post/chat-app-update/)  
[ChatApp(IV)](/post/chat-app-final/)  
[ChatApp(V)](/post/chat-app-voice-chat/)  

<video src="/videos/chat-app/sticker-demo.mp4" controls="controls" width="500"></video> 

在demo影片中，您可以看到貼圖功能與網路上任何其他即時通訊應用程式類似。用戶能夠存取我們提供的所有可用貼圖並將其發送給其他用戶或群組。但問題是我們如何提供使用者貼圖資源，貼圖從哪裡來呢？  
為了解決第一個問題，我們可以透過在客戶端或使用者能夠存取它之前將所有必要的圖像上傳到伺服器來建立貼圖資源。每個建立的貼圖資源都會被分配一個唯一的ID作為其貼圖ID。與相同貼圖ID相關的所有資源都將以標準化格式重新命名，以便於存取。 `stickerID_index.format`。


我設計了 2 個用於創建和獲取貼圖的api。  
> POST /api/v1/sticker -> 建立一組貼圖並將所有相關貼圖上傳到伺服器
> GET /api/v1/sticker/:id -> 取得給定id的相關貼圖資源

為了解決第二個問題，現在我只是簡單地透過網路爬蟲下載了Line的貼圖**如果應用程式發布則存在非法問題xD**。所以貼圖只是為了測試！

## 總結
貼圖是png格式的圖像。要實現貼圖功能，我們只需要獲取貼紙的路徑並將其發送給接收者，類似於發送普通圖像。不過，不需要將圖片上傳到伺服器，因為貼圖資源已經保存在伺服器上。

這就是我今天要分享的全部內容！  

