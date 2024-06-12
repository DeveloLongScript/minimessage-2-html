"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tw_to_css_1 = require("tw-to-css");
var divList = {
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
function parseToHTML(m, tw) {
    return new Promise(function (g, b) {
        fetch("https://webui.advntr.dev/api/mini-to-json", {
            method: "POST",
            body: JSON.stringify({
                miniMessage: m,
                placeholders: { stringPlaceholders: {} },
            }),
        }).then(function (j) {
            j.json().then(function (l) {
                if (typeof l === "string") {
                    g(l);
                }
                else {
                    // This text has custom properties
                    var allHTML = "";
                    var root = l.extra;
                    if (root == undefined) {
                        var curClass = "";
                        var contents = "";
                        if (l.color != undefined) {
                            if (divList[l.color] == undefined) {
                                curClass +=
                                    curClass == ""
                                        ? "text-[" + l.color + "]"
                                        : " text-[" + l.color + "]";
                            }
                            else {
                                curClass +=
                                    curClass == "" ? divList[l.color] : " " + divList[l.color];
                            }
                        }
                        if (l.strikethrough == true) {
                            curClass += curClass == "" ? "line-through" : " line-through";
                        }
                        if (l.bold == true) {
                            curClass += curClass == "" ? "font-bold" : " font-bold";
                        }
                        if (l.italic == true) {
                            curClass += curClass == "" ? "italic" : " italic";
                        }
                        allHTML += createHTML("span", curClass, l.text + contents);
                    }
                    else {
                        root.forEach(function (i) {
                            if (typeof i === "string") {
                                allHTML += i;
                            }
                            else {
                                var curClass = "";
                                var contents = "";
                                if (i.extra != undefined) {
                                    i.extra.forEach(function (m) {
                                        contents += objToHTML(m);
                                    });
                                }
                                if (i.color != undefined) {
                                    if (divList[i.color] == undefined) {
                                        curClass +=
                                            curClass == ""
                                                ? "text-[" + i.color + "]"
                                                : " text-[" + i.color + "]";
                                    }
                                    else {
                                        curClass +=
                                            curClass == ""
                                                ? divList[i.color]
                                                : " " + divList[i.color];
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
                                allHTML += createHTML("span", curClass, l.text + contents);
                            }
                        });
                    }
                    g("<div>" + allHTML + "</div>");
                }
            });
            if (!j.ok) {
                b("Problem while parsing MiniMessage");
            }
        });
    });
}
exports.default = parseToHTML;
function objToHTML(i) {
    var curClass = "";
    var contents = "";
    if (i.extra != undefined) {
        i.extra.forEach(function (m) {
            contents += objToHTML(m);
        });
    }
    if (i.color != undefined) {
        if (divList[i.color] == undefined) {
            curClass +=
                curClass == "" ? "text-[" + i.color + "]" : " text-[" + i.color + "]";
        }
        else {
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
function createHTML(tag, className, contents, tw) {
    if (className == undefined)
        className = "";
    if (contents == undefined)
        contents = "";
    if (contents == "undefined")
        return "<br/>";
    if (tw == false || tw == undefined) {
        return ("<" +
            tag +
            ' style="' +
            (0, tw_to_css_1.twi)(className) +
            '">' +
            contents +
            "</" +
            tag +
            ">");
    }
    else {
        return ("<" + tag + ' class="' + className + '">' + contents + "</" + tag + ">");
    }
}
