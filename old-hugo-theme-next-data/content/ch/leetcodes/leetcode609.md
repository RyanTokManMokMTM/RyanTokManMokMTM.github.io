---
title: "[Leetcode] Find Duplicate File in System(Medium) "
date: 2022-09-19T14:41:56+08:00
draft: false
tags:
    - string
    - map
categories:
    - leetcode
---

## LeetCode 42 - Trapping Rain Water
Given a list `paths` of directory info, including the directory path, and all the files with contents in this directory, return *all the duplicate files in the file system in terms of their paths*. You may return the answer in **any order**.

A group of duplicate files consists of at least two files that have the same content.

A single directory info string in the input list has the following format:

* `"root/d1/d2/.../dm f1.txt(f1_content) f2.txt(f2_content) ... fn.txt(fn_content)"`

It means there are n files `(f1.txt, f2.txt ... fn.txt)` with content (`f1_content, f2_content ... fn_content`) respectively in the directory `"root/d1/d2/.../dm"`. Note that `n >= 1` and `m >= 0`. If m = 0, it means the directory is just the root directory.

The output is a list of groups of duplicate file paths. For each group, it contains all the file paths of the files that have the same content. A file path is a string that has the following format:

* "directory_path/file_name.txt"
```
Input: paths = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)","root 4.txt(efgh)"]
Output: [["root/a/2.txt","root/c/d/4.txt","root/4.txt"],["root/a/1.txt","root/c/3.txt"]]
```

```
Input: paths = ["root/a 1.txt(abcd) 2.txt(efgh)","root/c 3.txt(abcd)","root/c/d 4.txt(efgh)"]
Output: [["root/a/2.txt","root/c/d/4.txt"],["root/a/1.txt","root/c/3.txt"]]
```

## How can we solve this problem?
這題是也什麼難度，只要透過字串分隔和透過`Map`保存相同內容(`Content`)的路徑即可。
#### Solution:

```c++
class Solution {
public:
    vector<vector<string>> findDuplicate(vector<string>& paths) {
        //format : directory fileName(content) fileName2(contnet)
        //abcd : "root/a/1.txt","root/c 3.txt(abcd)"
        unordered_map<string,vector<string>> m;
        vector<vector<string>> res;
        for(auto &str : paths){
            //find root path
            int i = 0;
            int n = str.length();
            while(i < n){
                if(str[i] == ' ')break;
                i++;
            }
            string root = str.substr(0,i);
            i++; //after sapce
            vector<string> files;
            
            while(i < n){
                //find file name
                //find file content
                string fileName,fileContent;
                while(str[i] != '('){
                    fileName += str[i++];
                }
                
                // cout << fileName << " ";
                
                i++; //skip (
                while(str[i] != ')') fileContent += str[i++];
                // cout << fileContent << endl;
                i+=2; //skip and move to next file
                
                m[fileContent].push_back(root + "/" + fileName);
            }
            
        }
        
        for(auto &ele : m){
            if(ele.second.size() > 1) res.push_back(ele.second);
        }

        return res;
    }
    

};
```


