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

Many different ways to do so. Our weapon of choice will be JSbin. It is an online editor (HTML, JavaScript, CSS. All we need!) with this hot reloading feature. When you will start writing some code, you will see a specific URL popping up in your address bar, such as : `https://jsbin.com/kadovifuha/edit?html,css,output` be sure to write down the weird name just after jsbin.com, it will be a unique identifier to get back later to your code.


<img classe="ctr" src="./assets/log0_jsbin.jpg" alt="Full Rendering">

A few helping points to get you started (each are linked with a red marker of the corresponding number)

1. The big header is a bit of a bother. Click on that cross to make it smaller;
2. Line numbering is easier for communicating about code. Double click on HTML and make them appear;
3. You see three frames, HTML, Javascript, and Output. The little buttons at the right of the red 3 allows you to juggle between those and other frames. While CSS will be useless for us, Console might help you understanding what went wrong in your code;
4. Your code is updated live. If you don't want, you can just check out of "Auto-run JS"  and if you want to see your result full screen, just click on the arrow pointing to the upper right.
 

## c) Running your first program

Enough talk, let's rock. First, we'll create our web page in HTML and make it access our JavaScript file. That'll be more or less all that our HTML will be doing, everything else will be done in JavaScript.

If you know a bit HTML, nothing will be of a surprise here. If you don't ... you might want to check it out elsewhere later because it's out of scope of this workshop :p In short, we create a HTML document, in the header we load two scripts (a library, and your code on the JavaScript frame), then we just style a bit the body, create a canvas where we'll be drawing and call a function called `main()` when the body will have finished loading.


~~~ HTML
<!DOCTYPE html>
<html>

  <head>  
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

So, we are importing two JavaScript code. The later is the one you'll be coding. The first is a home made, overkill, super specific, library. While our first step will be to use it to draw a triangle, our first aim will be to get rid of it.

So, how do we use it? First, you need to create the `main()` function mentioned earlier. Then you will call the highest level function of the library : `func_doAll()` which ... does it all. The code below does just that. You will need to write it not in your HTML frame but in the JavaScript frame. Unless mentioned otherwise, it'll be always the case from now on.

~~~ JavaScript
var main=function() {
  func_doAll(); 
};
~~~

Simple right ? If everything went right, you should see a little triangle. And a confirmation that WebGL is working on your web browser. Give your self a tap on the back, a bit more reading, and we're settled for the real stuff.


## d) CPU / GPU
CPU stands for Central Processing Unit, the default stuff that thinks when you give an order, a task, execute some code... GPU stands for Graphical Processing Unit, the twin of the CPU, mostly used for rendering graphics (but not only. Curious he?). Each processing units behave in a different way, our job here will be to learn the specificities of the GPU.


## e) Library
You never code alone. You stand on the shoulders of giant, and reuse their code, would you know it or not. Sometimes, it's more obvious than others, like when you use a library. You might want to do so for rendering graphics, and you'd be pretty right. Here, we're not teaching you a better way, we're showing you the raw stuff, both for your culture, understanding, and for when you'll need to push the libraries to their boundaries. Understand the gears so you can master the tools.

## f) the Web part of it
In this workshop, we chose WebGL instead of OpenGL for numerous reasons. Among others was to allow you to easily share your results. While JSBin is super nice for fast prototyping, you might want to host your code somewhere more classic. There are numerous free static server provider available online (like [neocities](http://neocities.org)), you might want to check that after the workshop.



