import * as prettier from "prettier";

const divList = {
  black: "text-black",
  dark_blue: "text-blue-800",
  dark_green: "text-green-800",
  dark_red: "text-red-800",
  dark_purple: "text-purple-800",
  gold: "text-yellow-400",
  gray: "text-gray-600",
  dark_gray: "text-gray-800",
  blue: "text-blue-400",
  green: "text-green-400",
  aqua: "text-cyan-400",
  red: "text-red-400",
  light_purple: "text-purple-300",
  yellow: "text-yellow-400",
  white: "text-white",
  strikethrough: "line-through",
  st: "line-through",
  u: "underline",
  underlined: "underline",
  italic: "italic",
  em: "italic",
  i: "italic",
  bold: "font-bold",
  b: "font-bold",
};

export default function parseToHTML(m: string): Promise<string> {
  return new Promise<string>((g, b) => {
    fetch("https://webui.advntr.dev/api/mini-to-json", {
      method: "POST",
      body: JSON.stringify({
        miniMessage: m,
        placeholders: { stringPlaceholders: {} },
      }),
    }).then((j) => {
      j.json().then((l) => {
        if (typeof l === "string") {
          g(l);
        } else {
          // This text has custom properties
          var allHTML = "";
          var root: Array<Element | string> = l.extra;
          root.forEach((i) => {
            if (typeof i === "string") {
              allHTML += i;
            } else {
              var curClass = "";
              var contents = "";
              if (i.extra != undefined) {
                i.extra.forEach((m) => {
                  contents += objToHTML(m);
                });
              }
              if (i.color != undefined) {
                if (divList[i.color] == undefined) {
                  curClass +=
                    curClass == ""
                      ? "text-[" + i.color + "]"
                      : " text-[" + i.color + "]";
                } else {
                  curClass +=
                    curClass == "" ? divList[i.color] : " " + divList[i.color];
                }
              }
              if (i.strikethrough == true) {
                curClass += curClass == "" ? "line-through" : " line-through";
              }
              if (i.bold == true) {
                curClass += curClass == "" ? "font-bold" : " font-bold";
              }
              if (i.italic == true) {
                curClass += curClass == "" ? "italic" : " italic";
              }
              allHTML += createHTML("span", curClass, i.text + contents);
            }
          });
          prettier
            .format("<div>" + allHTML + "</div>", {
              parser: "babel",
              semi: false,
            })
            .then((s) => {
              g(s.substring(1));
            });
        }
      });
      if (!j.ok) {
        b("Problem while parsing MiniMessage");
      }
    });
  });
}

function objToHTML(i: Element): string {
  var curClass = "";
  var contents = "";
  if (i.extra != undefined) {
    i.extra.forEach((m) => {
      contents += objToHTML(m);
    });
  }
  if (i.color != undefined) {
    if (divList[i.color] == undefined) {
      curClass +=
        curClass == "" ? "text-[" + i.color + "]" : " text-[" + i.color + "]";
    } else {
      curClass += curClass == "" ? divList[i.color] : " " + divList[i.color];
    }
  }
  if (i.strikethrough == true) {
    curClass += curClass == "" ? "line-through" : " line-through";
  }
  if (i.bold == true) {
    curClass += curClass == "" ? "font-bold" : " font-bold";
  }
  if (i.italic == true) {
    curClass += curClass == "" ? "italic" : " italic";
  }
  return createHTML("span", curClass, i.text + contents);
}

function createHTML(tag: string, className: string, contents: string) {
  return (
    "<" + tag + ' class="' + className + '">' + contents + "</" + tag + ">"
  );
}
type Element = {
  text: string;
  extra: Array<Element>;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
};

