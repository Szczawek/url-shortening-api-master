const input = document.getElementById("generate-link");
const btnSubmit = document.getElementById("submit");
const linkHistory = document.getElementById("link-history");
const btnHamburger = document.getElementById("hamburger");
const nav = document.querySelector("nav");
class NavBar {
  constructor(width, open) {
    this.width = width;
    this.open = open;
  }
  unfoldNav() {
    if (this.width < 640) {
      btnHamburger.classList.remove("vanish");
      nav.classList.add("vanish");
      if (this.open) {
        nav.classList.remove("vanish");
      }
    } else {
      btnHamburger.classList.add("vanish");
      nav.classList.remove("vanish");
    }
  }
}

window.addEventListener("resize", () => {
  new NavBar(innerWidth, false).unfoldNav();
  btnHamburger.classList.remove("active");
});

let remove = false;
btnHamburger.addEventListener("click", function navFold() {
  const width = innerWidth;
  if (width < 640) {
    this.classList.toggle("active");
    if (remove) {
      new NavBar(innerWidth, false).unfoldNav();
      remove = false;
    } else {
      new NavBar(innerWidth, true).unfoldNav();
      remove = true;
    }
  }
});

 
let num;
function start() {
  if(!localStorage.getItem("currentPostion")) {
    localStorage.setItem("currentPostion", 1)
    localStorage.setItem("count",0)
  }
  const bar = new NavBar(innerWidth, false);
  bar.unfoldNav();
  num = localStorage.getItem("currentPostion")
  count = localStorage.getItem("count")

}

//Creates a new short link and saves the last three links
// setTimeout function must be, because if someone spam clicks the button, the fetch function gives us an error
let time = 0;
let count = 0;
let removeSaveHis = false;
btnSubmit.addEventListener("click", () => {
  time += 1000;
  setTimeout(() => {
    const val = input.reportValidity();
    if (val) {
      input.classList.remove("valid");
      const createLink = new Link(input.value);
      if (count == 3) {
        createLink.removeLink();
      } else {
        count++;
      }
      createLink.askForLink();
    } else {
      input.classList.add("valid");
    }
    localStorage.setItem("count",count)
    time -= 1000;
  }, time);
});
class Link {
  constructor(link,shortLink = "") {
    this.link = link;
    this.shortLink = shortLink
  }
  addLink() {
    const container = document.createElement("li");
    const linkText = document.createElement("p");
    linkText.textContent = this.link;
    container.appendChild(linkText);
    const div = document.createElement("div");
    const sorthLinkText = document.createElement("p");
    sorthLinkText.textContent = this.shortLink;
    div.appendChild(sorthLinkText);
    const btn = document.createElement("button");
    btn.className = "btn-cyan";
    btn.id = "btn-copy";
    btn.textContent = "Copy";
    div.appendChild(btn);
    container.appendChild(div);
    btn.addEventListener("click", function text() {
      this.textContent = "Copied!";
    });
    linkHistory.prepend(container);
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(this.shortLink);
    });
  }
  removeLink() {
    linkHistory.removeChild(linkHistory.lastChild);
  }
  async askForLink() {
    fetch(`https://api.shrtco.de/v2/shorten?url=${this.link}`)
      .then((e) => {
        if (!e.ok) throw new Error("You fuck up");
        return e.json();
      })
      .then((e) => {
        this.shortLink = e["result"]["full_short_link3"];
        this.save();
        this.addLink();
      })
      .catch((error) => console.log(error));
  }
  save() {
    localStorage.setItem("currentPostion", num)
    if(removeSaveHis) {
      localStorage.removeItem(`item-${num}`)
    }
    localStorage.setItem(`item-${num}`, `${this.link} 1 ${this.shortLink}`)
    if(num == 3) {
      num = 1
      removeSaveHis = true
    } else {
      num++
    }
  }
}

start();
// localStorage.clear()
const sort = []
const item = [Object.values(localStorage)];
item[0].splice(0,1)
item[0].forEach(e=> {
for(let i = 0; i < e.length; i++) {
  if(e[i] == 1) {
    new Link(e.slice(0,i),e.slice(i+1, e.length-1)).addLink()
  }
}
})
