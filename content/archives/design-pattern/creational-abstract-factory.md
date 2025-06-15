---
title: "[Note]Creational Abstract Factory"
date: 2022-04-03T19:38:20+08:00
draft: false
tags:
  - programming-skill
categories:
  - design-pattern
author: jackson.tmm
---

## 什麼是Abstract Factory(抽象工廠)呢?
> 定義: 又稱為Kit模式。提供一個創建系列相關或者互相依賴的Interface，而無需指定其具體的class

### 簡單例子
*注: 以下程式單純用於解釋，並不能實際執行*  
```
透過定義不同組件的Abstraction類,並把Abstraction類組合在一起。通過繼承抽象工廠的方式，定義不同的工廠類，生成不同的Product。

由以下例子可見，有2組不同的UI分別是Summary以及Spring，他們都分包實現了Abstraction 類，然後在透過實現各自的工廠類，生成Summary以及Spring的Product
```

```c++
//🌰UI
//Button TextField ComboBox
//Abstract Class UI
class Button{
   public:
    	virtual void display() = 0;
}

class TextField{
   public:
    	virtual void display() = 0;
}

class ComboBox{
   public:
    	virtual void display() = 0;
}

//Abstract Class Factory
//用於把不同類型的UI/主題Group 在一起
class UIFactory {
    public:
    	virtual Button* createButton() = 0;
    	virtual TextField* createTextField() = 0;
    	virtual ComboBox* createComboBox() = 0;
}
```
```c++
//Spring
class SpringButton : public Button{
    public:
    	void Draw(){
            //Draw Spring style Button
        }
}
class SpringTextField : public TextField{
    public:
    	void Draw(){
            //Draw Spring stype TextField
        }
}
class SpringComboBox : public ComboBox{
    public:
    	void Draw(){
            //Draw Spring stype ComboBox
        }
}
```
```c++
//Summer
class SummerButton : public Button{
    public:
    	void Draw(){
            //Draw Summer style Button
        }
}
class SummerTextField : public TextField{
    public:
    	void Draw(){
            //Draw Summer style TextField
        }
}
class SummerComboBox : public ComboBox{
    public:
    	void Draw(){
            //Draw Summer style ComboBox
        }
}
```
```c++
//Factory
class SpringFactory : public UIFactory{
    public:
    	 Button* createButton(){
             //To init the button and some setting
             Button* button = new SpringButton();
             return button;
         };
    	 TextField* createTextField(){
             //To init the TextField and some setting
             TextField* textField = new SpringTextField();
             return textField;
         };
    	 ComboBox* createComboBox(){
             //To init the ComboBox and some setting
             ComboBox* comboBox = new SpringComboBox();
			return ComboBox;
         };
}

//SummerFactory
class SummerFactory : public UIFactory{
    public:
       	 Button* createButton(){
             //To init the button and some setting
             Button* button = new SummerButton();
             return button;
         };
    	 TextField* createTextField(){
             //To init the TextField and some setting
             TextField* textField = new SummerTextField();
             return textField;
         };
    	 ComboBox* createComboBox(){
             //To init the ComboBox and some setting
             ComboBox* comboBox = new SummerComboBox();
			return ComboBox;
         };
}
```

```c++
int main(){
    //就是透過工廠生成接口生成不同的工廠 
    //再透過不同的工廠調用其生產的product

    //Summer 工廠
	UIFactory* factory = new SummerFactory();
    Button* button = factory->createButton();
    TextField* textField = factory->createTextField();
    ComboBox* comboBox = factory->createComboBox();

    button->draw();  //畫出Summer Style的Button
    textField->draw(); //畫出Summer Style的textField
    comboBox->draw(); //畫出Summer Style的comboBox
    return;
}
```
---
### 優點
* 解決工廠模式中每個產品都使用一個工廠的生產的問題
* 新增產品很方便，擴展產品以及工廠即可(增加統一產品族)
* 擁有工廠模式的優點
### 缺點
* 如果要新增產品等級結構必須修過工廠抽象類，違反Open-Close 原則(增加產品等級結構)
* 唯一缺點就是開閉原則的傾斜性
* 何謂開閉原則的傾斜性呢?
  * 就是在新增產品族(**不同類型，相同產品**)的時候可以符合開閉原則,但是在新增產品等級結構(**同一類型，新增產品/不同的產品類型/等級**)時候,必須修改抽象類。這個問題無法解決，只能透過設計避免。
  * 例子
    * 新增A的產品族，只需實現工程類以及實現產品類型，即可新增一個新的工廠用於生成新產品(符合Open-Close)
    * 新增A的類型(如一個新的UI原件:IMG),這樣就必須要修改abstract class以及concrete class的內部(違反Open-Close)

### 抽象工廠模式跟工廠模式的區別
|模式|區別|
|----|---|
|工廠模式(Factory Pattern)|每一組相關的Product都由同一個具體工廠生產|
|抽象工廠模式(Factory Pattern)|每個產品族(product)都由同一個具體工廠生產 <br />例如:<br />電器(同牌子/同一產品族)/電器(同電器(如都是冰箱)/同一產品等級結構)<br /><ul><li>**產品等級結構: 產品的繼承結構**,**例如:同一種類的產品(如:同一電器但不同牌子)**</li><li>**產品族:同一工廠生產的，位於不用產品等級結構的一組產品**,**例如:同一族群的產品(如:同一牌子的不同電器)**</li></ul>|


### 抽象工廠模式(abstract factory pattern)使用場合

>   當一個工廠的可以創立出屬於不同產品的等級結構的一個產品族中的所有對象時,此時使用抽象工廠模式更有效率和簡單

*   **系統不應該依賴具體的細節(如何創建,表達細節等...)，依賴於抽象(所有工廠模式都一樣)**
*   **系統中多於一個產品族時，而每次只會使用到某一個產品族。可通過配置文件動態修改產品族**
*   **約束:屬於同一產品族的產品將在一起使用(同一類)，而這些產品可以沒有任何關係，但有相同約束(同一工廠)**
*   **產品等級結構穩定，在設計完成後不會在系統更改/刪除產品等級結構(開閉原則的傾斜性)**



---
參考資料:  
[史上最全设计模式导学目录（完整版）](https://blog.csdn.net/LoveLion/article/details/17517213)