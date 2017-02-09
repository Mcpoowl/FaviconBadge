# FaviconBadge

This Mendix widget allows you to set a badge (value based on a String) next to your application favicon.


## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Typical usage scenario

Useful for when you want to show users how many tasks they have for example
 
## Description

The widget makes use of the favico.js library and allows you to show a badge next to your favicon. The badge shows a String (or a number with toString ;-) ) next to your favicon.


## Configuration

* Drag the widget in a Dataview (Account for example) and select a microflow which returns a String. The widget will update everytime the context object changes. 
* Set the desired animation type
* ...
* Profit


## Known issues

* There must be a `<link rel="icon" ..... > favicon link` present in your index.html, otherwise the default favicon is overwritten and you'll only see the badge.

## Roadmap

* No context version of the widget.
* Refresh the microflow every X seconds so the value gets updated without the need to have (or refresh) your context object.
* More properties, like coloring, shapes, icons etc.


