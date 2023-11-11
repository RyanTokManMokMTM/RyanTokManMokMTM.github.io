---
title: "[Development Diary] Real Time Communication APP - Sicker Updated(II)"
date: 2023-11-11T11:08:40+08:00
draft: true
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

## Intro
If you want to checkout what is this project about, please go through articles below.  
[ChatApp(I)](/post/chat-app-init/)  
[ChatApp(II)](/post/chat-app-demo/)  
[ChatApp(III)](/post/chat-app-update/)  
[ChatApp(IV)](/post/chat-app-final/)  
[ChatApp(V)](/post/chat-app-voice-chat/)  
[ChatApp(VI)](/post/chat-app-sticker-updated/)  
[ChatApp(Ⅶ)](/post/chat-app-story-alignment-updated/)  
[ChatApp(Ⅷ)](/post/chat-app-story-multiple-img-updated/)

## Demo Video
<video src="/videos/chat-app/sticker-shop.mp4" controls="controls" width="500"></video>     

## TODO And Description
As I mentioned in [this article](/post/chat-app-sticker-updated/), I've added a new feature about stickers, which is able to use the provided sticker resources in the chat. But that is not enough and is not flexible for the user. So, I've developed some more about the sticker feature.  


First, due to the fact that a user can only use stickers that are provided by `ADMIN`, the user isn't allowed to add any other sticker resources without `ADMIN`. And also, all the users in the app have the same stickers, so there are no different stickers for different users. Therefore, I added a sticker shop to the app that allows users to choose what sticker they want to use.


Second, in the previous version, users accessed sticker resources via API to fetch the data,which wasn't effective to fetch the same resources frequently. So, I added a feature that requires users to download the stickers to their devices before they can use them. Once the user has downloaded the sticker resources, the downloaded resources can be shared across different accounts on the same device if the account has the same sticker.  

## Summary
In this version, I have updated a few things about the sticker feature.  
* Sticker Shop for users adding their favorite sticker to their account:`(Sticker Shop's sticker can now only be added by API)`
* Download the sticker locally and share the same resources across different accounts on the same devices.   

That the ends of my sharing, thanks you for your reading time ^^, see ya!


