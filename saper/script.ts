//START = 1
//META = -1
//OBSTACLE = -10/

// arr[][] = [Y][X] !!!

import { Coords, Sizes, GameStartProc } from './modules/interfaces'
import { Variables, Flags } from './modules/variables'

class Field {
  private readonly x: number;
  private readonly y: number;
  public div: HTMLDivElement;

  constructor(position: Coords) {
    this.x = position.x;
    this.y = position.y;
    this.div = document.createElement("div");
    this.init();
  }
  private init(): void {
    this.div.classList.add("field");
    this.div.dataset.x = String(this.x);
    this.div.dataset.y = String(this.y);
    this.div.addEventListener("click", (event) => this.clickF(event));
  }

  private clickF(event: Event): void {
    let target = event.target as HTMLDivElement
    if (Flags.flagStart == true) {
      //JEŚLI KULKA KLIKNIĘTA
      if (target.parentElement.className == "field")
        console.log(event.target); // KULKA
      // if (event.target.children[0]) console.log(event.target.children[0]);
      // if (event.target.children[0] == undefined) console.log("und")
      // if (event.target.innerHTML == "X") {

      //JEŚLI KULKA KLIKNIĘTA
      if (target.parentElement.className == "field") {
        //SPRAWDZENIE CZY RUCH JEST MOŻLIWY
        const X: number = Number(target.parentElement.dataset.x);
        const Y: number = Number(target.parentElement.dataset.y);
        let impossibleMove: boolean = true
        if (Y > 0) {
          if (Variables.arr[Y - 1][X] == 0) {
            impossibleMove = false
          }
        }

        if (Y < Variables.sizes.height - 1) {
          if (Variables.arr[Y + 1][X] == 0) {
            impossibleMove = false
          }
        }

        if (X > 0) {
          if (Variables.arr[Y][X - 1] == 0) {
            impossibleMove = false
          }
        }

        if (X < Variables.sizes.width - 1) {
          if (Variables.arr[Y][X + 1] == 0) {
            impossibleMove = false
          }
        }
        //JEŚLI RUCH JEST MOŻLIWY
        if (!impossibleMove) {
          Variables.ballToMove = target
          target.classList.add("ballClicked");
          Variables.startField = target.parentElement;
          Variables.arr[parseInt(Variables.startField.dataset.y)][parseInt(Variables.startField.dataset.x)] = 1;
          Flags.flagStart = false;
        }
      }
    }
    //JEŚLI SZUKANA META
    else if (Flags.flagStart == false) {
      //JEŚLI KLIKNIĘTE PUSTE POLE
      if (target.className == "field" && target.children[0] == undefined) {

        Variables.metaField = target;
        Variables.arr[parseInt(target.dataset.y)][parseInt(target.dataset.x)] = -1;

        Flags.flagStart = true;
        Flags.foundMeta = false;
        Variables.propagationValue = 1;
        this.searchForNextProp(1);

      }
      //JEŚLI KLIKNIĘTA TA SAMA KULA
      else if (target.parentElement.dataset.x == Variables.startField.dataset.x && target.parentElement.dataset.y == Variables.startField.dataset.y) {
        Variables.ballToMove.classList.remove("ballClicked")
        Variables.arr[parseInt(Variables.startField.dataset.y)][parseInt(Variables.startField.dataset.x)] = -10;
        Variables.startField = undefined
        Flags.flagStart = true;
        console.log("odzn")
      }
      //JEŚLI KLIKNIĘTA INNA KULA
      else if (target.classList.contains("ball")) {
        //SPRAWDZENIE CZY RUCH JEST MOŻLIWY
        const X: number = Number(target.parentElement.dataset.x);
        const Y: number = Number(target.parentElement.dataset.y);
        let impossibleMove: boolean = true
        if (Y > 0) {
          if (Variables.arr[Y - 1][X] == 0) {
            impossibleMove = false
          }
        }

        if (Y < Variables.sizes.height - 1) {
          if (Variables.arr[Y + 1][X] == 0) {
            impossibleMove = false
          }
        }

        if (X > 0) {
          if (Variables.arr[Y][X - 1] == 0) {
            impossibleMove = false
          }
        }

        if (X < Variables.sizes.width - 1) {
          if (Variables.arr[Y][X + 1] == 0) {
            impossibleMove = false
          }
        }
        if (!impossibleMove) {
          Variables.ballToMove.classList.remove("ballClicked")
          Variables.arr[parseInt(Variables.startField.dataset.y)][parseInt(Variables.startField.dataset.x)] = -10;
          Variables.ballToMove = target
          target.classList.add("ballClicked");
          Variables.startField = target.parentElement;
          Variables.arr[parseInt(Variables.startField.dataset.y)][parseInt(Variables.startField.dataset.x)] = 1;
        }
      }
    }

    //ZDARZENIE KLIKU W KONSOLI
    if (target.parentElement.dataset.x)
      console.log(
        "clicked: x = " +
        target.parentElement.dataset.x +
        "; y = " +
        target.parentElement.dataset.y
      );
    else {
      console.log(
        "clicked: x = " +
        target.dataset.x +
        "; y = " +
        target.dataset.y
      );
    }
  }

