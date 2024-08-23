---
title: "[Leetcode] Palindrome Pairs(Hard)"
date: 2022-09-17T20:41:48+08:00
draft: false
tags:
    - array
    - tire Tree
    - string
categories:
    - leetcode
---


## LeetCode 336 - Palindrome Pairs
Given a list of **unique** words, return all the pairs of the ***distinct*** indices `(i, j)` in the given list, so that the concatenation of the two words `words[i] + words[j]` is a palindrome.

example
```
Input: words = ["abcd","dcba","lls","s","sssll"]
Output: [[0,1],[1,0],[3,2],[2,4]]
Explanation: The palindromes are ["dcbaabcd","abcddcba","slls","llssssll"]
```
```
Input: words = ["bat","tab","cat"]
Output: [[0,1],[1,0]]
Explanation: The palindromes are ["battab","tabbat"]
```

## How can we solve this problem?
在解這題之前我們先要知道有哪些情況是成立Palindrome。  
* Case 1 ：2個字符串為反向字符串 - `"abcd""dcba"` => `"abcd|dcba"`
* Case 2 ：2個字符前中一個與另一個字符串的前面部分為`Palindrome`,剩餘未能匹配的部分也是一個
`Palindrome` - `"abb""hcch|bba"` => `abbhc|chbba`
* Case 3 : 2個字符的其中一個為空字符，而另外一個自己就是一個`Palindrome` - `"""aba"` => `"aba"`

哪我們怎麼才能知道哪些字符串是某字符串的`Palindrome`呢？  
我們可以透過`Trie Tree(前綴樹)`來幫助進行我們匹配。  
> *注:建立樹時必須是反向的方式插入(abcd => dbca),這樣當我們進行搜尋或者匹配的時候，才知道哪些與當前字符串匹配* 

為了能匹配出**Case 2**，每遍歷一個Node,都需要檢查`[0..j]`是否為`Palindrome`，如果是插入當前字符串的`index`到當前的`Node`中，以便之後的匹配步驟。另外對於空字符串而已，需要插入至`root`的`Node`。(任何本來就是一個`Palindrome`的字符串也會出現在`root`的list(`保存的是index`)中：`"","aba","a","bbbabbb"`)

建立完成以後，便可以進行匹配。當遍歷到的`Node`是一個完整的字符串而且`Index`不等於自己以及剩餘的部分是一個`Palindrome`，也就是匹配到了我們的`Case2`，並加入至`result`。重複這個過程直到，遍歷完當前字符串。但是遍歷完當前字符串，並不代表沒有其他字符串可以組成`Palindrome`。之前建立`Tree`的時候，在這個`Node`中插入`[0...j(當前的node)]`字符串為`Palindrome`的`index` list,就可以直接使用了。只要`index`不等於當前的字符串的`index`直接加入到`result`即可。(匹配**Case 2**或者**Case 3**(如果是`root`的話)`)。

透過以上這些步驟就可以解決這一題(有點難度...哈哈哈)

#### Solution:
```c++
class TrieNode {
    public:
    TrieNode(){
        children = vector<TrieNode*>(26,nullptr);
    }
    
    int index = -1; //if this variable is not -1 ,it means a word
    vector<TrieNode*> children;
    
    //coz we are matched the prevous character a(xxx)|(rest of string is palindrome too)|(xxx)
    vector<int> restPalindromeIndex;
};

class Solution {
public:
    vector<vector<int>> palindromePairs(vector<string>& words) {
        //distinct indices (i, j)
        TrieNode* root = new TrieNode();
        for(int i = 0;i<words.size();i++)
           BuildTrieTree(root,words[i],i);
        
        vector<vector<int>> res;
        
        //seach the palindrome
        for(int i = 0;i<words.size();i++)
            search(res,i,words,root);
        
        return res;
    }
    
    
    void BuildTrieTree(TrieNode* root,string& str,int wordIndex){
        //insert the string in reverse order
        TrieNode* head = root;
        for(int i = str.length()-1;i>=0;i--){
            
            if(isPalindrome(str,0,i)) head->restPalindromeIndex.push_back(wordIndex); //[0..j] is a Palindrome? record the index
            
            if(head->children[str[i] - 'a'] == nullptr) head->children[str[i] - 'a'] = new TrieNode();
            head = head->children[str[i] - 'a'];
            
        }
        
        head->index = wordIndex; //after the string is inserted to the tree ,set the index
        head->restPalindromeIndex.push_back(wordIndex);//if empty string
    }
    
    
    void search(vector<vector<int>>& res,int wordIdx,vector<string>& words,TrieNode* root){
        if(!root) return;
        TrieNode* head = root;
        for(int i = 0;i<words[wordIdx].length() && head;i++){
            //find the word
            if(head->index != -1 && head->index != wordIdx && isPalindrome(words[wordIdx],i,words[wordIdx].length() - 1)) res.push_back({wordIdx,head->index});
            
            head = head->children[words[wordIdx][i] - 'a'];
        }
        
        //if there is no any character ,return it
        if(!head) return; 
        
        //we need to add all string that is palindrome from [head(character to 0]
        //for example : str is aab and any string has same baa at the back
        //aab|(if sub string is palindrome with postfix (baa))
        //if can make as a Palindrome Pairs
        //aab|(aba)baa => aaba b abaa => YES
        //aab|(cbc)baa => aabc b cbaa => YES
        //aab|(abba)baa => aabab babaa => YES
        for(auto index : head->restPalindromeIndex) if(index != wordIdx) res.push_back({wordIdx,index}); //distinct i and j
    
    }
    
    bool isPalindrome(string& str,int l, int r){
        while(l < r && str[l] == str[r]){
            l++;
            r--;
        }
        
        return l >= r;
    }
};
```



