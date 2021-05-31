//START = 1
//META = -1
//OBSTACLE = -10/
var variables_1 = require('./variables');
var Field = (function () {
    function Field(position) {
        this.readonly = x;
        this.readonly = y;
        this.x = position.x;
        this.y = position.y;
        this.div = document.createElement("div");
        this.init();
    }
    Field.prototype.init = function () {
        var _this = this;
        this.div.classList.add("field");
        this.div.dataset.x = String(this.x);
        this.div.dataset.y = String(this.y);
        this.div.addEventListener("click", function (event) { return _this.clickF(event); });
    };
    Field.prototype.clickF = function (event) {
        var target = event.target, as = HTMLDivElement;
        if (variables_1.Flags.flagStart == true) {
            //JEŚLI KULKA KLIKNIĘTA
            if (target.parentElement.className == "field")
                console.log(event.target); // KULKA
            // if (event.target.children[0]) console.log(event.target.children[0]);
            // if (event.target.children[0] == undefined) console.log("und")
            // if (event.target.innerHTML == "X") {
            //JEŚLI KULKA KLIKNIĘTA
            if (target.parentElement.className == "field") {
                //SPRAWDZENIE CZY RUCH JEST MOŻLIWY
                var X = Number(target.parentElement.dataset.x);
                var Y = Number(target.parentElement.dataset.y);
                var impossibleMove = true;
                if (Y > 0) {
                    if (variables_1.Variables.arr[Y - 1][X] == 0) {
                        impossibleMove = false;
                    }
                }
                if (Y < variables_1.Variables.sizes.height - 1) {
                    if (variables_1.Variables.arr[Y + 1][X] == 0) {
                        impossibleMove = false;
                    }
                }
                if (X > 0) {
                    if (variables_1.Variables.arr[Y][X - 1] == 0) {
                        impossibleMove = false;
                    }
                }
                if (X < variables_1.Variables.sizes.width - 1) {
                    if (variables_1.Variables.arr[Y][X + 1] == 0) {
                        impossibleMove = false;
                    }
                }
                //JEŚLI RUCH JEST MOŻLIWY
                if (!impossibleMove) {
                    variables_1.Variables.ballToMove = target;
                    target.classList.add("ballClicked");
                    variables_1.Variables.startField = target.parentElement;
                    variables_1.Variables.arr[parseInt(variables_1.Variables.startField.dataset.y)][parseInt(variables_1.Variables.startField.dataset.x)] = 1;
                    variables_1.Flags.flagStart = false;
                }
            }
        }
        else if (variables_1.Flags.flagStart == false) {
            //JEŚLI KLIKNIĘTE PUSTE POLE
            if (target.className == "field" && target.children[0] == undefined) {
                variables_1.Variables.metaField = target;
                variables_1.Variables.arr[parseInt(target.dataset.y)][parseInt(target.dataset.x)] = -1;
                variables_1.Flags.flagStart = true;
                variables_1.Flags.foundMeta = false;
                variables_1.Variables.propagationValue = 1;
                this.searchForNextProp(1);
            }
            else if (target.parentElement.dataset.x == variables_1.Variables.startField.dataset.x && target.parentElement.dataset.y == variables_1.Variables.startField.dataset.y) {
                variables_1.Variables.ballToMove.classList.remove("ballClicked");
                variables_1.Variables.arr[parseInt(variables_1.Variables.startField.dataset.y)][parseInt(variables_1.Variables.startField.dataset.x)] = -10;
                variables_1.Variables.startField = undefined;
                variables_1.Flags.flagStart = true;
                console.log("odzn");
            }
            else if (target.classList.contains("ball")) {
                //SPRAWDZENIE CZY RUCH JEST MOŻLIWY
                var X = Number(target.parentElement.dataset.x);
                var Y = Number(target.parentElement.dataset.y);
                var impossibleMove = true;
                if (Y > 0) {
                    if (variables_1.Variables.arr[Y - 1][X] == 0) {
                        impossibleMove = false;
                    }
                }
                if (Y < variables_1.Variables.sizes.height - 1) {
                    if (variables_1.Variables.arr[Y + 1][X] == 0) {
                        impossibleMove = false;
                    }
                }
                if (X > 0) {
                    if (variables_1.Variables.arr[Y][X - 1] == 0) {
                        impossibleMove = false;
                    }
                }
                if (X < variables_1.Variables.sizes.width - 1) {
                    if (variables_1.Variables.arr[Y][X + 1] == 0) {
                        impossibleMove = false;
                    }
                }
                if (!impossibleMove) {
                    variables_1.Variables.ballToMove.classList.remove("ballClicked");
                    variables_1.Variables.arr[parseInt(variables_1.Variables.startField.dataset.y)][parseInt(variables_1.Variables.startField.dataset.x)] = -10;
                    variables_1.Variables.ballToMove = target;
                    target.classList.add("ballClicked");
                    variables_1.Variables.startField = target.parentElement;
                    variables_1.Variables.arr[parseInt(variables_1.Variables.startField.dataset.y)][parseInt(variables_1.Variables.startField.dataset.x)] = 1;
                }
            }
        }
        //ZDARZENIE KLIKU W KONSOLI
        if (target.parentElement.dataset.x)
            console.log("clicked: x = " +
                target.parentElement.dataset.x +
                "; y = " +
                target.parentElement.dataset.y);
        else {
            console.log("clicked: x = " +
                target.dataset.x +
                "; y = " +
                target.dataset.y);
        }
    };
    //ZBIERANIE PÓL DO SPRAWDZENIA
    Field.prototype.searchForNextProp = function (p) {
        if (variables_1.Flags.foundMeta == false) {
            for (var y = 0; y < variables_1.Variables.sizes.height; y++) {
                for (var x = 0; x < variables_1.Variables.sizes.width; x++) {
                    if (variables_1.Variables.arr[y][x] == p) {
                        // console.log(x + ", " + y)
                        variables_1.Variables.toCheck.push(document.querySelector("[data-x=\"" + x + "\"][data-y=\"" + y + "\"]"));
                    }
                }
            }
            // console.log(toCheck)
            if (variables_1.Variables.toCheck.length == 0) {
                variables_1.Flags.foundMeta = true;
                this.findPath(variables_1.Variables.metaField);
            }
            this.fill();
        }
    };
    //PRZYPISANIE IM "WAGI"
    Field.prototype.fill = function () {
        var i = variables_1.Variables.toCheck.length - 1;
        while (variables_1.Variables.toCheck.length > 0) {
            // console.log(toCheck[i])
            this.check(variables_1.Variables.toCheck[i]);
            i -= 1;
        }
        variables_1.Variables.propagationValue += 1;
        // setTimeout(() => {
        this.searchForNextProp(variables_1.Variables.propagationValue);
        // }, 200);
    };
    //SPRAWDZANIE OTOCZENIA PÓL
    Field.prototype.check = function (div) {
        var X = Number(div.dataset.x);
        var Y = Number(div.dataset.y);
        if (Y > 0) {
            if (variables_1.Variables.arr[Y - 1][X] == 0) {
                variables_1.Variables.arr[Y - 1][X] = variables_1.Variables.propagationValue + 1;
            }
        }
        if (Y < variables_1.Variables.sizes.height - 1) {
            if (variables_1.Variables.arr[Y + 1][X] == 0) {
                variables_1.Variables.arr[Y + 1][X] = variables_1.Variables.propagationValue + 1;
            }
        }
        if (X > 0) {
            if (variables_1.Variables.arr[Y][X - 1] == 0) {
                variables_1.Variables.arr[Y][X - 1] = variables_1.Variables.propagationValue + 1;
            }
        }
        if (X < variables_1.Variables.sizes.width - 1) {
            if (variables_1.Variables.arr[Y][X + 1] == 0) {
                variables_1.Variables.arr[Y][X + 1] = variables_1.Variables.propagationValue + 1;
            }
        }
        variables_1.Variables.toCheck.pop();
    };
    Field.prototype.findPath = function (field) {
        //SZUKANIE ŚCIEŻKI
        field.classList.add("path");
        variables_1.Variables.path.push(field);
        var X = Number(field.dataset.x);
        var Y = Number(field.dataset.y);
        var lowestVal = 99;
        var possibleMove = false;
        var lowX;
        var lowY;
        //JEŚLI POLE NIE JEST STARTEM
        if (variables_1.Variables.arr[Y][X] != 1) {
            if (Y > 0) {
                if (variables_1.Variables.arr[Y - 1][X] < lowestVal && variables_1.Variables.arr[Y - 1][X] > 0) {
                    possibleMove = true;
                    lowestVal = variables_1.Variables.arr[Y - 1][X];
                    lowX = X;
                    lowY = Y - 1;
                }
            }
            if (Y < variables_1.Variables.sizes.height - 1) {
                if (variables_1.Variables.arr[Y + 1][X] < lowestVal && variables_1.Variables.arr[Y + 1][X] > 0) {
                    possibleMove = true;
                    lowestVal = variables_1.Variables.arr[Y + 1][X];
                    lowX = X;
                    lowY = Y + 1;
                }
            }
            if (X > 0) {
                if (variables_1.Variables.arr[Y][X - 1] < lowestVal && variables_1.Variables.arr[Y][X - 1] > 0) {
                    possibleMove = true;
                    lowestVal = variables_1.Variables.arr[Y][X - 1];
                    lowX = X - 1;
                    lowY = Y;
                }
            }
            if (X < variables_1.Variables.sizes.width - 1) {
                if (variables_1.Variables.arr[Y][X + 1] < lowestVal && variables_1.Variables.arr[Y][X + 1] > 0) {
                    possibleMove = true;
                    lowestVal = variables_1.Variables.arr[Y][X + 1];
                    lowX = X + 1;
                    lowY = Y;
                }
            }
            //JEŚLI MOŻLIWE DOJŚCIE DO DANEGO PUNKTU
            if (possibleMove == true)
                this.findPath(document.querySelector("[data-x=\"" + lowX + "\"][data-y=\"" + lowY + "\"]"));
            else {
                console.log("nie da się");
                variables_1.Variables.ballToMove.classList.remove("ballClicked");
                variables_1.Variables.arr[parseInt(variables_1.Variables.startField.dataset.y)][parseInt(variables_1.Variables.startField.dataset.x)] = -10;
                //CZYSZCZENIE SCIEZKI
                for (var i = 0; i < variables_1.Variables.path.length; i++) {
                    variables_1.Variables.path[i].classList.remove("path");
                }
                variables_1.Variables.path = [];
                for (var y = 0; y < variables_1.Variables.sizes.height; y++) {
                    for (var x = 0; x < variables_1.Variables.sizes.width; x++) {
                        if (variables_1.Variables.arr[x][y] >= -1)
                            variables_1.Variables.arr[x][y] = 0;
                    }
                }
            }
        }
        else {
            console.log(variables_1.Variables.path);
            setTimeout(function () {
                //CZYSZCZENIE SCIEZKI
                for (var i = 0; i < variables_1.Variables.path.length; i++) {
                    variables_1.Variables.path[i].classList.remove("path");
                }
                variables_1.Variables.path = [];
                for (var y = 0; y < variables_1.Variables.sizes.height; y++) {
                    for (var x = 0; x < variables_1.Variables.sizes.width; x++) {
                        if (variables_1.Variables.arr[x][y] >= -1)
                            variables_1.Variables.arr[x][y] = 0;
                    }
                }
                variables_1.Variables.startField.innerHTML = "";
                // metaField.innerHTML = "X";
                variables_1.Variables.metaField.appendChild(variables_1.Variables.ballToMove);
                variables_1.Variables.ballToMove.classList.remove("ballClicked");
                variables_1.Variables.arr[parseInt(variables_1.Variables.metaField.dataset.y)][parseInt(variables_1.Variables.metaField.dataset.x)] = -10;
                console.table(variables_1.Variables.arr);
                //DODAWANIE KOLEJNYCH KUL NA PLANSZE
                for (var i = 0; i < 3; i++) {
                    var x = Math.floor(Math.random() * variables_1.Variables.sizes.width);
                    var y = Math.floor(Math.random() * variables_1.Variables.sizes.height);
                    while (variables_1.Variables.arr[y][x] == -10) {
                        x = Math.floor(Math.random() * variables_1.Variables.sizes.width);
                        y = Math.floor(Math.random() * variables_1.Variables.sizes.height);
                    }
                    if (variables_1.Variables.arr[y][x] == 0) {
                        variables_1.Variables.arr[y][x] = -10;
                        document.querySelector("[data-x=\"" + x + "\"][data-y=\"" + y + "\"]").appendChild(variables_1.Variables.nextBalls[i]);
                    }
                }
                variables_1.Variables.nextBalls = [];
                //LOSOWANIE KOLEJNYCH DO DODANIA
                for (var i = 0; i < 3; i++) {
                    var rand = Math.floor(Math.random() * variables_1.Variables.colors.length);
                    var color = variables_1.Variables.colors[rand];
                    var ball = document.createElement("div");
                    ball.classList.add("ball");
                    ball.classList.add(color);
                    ball.dataset.color = String(color);
                    variables_1.Variables.nextBalls.push(ball);
                    document.getElementById("preview").appendChild(ball);
                }
                //SPRAWDZANIE CZY KONIEC GRY
                var haveToEnd = true;
                for (var y = 0; y < variables_1.Variables.sizes.height; y++) {
                    for (var x = 0; x < variables_1.Variables.sizes.width; x++) {
                        if (variables_1.Variables.arr[y][x] != -10) {
                            haveToEnd = false;
                        }
                    }
                }
                if (haveToEnd) {
                    alert("koniec");
                }
            }, 300);
        }
    };
    return Field;
})();
var Board = (function () {
    // array: number[][];
    function Board(sizes) {
        this.width = sizes.width;
        this.height = sizes.height;
        // this.array = [];
        this.init();
    }
    Board.prototype.init = function () {
        console.log("Initialization...");
    };
    Board.prototype.create = function () {
        //TWORZENIE TABLICY 2D I UZUPELNIANIE ZERAMI
        for (var i_1 = 0; i_1 < variables_1.Variables.sizes.height; i_1++)
            variables_1.Variables.arr.push([]);
        for (var y = 0; y < variables_1.Variables.sizes.height; y++) {
            for (var x = 0; x < variables_1.Variables.sizes.width; x++) {
                variables_1.Variables.arr[x][y] = 0;
            }
        }
        //LOSOWANIE PIERWSZYCH KULEK
        for (var i_2 = 0; i_2 < 3; i_2++) {
            var x = Math.floor(Math.random() * variables_1.Variables.sizes.width);
            var y = Math.floor(Math.random() * variables_1.Variables.sizes.height);
            while (variables_1.Variables.arr[y][x] == -10) {
                x = Math.floor(Math.random() * variables_1.Variables.sizes.width);
                y = Math.floor(Math.random() * variables_1.Variables.sizes.height);
            }
            if (variables_1.Variables.arr[y][x] == 0)
                variables_1.Variables.arr[y][x] = -10;
        }
        //LOSOWANIE PIERWSZYCH NASTĘPNYCH
        for (var i = 0; i < 3; i++) {
            var rand = Math.floor(Math.random() * variables_1.Variables.colors.length);
            var color = variables_1.Variables.colors[rand];
            var ball = document.createElement("div");
            ball.classList.add("ball");
            ball.classList.add(color);
            ball.dataset.color = String(color);
            variables_1.Variables.nextBalls.push(ball);
            document.getElementById("preview").appendChild(ball);
        }
        // arr[0][2] = 1; //[Y][X] !!!
        console.table(variables_1.Variables.arr);
    };
    return Board;
})();
function startGame(prompt, sizes) {
    // alert(`${prompt} ON ${sizes.height}X${sizes.width} PLANE.\nGL HF!`)
    var welcome = document.createElement("div");
    welcome.classList.add("welcomeBox");
    welcome.innerHTML = prompt + " ON " + sizes.height + "X" + sizes.width + " PLANE.\nGL HF!";
    document.body.appendChild(welcome);
    setTimeout(function () {
        welcome.classList.add("hidden");
    }, 2000);
}
var board = new Board(variables_1.Variables.sizes);
board.create();
var start = startGame;
start("GAME IS STARTING", variables_1.Variables.sizes);
for (var y = 0; y < variables_1.Variables.sizes.height; y++) {
    for (var x = 0; x < variables_1.Variables.sizes.width; x++) {
        var field = new Field({ x: x, y: y }).div;
        document.getElementById("main").appendChild(field);
        if (variables_1.Variables.arr[y][x] == -10) {
            //DODAWANIE PIERWSZYCH KULEK NA PLANSZE
            var rand = Math.floor(Math.random() * variables_1.Variables.colors.length);
            var color = variables_1.Variables.colors[rand];
            var ball = document.createElement("div");
            ball.classList.add("ball");
            ball.classList.add(color);
            ball.dataset.color = String(color);
            field.appendChild(ball);
        }
    }
}
