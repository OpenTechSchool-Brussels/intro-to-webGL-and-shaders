---
layout: default
title:  "Draw & animate your first shape"
num: 3

---

## a) Create your own shape
* Vertex Buffer Object
* re Draw your first Triangle
* Change your triangle to another shape(s)

## b) Render your shape
* Animate function and its inner working
* fonction animate (glDraw) avec variation du type de Draw (GL_TRIANGLES, GL_LINE_LOOP , etc)

## c) Animating your shape
* rotation's mathematical aspect
* operation on vertex buffer each time in animate (say it's "working but ugly" and we'll see better soon)

## d) Controling this mess

* Using the mouse position (x and y) as a control for other stuff

Based on:

~~~ HTML
<div onmousemove="showCoords(event)"></div>
<script>
function showCoords(event) {
    var x = event.clientX;
    var y = event.clientY;
    console.log("X coords: " + x + ", Y coords: " + y);
}
</script>
~~~

## d) Let's do a cube!
* triangles to cube. Simple. Nice. Good for your health
