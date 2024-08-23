---
title: "[Development Diary] Real Time Communication APP(I) - Get started"
date: 2023-04-19T17:08:14+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

The main purpose of developing this application is to address the problem of searching for OTT resources, movie content, and discussions across different platforms, such as the issues of invalid or illegal OTT resources and the time spent searching for these resources. Therefore, this application has two main components: movie OTT resource integration and a movie social platform.

Including features: 
* User login/register
* Edit user profile
* Add users as friends (chat)
* Delete users
* Create chat group
* Join chat group
* Leave chat group
* Edit chat group information (owner privileges)
* View group information
* View user information
* One-on-one chat - communicate with added friends
* Group chat - communicate within joined groups
* Voice communication (Pending)
* Video communication (Pending)
---
Special Features - Stories (24-hour Stories)
* Add and delete stories
* View friends' stories
* Reply to friends' stories


### app screenshot
![chat-app-screen](/images/chat-app/screenshot.png)

### Demo
<video src="/videos/chat-app/demo.mp4" controls="controls" width="500" height="300"></video> 

<video src="/videos/chat-app/demo1.mp4" controls="controls" width="500" height="300"></video> 

### Progress
**Done**
* User login/register
* Add/remove friends
* Search for friends
* Create groups
* One-on-one chat/group chat
* Post/remove personal stories
* View friends' stories
* Comment on stories
* Offline message push (delivered when online)
  
**Commnication features**
* Send text
* Send images
* Send files (doc, pdf, ppt, etc.)
* Send story replies
* 
**Issues**
* Story comment chatroom information error (sender) - Fixed
* Refresh function missing - Fixed
* Story errors/reminders (story does not exist, message already sent, etc.)