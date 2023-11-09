---
title: "[Development Diary] Real Time Communication APP - Story Updated(I)"
date: 2023-09-05T20:19:33+08:00
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

## Demo Video
<video src="/videos/chat-app/instance-story-alignment.mp4" controls="controls" width="500"></video>   

## TODO
In the previous version, it did allow users to add multiple `texts` to their `instance story`. But it’s hard to align all the text items without barely using their eyes to do so. So, in this version, I decided to add an alignment tool to help them, which is similar to the `Instagram` alignment tool.

## HOW
To implement this feature, we need to know the `width` and `height` of the item the user wants to align first. Due to the item's able to `scale` and `rotate`, the `width` and the `height` will be different than the original size, so we need to get the correct `size` before we can start to align.  

You may wonder how we can get the correct size after `scaling` and `rotation`. For'scaling', which is a bit easier than `roatation`, we just need to multiply the size by the scale factor, and then we can get the correct scaled size. But for calculating the size after `rotation`, we need some math to help us, which we learned from high school, which is `trigonometric functions`. Applying this math, we can calculate the `width` and `height` easily.  
![math](/images/chat-app/triangle-math.png)  

After we get the correct size, we can start to align the item. Alignment functions are just a simple calculation, so I'm not going to share the details here, but I will provide all those functions here for your reference!  
> To calculate the size
```swift
GeometryReader{ proxy -> Color in
    DispatchQueue.main.async {
        self.currentItemSize = proxy.size
        let newWidthAfterRotate1 = self.currentItemSize.height * sin(box.angle.radians)
        let newWidthAfterRotate2 = self.currentItemSize.width * cos(box.angle.radians)
        let newHeightAfterRotate1 = self.currentItemSize.height * cos(box.angle.radians)
        let newHeightAfterRotate2 = self.currentItemSize.width * sin(box.angle.radians)
        self.currentItemSize.width = abs(newWidthAfterRotate1) + abs(newWidthAfterRotate2)
        self.currentItemSize.height = abs(newHeightAfterRotate1) + abs(newHeightAfterRotate2)
        self.currentItemSize.width *= (box.scaleFactor + box.lastScaleFactor) //new width after scale
        self.currentItemSize.height *= (box.scaleFactor + box.lastScaleFactor) //new heigh after scale
        //https://i.stack.imgur.com/C6NVo.png
    }
    return Color.clear
}
```
> Alignment functions - Leading Alignment
```swift
 private func leadingAlignmentChecking(proxyFrame : CGSize,newLocation : CGSize) -> CGSize {
        var location = newLocation
        let startWidth = location.width - (self.currentItemSize.width / 2)
        let leadingAignment = -(proxyFrame.width / 2  - 10)
        
        if !isLeadingAlignment {
            if startWidth >= leadingAignment && startWidth <= leadingAignment + 3{
                withAnimation{
                    isLeadingAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if startWidth <= leadingAignment - 10 || startWidth >= leadingAignment + 10{
                withAnimation{
                    isLeadingAlignment = false
                }
            }
        }
        withAnimation{
            location.width = isLeadingAlignment ? leadingAignment + (self.currentItemSize.width / 2) : location.width
        }
        return location
    }
```

> Alignment functions - Traling Alignment
```swift
    private func tralingAlignmentChecking(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation
        let endWidth = location.width + (self.currentItemSize.width / 2)
        let tralingAignment = proxyFrame.width / 2  - 10
        
        if !isTralingAlignment {
            if endWidth >= tralingAignment && endWidth <= tralingAignment + 3{
                withAnimation{
                    isTralingAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if endWidth <= tralingAignment - 10 || endWidth >= tralingAignment + 10{
                withAnimation{
                    isTralingAlignment = false
                }
            }
        }
        withAnimation{
            location.width = isTralingAlignment ? tralingAignment - (self.currentItemSize.width / 2) : location.width
        }
        return location
    }
    
```

> Alignment functions - Top Alignment 
```swift
    private func topAlignmentChecking(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation
        let startHeight = location.height - (self.currentItemSize.height / 2)
        
        let topAignment = -((UIScreen.main.bounds.height / 1.22) / 2 - 50)
        if !isTopAlignment {
            if startHeight >= topAignment && startHeight <= topAignment + 3{
                withAnimation{
                    isTopAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if startHeight <= topAignment - 10 || startHeight >= topAignment + 10{
                withAnimation{
                    isTopAlignment = false
                }
            }
        }
        withAnimation{
            location.height = isTopAlignment ? topAignment + (self.currentItemSize.height / 2) : location.height
        }
        return location
    }
    
```

> Alignment functions - Bottom Alignment
```swift
    private func bottomAlignmentChecking(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation
        let endHeight = location.height + (self.currentItemSize.height / 2)
        
        let bottomAignment = ((UIScreen.main.bounds.height / 1.22) / 2 - 50)
        if !isBottomAlignment {
            if endHeight >= bottomAignment && endHeight <= bottomAignment + 3{
                withAnimation{
                    isBottomAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if endHeight <= bottomAignment - 10 || endHeight >= bottomAignment + 10{
                withAnimation{
                    isBottomAlignment = false
                }
            }
        }
        withAnimation{
            location.height = isBottomAlignment ? bottomAignment - (self.currentItemSize.height / 2) : location.height
        }
        return location
    }
```

> Alignment functions - Vertical Alignment
```
    private func verticalAlignmentChecking(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation


        if !isVerticalAlignment {
            if location.height >= 0 && location.height <=  3 {
                withAnimation{
                    isVerticalAlignment = true
                    
                }
            }
        }else {
            //TODO: To leave the alignment status
            if location.height <=  -10 || location.height >=  10{
                withAnimation{
                    isVerticalAlignment = false
                }
            }
        }
        withAnimation{
            location.height = isVerticalAlignment ? 0 : location.height
        }
        return location
    }
```

> Alignment functions - Horizontal Alignment
```swift
    private func horizontalAlignmentChecking(proxyFrame : CGSize,newLocation : CGSize) -> CGSize{
        var location = newLocation


        if !isHorizontalAlignment {
            if location.width >= 0 && location.width <=  3 {
                withAnimation{
                    isHorizontalAlignment = true
                }
            }
        }else {
            //TODO: To leave the alignment status
            if location.width <=  -10 || location.width >=  10{
                withAnimation{
                    isHorizontalAlignment = false
                }
            }
        }
        withAnimation(){
            location.width = isHorizontalAlignment ? 0 : location.width
        }
        return location
    }
```

That the ends of my sharing, thanks you for your reading time ^^, see ya!