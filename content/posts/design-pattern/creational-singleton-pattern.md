---
title: "[Note]Creational Singleton Pattern"
date: 2022-04-09T11:19:39+08:00
draft: false
tags:
  - programming-skill
categories:
  - design-pattern
author: jackson.tmm
---


## 什麼是Singleton Pattern(單例模式)呢?
> 定義:一個Class在系統中只會存在一個實例(instance),整個系統中只提供1個可使用的instance,以確保唯一性,並節省系統資源。

### 簡單例子 
*注: 以下程式單純用於解釋，並不能實際執行*  
```
class的建構子(constructor)對外隱藏,外部無法通過constructor進行實例化，但會提供一個靜態(static)方法，以獲取這個class的唯一實例。
```
**TaskManager**
```c++
//Constructor 對外隱藏，並提供一個靜態Static 讓外部只透過這個存取
class TaskManager{
private:
	TaskManager();
	void displayProcess();
	void displayServices();
	static TaskManager* taskManager = nullptr; //保存唯一Instance
public:
	//外部只能透過靜態Static 方法存取 並new一個TaskManger的Instance 如果是null的
	//此方法為工廠
	static TaskManager* getInstance(){
        if(taskManager == nullptr){
            taskManager = new TaskManager();
        }
        return TaskManager;
    }
}
```
**LoadBalance**
```c++
//LoadBalance 🌰
//用於計算服務器負載，所以必須使用單例
class LoadBalance{
public:
	static LoadBalance* getInstance(){
        if(loadBalance == nullptr){
            loadBalance = new LoadBalance();
        }
        return LoadBalance;
    }
private:
	static LoadBalance* loadBalance;
	LinkedList* serverList = nullptr;

	LoadBalance();
	void addServer(std::string server){
        serverList->add(server);//add a server
    }

	std::string getServer(){
        int i = random()% serverList->length(); //random get server
        return serverList->get(i);
    }

}

int main(){
    LoadBalance *balancer1,*balancer2,*balancer3,*balancer4;
    balancer1 = LoadBalance::getInstance(); //獲取LoadBalance，這裡會先new 再return
    balancer2 = LoadBalance::getInstance(); //獲取LoadBalance
    balancer3 = LoadBalance::getInstance(); //獲取LoadBalance
    balancer4 = LoadBalance::getInstance(); //獲取LoadBalance

    //以上4個balancer 都應該為同一記憶體
    if(balancer1 == balancer2 && balancer2 == balancer3 && balancer3 == balancer4)
    printf("Balancer is nnique");

    //add server
    balancer1->addServer("server1");
    balancer1->addServer("server2");
    balancer1->addServer("server3");
    balancer1->addServer("server4");

    for(int i = 0;i<10;i++){
        printf("server %d",balancer1->getServer());
    }
    return;
}
```
### Singleton的問題
> 因為外部不能實例化，哪應該什麼時候實例化它呢?  
> 從上面例子可以觀察到，第一次使用到`getInstance()`的時候,會先判斷是否為空,是的話會先實例化並保存pointer,然後再返回Instance。

**如果在多線程(Multi-threading)下，同時call `getInstance()` 會這樣呢?**  
沒錯!就會導致違反了Sington的目的，導致系統錯誤的嚴重後果。  
假如TA和TB 2個Thead 同時call `getInstance()`,此時這個instance是為`null`，所以他們都會同時滿足`if(instance == null)`,並進行`new instance`,導致系統記憶體中會有2個Instance.

**哪要如何解決呢?**  
以下提供了2個方法來解決
* 餓漢式
  * 在定義class的時候就先把static variable先給實例化，因此，在加載時候就已經被實例化了。 `可以想象成不管要不要用(吃)，先實例化了再說(把食物買了再說)` (就怕自己會餓死 xD
  * 問題: 可能會浪費資源，因為有可能會出現不使用的情況出現。
* 懶漢式
  * 要使用的時候，先檢測是否存在，再實例化(就是上面例子一樣)
  * 問題 1: 在多線程的情況下，會變得不安全。為了確保線程安全，就必須要用到`Mutex`進行保護(會增加開銷)
  * 問題 2: 雖然有加上鎖，但是有可能線程會一起進入`if 判斷`，等一個thread解鎖了，另外一個還是會重新new 新的一個。因此，要在裡面加多一個`if來判斷是否為null`。這個稱為`double-Check Locking`

能克服`餓漢式` 以及 `懶漢式`的方法:  
在Class內部定義static class來進行實現  
因為`static Singleton* instance` 並不是`Class Singleton`的成員(Member)，所以在加載時候，不會被實例化，只有呼叫了`getInstance` 的時候才會被實例化。
```c++
class Singleton {
    private:
		Singleton() {}
        static class HolderClass {
                private:
                    static Singleton* instance = new Singleton();
        }
        public:
            static Singleton getInstance() {
                return HolderClass::instance
            }
        }
}   
```

---
### 優點
* 為系統提供了唯一的Instance
* 因只有一個Instance,能節省系統資源
* 在Singleton 模式中，除了唯一的，也可以提供指定數量的Instance，以解決分享過多造成的性能問題

### 缺點
* 難以擴展，因為Singleton 不是由 Abstract Class實現

### 違背原則
* *有點違反單一職責原則(Single-responsibility Principe)*
  * 因又是工廠的角色(new instance),又是Product的角色(返回Static 獲取實例)

---
參考資料:  
[史上最全设计模式导学目录（完整版）](https://blog.csdn.net/LoveLion/article/details/17517213)