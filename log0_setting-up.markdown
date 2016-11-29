---
layout: default
title:  "Setting up"
num: 0

---

You know us, we know you: let’s get this party started.

## a) What is OpenGL/WebGL?

I'd answer "WebGL is what we'll use in this workshop" but I'm unsure how happy you'll be with the answer. Joke aside, OpenGL is an API (application programming interface) which connect two things. The first is your code, which is executed on your main processor; the second is your graphic card. In short, openGL let you render graphics on your screen by accessing directly the graphic card (hardware accelerated graphics) as opposed to draw from your main processor, thus maximizing the performances.

WebGL as a few might have already guessed is the twin of OpenGL, but on the web. It's a very similar API, specifically for the programming language used on the web: JavaScript. While both are not completely equivalent, let's say that if you know one, you know the other.

While OpenGL/WebGL is a whoooole world to discover, with bumps and heavy rides, we'll try to give you a gentle introduction here. You're aim is twofold. First get a hang on the API, draw your first shape, play with it, start mapping the real of graphical possibilities. Second is to allow you to be self sufficient and to start building your own project.


## b) Setting up

So, in case you haven't followed, we'll be drawing stuff on the web, hence using a web browser, JavaScript and WebGL. The linguist will have found out by themselves that JavaScript is a scripting language. It means it doesn't need to be compiled and translated in machine code. This allows for many thing, and among other: hot reloading. This means that you can write your code, and see in (pseudo) real time the modification. A blessing for students and teachers alike.

Many different ways to do so. Our weapon of choice will be JSbin. It is an online editor (HTML, JavaScript, CSS. All we need!) with this hot reloading feature. When you will start writing some code, you will see a specific URL popping up in your address bar, such as : [https://jsbin.com/kadovifuha/edit?html,css,output] be sure to write down the weird name just after jsbin.com, it will be a unique identifier to get back later to your code.


<img src="./assets/log0_jsbin.jpg" alt="Full Rendering">

A few helping points to get you started (each are linked with a red marker of the corresponding number)
1. The big header is a bit of a bother. Click on that cross to make it smaller;
2. Line numbering is easier for communicating about code. Double click on HTML and make them appear;
3. You see three frames, HTML, Javascript, and Output. The little buttons at the right of the red 3 allows you to juggle between those and other frames. While CSS will be useless for us, Console might help you understanding what went wrong in your code;
4. Your code is updated live. If you don't want, you can just check out of "Auto-run JS"  and if you want to see your result full screen, just click on the arrow pointing to the upper right.
 

## c) Running your first program

* High function (one) from our "library" that allows to draw something 

~~~ HTML
<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8'/>
    
    <script type="text/javascript" src=
    "https://opentechschool-brussels.github.io/intro-to-webGL-and-shaders/src/lib.js">
    </script>
    <script type="text/javascript" src="script.js"></script>
  </head>
  <body style='margin:0px' onload='main()'>
    
    <canvas/ id='your_canvas' style='position: absolute; background-color: black;'>
  
  </body>
</html>
~~~


~~~ JavaScript
var main=function() {
  func_doAll();  
};
~~~



## d) CPU / GPU



## e) Library - framework Vs your own code


## f) the Web part of it
* hosting your code. free static server available online.



