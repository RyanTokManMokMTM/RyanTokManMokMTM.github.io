---
title: "[開發者日記] 聊天通訊APP - 貼圖更新(III)"
date: 2023-11-11T11:08:40+08:00
draft: false
categories:
    - side-project 
tags: 
    - chat-app 
---

## 簡介
如果您想了解該項目的內容，請閱讀以下文章   
[ChatApp(I)](/achievement/chat-app-init/)  
[ChatApp(II)](/achievement/chat-app-demo/)  
[ChatApp(III)](/achievement/chat-app-update/)  
[ChatApp(IV)](/achievement/chat-app-final/)  
[ChatApp(V)](/achievement/chat-app-voice-chat/)  
[ChatApp(VI)](/achievement/chat-app-sticker-updated/)  
[ChatApp(Ⅶ)](/achievement/chat-app-story-alignment-updated/)  
[ChatApp(Ⅷ)](/achievement/chat-app-story-multiple-img-updated/)

## Demo
<video src="/videos/chat-app/sticker-shop.mp4" controls="controls" width="500"></video>     

## 簡介
正如我在[這篇文章](/achievement/chat-app-sticker-updated/)中提到的，我添加了一個關於貼紙的新功能，它可以在聊天中使用提供的貼圖資源。但這還不夠，對用戶來說也不靈活。因此，我開發了更多關於貼紙功能的內容。    

首先，由於使用者只能使用`ADMIN`提供的貼紙，因此不允許使用者在沒有`ADMIN`的情況下新增任何其他貼圖資源。而且，應用程式中的所有用戶都有相同的貼圖，因此不同的用戶沒有不同的貼圖。因此，我在應用程式中添加了一個貼圖商店，允許用戶選擇他們想要使用的貼圖。  

其次，在先前的版本中，使用者透過API存取貼圖資源來取得數據，這對於頻繁取得相同的資源效果不佳。因此，我添加了一項功能，要求用戶將貼圖下載到他們的裝置上才能使用。用戶下載完貼圖資源後，如果帳號擁有相同的貼圖，則可以在同一裝置上的不同帳號之間共用下載的資源。

## 總結
在這個版本中，我更新了一些關於貼圖功能的內容。   
* Sticker Shop供用戶將自己喜歡的貼圖添加到他們的帳戶中：`Sticker Shop的貼紙現在只能透過API添加）`
* 將貼圖下載到本機，並在同一裝置上的不同帳戶之間共用相同的資源。

我的分享到此結束，感謝您的閱讀^^，再見！