  //ZBIERANIE PÓL DO SPRAWDZENIA
  private searchForNextProp(p: number): void {
    if (Flags.foundMeta == false) {
      for (let y: number = 0; y < Variables.sizes.height; y++) {
        for (let x: number = 0; x < Variables.sizes.width; x++) {
          if (Variables.arr[y][x] == p) {
            // console.log(x + ", " + y)
            Variables.toCheck.push(
              document.querySelector(`[data-x="${x}"][data-y="${y}"]`)
            );
          }
        }
      }
      // console.log(toCheck)
      if (Variables.toCheck.length == 0) {
        Flags.foundMeta = true;
        this.findPath(Variables.metaField);
      }
      this.fill();
    }
  }

  //PRZYPISANIE IM "WAGI"
  private fill(): void {
    let i: number = Variables.toCheck.length - 1;
    while (Variables.toCheck.length > 0) {
      // console.log(toCheck[i])
      this.check(Variables.toCheck[i]);
      i -= 1;
    }
    Variables.propagationValue += 1;
    // setTimeout(() => {
    this.searchForNextProp(Variables.propagationValue);
    // }, 200);
  }

  //SPRAWDZANIE OTOCZENIA PÓL
  private check(div: HTMLDivElement): void {
    const X: number = Number(div.dataset.x);
    const Y: number = Number(div.dataset.y);
    if (Y > 0) {
      if (Variables.arr[Y - 1][X] == 0) {
        Variables.arr[Y - 1][X] = Variables.propagationValue + 1;
      }
    }

    if (Y < Variables.sizes.height - 1) {
      if (Variables.arr[Y + 1][X] == 0) {
        Variables.arr[Y + 1][X] = Variables.propagationValue + 1;
      }
    }

    if (X > 0) {
      if (Variables.arr[Y][X - 1] == 0) {
        Variables.arr[Y][X - 1] = Variables.propagationValue + 1;
      }
    }

    if (X < Variables.sizes.width - 1) {
      if (Variables.arr[Y][X + 1] == 0) {
        Variables.arr[Y][X + 1] = Variables.propagationValue + 1;
      }
    }
    Variables.toCheck.pop();
  }

