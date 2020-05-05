# Web Design @cmda-minor-web 1920
**How can you make a podcast more interesting for someone who's Deaf.**

## Table of contents
- [Case](#case)
    - [Marie](#marie)
    - [Proces](#proces)
- [Installation](#installation)
    - [Creating your own transcript](#creating-your-own-transcript)
- [License](#license)

## Case:
School asked me the question how can we make podcasts a lot more interesting for people who are Deaf. In particular one person:

### Marie
Marie van Driessche is Deaf. With a capital D, that means sign language is her native language. The assignment is to tune the podcast to her liking.

### Proces
How'd go? Check it my [weekly logs](https://github.com/gijslaarman/web-design-1920/wiki).


## Demo
![Two screenshots of the working demo. On the left side: First view, small summary to see if the podcast is worth your time. On the right side: Podcast in action but paused.](docs/img/screenshots.jpg)
     
> Left side: First view, small summary to see if the podcast is worth your time.
> Right side: Podcast in action but paused.

[Click here for the demo](https://gijslaarman.github.io/web-design-1920)

## Installation
Copy & paste:
```
git clone https://github.com/gijslaarman/web-design-1920.git && cd web-design-1920
```

That's all. This is build in vanilla js.

### Creating your own transcript
All the data is super easy to adjust. An example is in the [podcast.json](https://github.com/gijslaarman/web-design-1920/blob/master/podcast.json).

Edit it to your liking and the engine will take care of the rest ;). Just put the blocks in chronological order.

Current working blocks:
```json
// Text message
{
    "type": "message",
    "talking": "<name_of_one_of_the_hosts>",
    "message": "<your_message_goes_here>"
},

{
    "type": "pause",
    "length": 2000, // Number in milliseconds.
    "message": "<your_mesage_goes_here>" // Text inside the pause block.
},

{
    "type": "image",
    "imageSrc": "./img/test.gif", // Image source.
    "imageName": "intro", // Alt text
    "length": 4000 // Time before next block appears.
},
```

## License
MIT free to use. [License](https://github.com/gijslaarman/web-design-1920/blob/master/LICENSE)