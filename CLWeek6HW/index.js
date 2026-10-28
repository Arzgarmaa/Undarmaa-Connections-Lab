let express = require("express");
let app = express();

let signs = {
    "data" : [
      {
        "color": "red",
        "date": "~100,000 BCE",
        "info": "Red is the oldest color used by humans. Early cave painters made it using natural earth clay called ochre. Because it looks like blood and fire, it has always universally symbolized life, power, fertility, and danger."
    },
    {
        "color": "blue",
        "date": "~3000 BCE",
        "info": "Blue was incredibly rare in the ancient world, and many languages didn't even have a word for it. The ancient Egyptians had to invent a complex synthetic recipe using sand and copper just to make a stable blue paint."
    },
    {
        "color": "yellow",
        "date": "~25,000 BCE",
        "info": "Yellow was a color of warning and supreme status. While cave artists used natural clay, later cultures used toxic arsenic minerals. In ancient China, it was a royal color that only the Emperor was legally allowed to wear."
    },
    {
        "color": "green",
        "date": "~10,000 BCE",
        "info": "Green was abundant in nature but notoriously difficult to recreate as a stable dye, often fading quickly to brown. In the 1800s, a popular bright green dye made with arsenic accidentally poisoned people through their wallpaper."
    },
    {
        "color": "purple",
        "date": "~1600 BCE",
        "info": "Purple was the ultimate historic symbol of extreme wealth and royalty. It was harvested from the mucus of thousands of rare sea snails. The process was so expensive that laws restricted its use strictly to kings and emperors."
    },
    {
        "color": "orange",
        "date": "~1500s",
        "info": "The color was named after the fruit, not the other way around. Before Portuguese merchants brought the citrus fruit to Europe from Asia, European languages did not have a single word for it and simply called it yellow-red."
    },
    {
        "color": "pink",
        "date": "~1700s",
        "info": "Pink was originally considered a masculine color in Western fashion. Because it was viewed as a light red—the color of war—it was traditionally worn by young boys. It didn't shift to a feminine color until commercial marketing changed in the 1950s."
    },
    {
        "color": "black",
        "date": "~40,000 BCE",
        "info": "Black was one of the very first colors used in primeval art, created by cave dwellers using burned wood and charcoal. Throughout human history, it has consistently represented darkness, mourning, authority, and high-end elegance."
    },
    {
        "color": "white",
        "date": "~40,000 BCE",
        "info": "White was sourced by ancient artists from natural chalk and ground bones. Across early cultures, it symbolized spiritual purity and light. Because it was the hardest color to keep clean, it also signaled that the wearer did no manual labor."
    },
    {
        "color": "brown",
        "date": "~40,000 BCE",
        "info": "Brown was historically the color of the lower working class. Because it was cheap to produce from common dirt and clay, ancient sumptuary laws frequently forced poor citizens and peasants to wear brown to easily show their low social rank."
    }  
    ]
}
//  ene deer baahan aldaa zaasan ni daslal avaagui baisan, avah ystoi gazruudd ni daslal avah
//  ene req res ni request and response
app.get('/', (req,res)=> {
    res.send("this is the root page");
})

app.get('/about', (req,res)=> {
    res.send("this is the about page");
})

app.get('/data', (req,res)=> {
    res.json(signs);
})

app.get('/data/:specialdata', (req,res)=>
{
    console.log(req.params.specialdata);
    let user_specialdata = req.params.specialdata;
    let user_obj; 
    for(let i=0;i<signs.data.length;i++) {
        if(user_specialdata == signs.data[i].color){
            user_obj = signs.data[i];
        }
    }
    console.log(user_obj);
    if(user_obj) {
    res.json(user_obj)
 } else {
    res.json({status: "information not found"})
 }   
})

app.listen(3000, ()=> {
    console.log("listening at 3000")
})