  private findPath(field: HTMLDivElement): void {
    //SZUKANIE ŚCIEŻKI
    field.classList.add("path");
    Variables.path.push(field);
    const X: number = Number(field.dataset.x);
    const Y: number = Number(field.dataset.y);
    let lowestVal: number = 99;
    let possibleMove: boolean = false
    let lowX: number;
    let lowY: number;

    //JEŚLI POLE NIE JEST STARTEM
    if (Variables.arr[Y][X] != 1) {
      if (Y > 0) { //GÓRA
        if (Variables.arr[Y - 1][X] < lowestVal && Variables.arr[Y - 1][X] > 0) {
          possibleMove = true
          lowestVal = Variables.arr[Y - 1][X];
          lowX = X;
          lowY = Y - 1;
        }
      }

      if (Y < Variables.sizes.height - 1) { //DÓŁ
        if (Variables.arr[Y + 1][X] < lowestVal && Variables.arr[Y + 1][X] > 0) {
          possibleMove = true
          lowestVal = Variables.arr[Y + 1][X];
          lowX = X;
          lowY = Y + 1;
        }
      }

      if (X > 0) { //LEWO
        if (Variables.arr[Y][X - 1] < lowestVal && Variables.arr[Y][X - 1] > 0) {
          possibleMove = true
          lowestVal = Variables.arr[Y][X - 1];
          lowX = X - 1;
          lowY = Y;
        }
      }

      if (X < Variables.sizes.width - 1) { //PRAWO
        if (Variables.arr[Y][X + 1] < lowestVal && Variables.arr[Y][X + 1] > 0) {
          possibleMove = true
          lowestVal = Variables.arr[Y][X + 1];
          lowX = X + 1;
          lowY = Y;
        }
      }
      //JEŚLI MOŻLIWE DOJŚCIE DO DANEGO PUNKTU
      if (possibleMove == true)
        this.findPath(
          document.querySelector(`[data-x="${lowX}"][data-y="${lowY}"]`)
        );
      else {
        console.log("nie da się")
        Variables.ballToMove.classList.remove("ballClicked")
        Variables.arr[parseInt(Variables.startField.dataset.y)][parseInt(Variables.startField.dataset.x)] = -10;

        //CZYSZCZENIE SCIEZKI
        for (let i: number = 0; i < Variables.path.length; i++) {
          Variables.path[i].classList.remove("path");
        }
        Variables.path = [];
        for (let y: number = 0; y < Variables.sizes.height; y++) {
          for (let x: number = 0; x < Variables.sizes.width; x++) {
            if (Variables.arr[x][y] >= -1) Variables.arr[x][y] = 0;
          }
        }
      }
    } else {
      console.log(Variables.path);

      setTimeout(() => {
        //CZYSZCZENIE SCIEZKI
        for (let i: number = 0; i < Variables.path.length; i++) {
          Variables.path[i].classList.remove("path");
        }
        Variables.path = [];
        for (let y: number = 0; y < Variables.sizes.height; y++) {
          for (let x: number = 0; x < Variables.sizes.width; x++) {
            if (Variables.arr[x][y] >= -1) Variables.arr[x][y] = 0;
          }
        }
        Variables.startField.innerHTML = "";
        // metaField.innerHTML = "X";
        Variables.metaField.appendChild(Variables.ballToMove);
        Variables.ballToMove.classList.remove("ballClicked")
        Variables.arr[parseInt(Variables.metaField.dataset.y)][parseInt(Variables.metaField.dataset.x)] = -10;
        console.table(Variables.arr);

        //DODAWANIE KOLEJNYCH KUL NA PLANSZE
        for (let i = 0; i < 3; i++) {
          let x = Math.floor(Math.random() * Variables.sizes.width);
          let y = Math.floor(Math.random() * Variables.sizes.height);
          while (Variables.arr[y][x] == -10) {
            x = Math.floor(Math.random() * Variables.sizes.width);
            y = Math.floor(Math.random() * Variables.sizes.height);
          }
          if (Variables.arr[y][x] == 0) {
            Variables.arr[y][x] = -10;
            document.querySelector(`[data-x="${x}"][data-y="${y}"]`).appendChild(Variables.nextBalls[i])
          }
        }
        Variables.nextBalls = []
        //LOSOWANIE KOLEJNYCH DO DODANIA
        for (let i = 0; i < 3; i++) {
          const rand: number = Math.floor(Math.random() * Variables.colors.length);
          const color: string = Variables.colors[rand];

          let ball: HTMLDivElement = document.createElement("div");
          ball.classList.add("ball");
          ball.classList.add(color);
          ball.dataset.color = String(color);
          Variables.nextBalls.push(ball)
          document.getElementById("preview").appendChild(ball);
        }

        //SPRAWDZANIE CZY KONIEC GRY
        let haveToEnd: boolean = true
        for (let y: number = 0; y < Variables.sizes.height; y++) {
          for (let x: number = 0; x < Variables.sizes.width; x++) {
            if (Variables.arr[y][x] != -10) {
              haveToEnd = false
            }
          }
        }
        if (haveToEnd) {
          setTimeout(() => {
            // alert("koniec")
            let ending: HTMLDivElement = document.createElement("div");
            ending.classList.add("endingBox");
            document.body.classList.add("dark")
            ending.innerHTML = `<p>GAME OVER!!!</p><p>YOU SCORED <label class="colored">${Variables.points}</label> POINTS!</p><p style="font-size:50%">(but don't worry, no one can score more :p)</p><br><p>TO PLAY AGAIN, PLEASE PRESS THE BUTTON BELOW...</p><button id="continue">CONTINUE</button>`
            document.body.prepend(ending);
            document.getElementById("continue").addEventListener("click", (event) => { location.reload() });
          }, 300);
        }
      }, 300);
    }
  }
}

