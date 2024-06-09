# Minimessage-2-HTML
This package converts the [MiniMessage format](https://webui.advntr.dev/) into HTML, which can be used for showing MOTD's etc.

## Usage
```ts
var miniMessage = require("minimessage-2-html")
var motd = "<red>hello world</red>";

miniMessage.parseToHTML(motd).then((m) => {
  console.log(m)
})
```