interface GameBoard {
  width: number;
  height: number;
  create(): void
}

class Board implements GameBoard {
  width: number;
  height: number;
  // array: number[][];

  constructor(sizes: Sizes) {
    this.width = sizes.width;
    this.height = sizes.height;
    // this.array = [];
    this.init();
  }
  private init(): void {
    console.log("Initialization...")
  }

  create() {
    //TWORZENIE TABLICY 2D I UZUPELNIANIE ZERAMI
    for (let i: number = 0; i < Variables.sizes.height; i++) Variables.arr.push([]);
    for (let y: number = 0; y < Variables.sizes.height; y++) {
      for (let x: number = 0; x < Variables.sizes.width; x++) {
        Variables.arr[x][y] = 0;
      }
    }

    document.getElementById("points").innerText = `POINTS: ${Variables.points}`

    //LOSOWANIE PIERWSZYCH KULEK
    for (let i = 0; i < 3; i++) {
      let x = Math.floor(Math.random() * Variables.sizes.width);
      let y = Math.floor(Math.random() * Variables.sizes.height);
      while (Variables.arr[y][x] == -10) {
        x = Math.floor(Math.random() * Variables.sizes.width);
        y = Math.floor(Math.random() * Variables.sizes.height);
      }
      if (Variables.arr[y][x] == 0) Variables.arr[y][x] = -10;
    }
    //LOSOWANIE PIERWSZYCH NASTĘPNYCH
    for (var i = 0; i < 3; i++) {
      const rand: number = Math.floor(Math.random() * Variables.colors.length);
      const color: string = Variables.colors[rand];

      let ball: HTMLDivElement = document.createElement("div");
      ball.classList.add("ball");
      ball.classList.add(color);
      ball.dataset.color = String(color);
      Variables.nextBalls.push(ball)
      document.getElementById("preview").appendChild(ball);
    }

    // arr[0][2] = 1; //[Y][X] !!!
    console.table(Variables.arr);
  }
}

function startGame(prompt: string, sizes: Sizes) {
  // alert(`${prompt} ON ${sizes.height}X${sizes.width} PLANE.\nGL HF!`)
  let welcome: HTMLDivElement = document.createElement("div");
  welcome.classList.add("welcomeBox");
  welcome.innerHTML = `<p>${prompt} ON ${sizes.height}X${sizes.width} PLANE.</p><p>GL HF!</p>`
  document.body.appendChild(welcome);

  setTimeout(() => {
    welcome.classList.add("hidden");
  }, 2000);
}

const board = new Board(Variables.sizes);
board.create()

const start: GameStartProc = startGame
start("GAME IS STARTING", Variables.sizes)

for (let y: number = 0; y < Variables.sizes.height; y++) {
  for (let x: number = 0; x < Variables.sizes.width; x++) {
    const field: HTMLDivElement = new Field({ x, y }).div;
    document.getElementById("main").appendChild(field);
    if (Variables.arr[y][x] == -10) {
      //DODAWANIE PIERWSZYCH KULEK NA PLANSZE
      let rand: number = Math.floor(Math.random() * Variables.colors.length);
      let color: string = Variables.colors[rand];

      let ball: HTMLDivElement = document.createElement("div");
      ball.classList.add("ball");
      ball.classList.add(color);
      ball.dataset.color = String(color);
      field.appendChild(ball);
    }
    // else field.innerHTML = arr[y][x];
  }
}
