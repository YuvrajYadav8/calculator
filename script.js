const currentDisplay =
    document.getElementById("current-display");

const previousDisplay =
    document.getElementById("previous-display");

const historyContainer =
    document.getElementById("history");

const activeOperation =
    document.getElementById("active-operation");

const keyboardPanel =
    document.getElementById("keyboard-panel");

const keyboardToggle =
    document.getElementById("keyboard-toggle");

const clearHistoryButton =
    document.getElementById("clear-history");


let currentValue = "0";
let previousValue = "";
let operation = null;
let shouldResetDisplay = false;


/* =========================
   UPDATE DISPLAY
========================= */

function updateDisplay() {

    currentDisplay.textContent = currentValue;

    previousDisplay.textContent =
        previousValue && operation
            ? `${previousValue} ${operation}`
            : "";

    if (operation) {
        activeOperation.textContent =
            `Operation: ${operation}`;

        activeOperation.classList.add("show");
    }

    else {
        activeOperation.textContent = "";

        activeOperation.classList.remove("show");
    }


    currentDisplay.classList.remove(
        "display-update"
    );

    void currentDisplay.offsetWidth;

    currentDisplay.classList.add(
        "display-update"
    );
}


/* =========================
   ERROR DISPLAY
========================= */

function showError() {

    currentValue = "Error";

    previousValue = "";

    operation = null;

    shouldResetDisplay = true;

    currentDisplay.classList.add(
        "error-display"
    );

    updateDisplay();

    setTimeout(() => {

        currentDisplay.classList.remove(
            "error-display"
        );

    }, 500);
}


/* =========================
   NUMBER INPUT
========================= */

function inputNumber(number) {

    if (currentValue === "Error") {

        currentValue = number;

        shouldResetDisplay = false;

        updateDisplay();

        return;
    }


    if (shouldResetDisplay) {

        currentValue = number;

        shouldResetDisplay = false;
    }


    else if (
        number === "." &&
        currentValue.includes(".")
    ) {

        return;
    }


    else if (
        currentValue === "0" &&
        number !== "."
    ) {

        currentValue = number;
    }


    else {

        currentValue += number;
    }


    updateDisplay();
}


/* =========================
   OPERATION
========================= */

function chooseOperation(selectedOperation) {

    if (currentValue === "Error") {
        return;
    }


    if (
        operation !== null &&
        !shouldResetDisplay
    ) {

        calculate(false);
    }


    previousValue = currentValue;

    operation = selectedOperation;

    shouldResetDisplay = true;


    updateOperatorHighlight();

    updateDisplay();
}


/* =========================
   OPERATOR HIGHLIGHT
========================= */

function updateOperatorHighlight() {

    document
        .querySelectorAll(".operator")
        .forEach(button => {

            button.classList.remove("selected");

            if (
                button.dataset.operation ===
                operation
            ) {

                button.classList.add(
                    "selected"
                );
            }
        });
}


/* =========================
   CALCULATION
========================= */

function calculate(addToHistory = true) {

    if (
        operation === null ||
        previousValue === "" ||
        currentValue === ""
    ) {

        return;
    }


    const firstNumber =
        parseFloat(previousValue);

    const secondNumber =
        parseFloat(currentValue);


    let result;


    switch (operation) {

        case "+":

            result =
                firstNumber +
                secondNumber;

            break;


        case "−":

            result =
                firstNumber -
                secondNumber;

            break;


        case "×":

            result =
                firstNumber *
                secondNumber;

            break;


        case "÷":

            if (secondNumber === 0) {

                showError();

                updateOperatorHighlight();

                return;
            }

            result =
                firstNumber /
                secondNumber;

            break;


        default:

            return;
    }


    /*
        Reduce floating point precision
    */

    result =
        parseFloat(
            result.toFixed(10)
        );


    if (addToHistory) {

        addHistory(
            `${firstNumber} ${operation} ${secondNumber}`,
            result
        );
    }


    currentValue =
        result.toString();

    previousValue = "";

    operation = null;

    shouldResetDisplay = true;


    updateOperatorHighlight();

    updateDisplay();
}


/* =========================
   CLEAR
========================= */

function clearCalculator() {

    currentValue = "0";

    previousValue = "";

    operation = null;

    shouldResetDisplay = false;


    updateOperatorHighlight();

    currentDisplay.classList.remove(
        "error-display"
    );

    updateDisplay();
}


/* =========================
   BACKSPACE
========================= */

function backspace() {

    if (
        currentValue === "Error" ||
        shouldResetDisplay
    ) {

        currentValue = "0";

        shouldResetDisplay = false;

        updateDisplay();

        return;
    }


    if (
        currentValue.length === 1 ||
        (
            currentValue.length === 2 &&
            currentValue.startsWith("-")
        )
    ) {

        currentValue = "0";
    }

    else {

        currentValue =
            currentValue.slice(0, -1);
    }


    updateDisplay();
}


/* =========================
   PERCENTAGE
========================= */

function percentage() {

    if (currentValue === "Error") {
        return;
    }


    const number =
        parseFloat(currentValue);


    currentValue =
        (number / 100).toString();


    updateDisplay();
}


/* =========================
   SIGN
========================= */

function changeSign() {

    if (
        currentValue === "0" ||
        currentValue === "Error"
    ) {

        return;
    }


    if (
        currentValue.startsWith("-")
    ) {

        currentValue =
            currentValue.slice(1);
    }

    else {

        currentValue =
            "-" + currentValue;
    }


    updateDisplay();
}


/* =========================
   HISTORY
========================= */

function addHistory(
    expression,
    result
) {

    const emptyMessage =
        historyContainer.querySelector("p");


    if (emptyMessage) {
        emptyMessage.remove();
    }


    const historyItem =
        document.createElement("div");


    historyItem.className =
        "history-item";


    const now =
        new Date();


    const time =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


    historyItem.innerHTML = `

        <div>
            <span>${expression}</span>

            <span class="history-time">
                ${time}
            </span>
        </div>

        <strong>
            = ${result}
        </strong>

    `;


    historyContainer.prepend(
        historyItem
    );
}


/* =========================
   CLEAR HISTORY
========================= */

clearHistoryButton.addEventListener(
    "click",
    () => {

        historyContainer.innerHTML =
            "<p>No calculations yet</p>";

    }
);


/* =========================
   BUTTON EVENTS
========================= */

document
    .querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                inputNumber(
                    button.dataset.number
                );

            }
        );

    });


document
    .querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                chooseOperation(
                    button.dataset.operation
                );

            }
        );

    });


document
    .querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.action;


                switch (action) {

                    case "clear":

                        clearCalculator();

                        break;


                    case "backspace":

                        backspace();

                        break;


                    case "percentage":

                        percentage();

                        break;


                    case "sign":

                        changeSign();

                        break;


                    case "equals":

                        calculate();

                        break;
                }

            }
        );

    });


/* =========================
   KEYBOARD BUTTON ANIMATION
========================= */

function animateKeyboardButton(key) {

    const normalizedKey =
        key.toLowerCase();


    const button =
        [...document.querySelectorAll("button")]
            .find(button => {

                const dataKey =
                    button.dataset.key;

                return dataKey &&
                    dataKey.toLowerCase() ===
                    normalizedKey;

            });


    if (!button) {
        return;
    }


    button.classList.add(
        "keyboard-active"
    );


    setTimeout(() => {

        button.classList.remove(
            "keyboard-active"
        );

    }, 120);
}


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener(
    "keydown",
    event => {

        const key = event.key;


        /*
            Prevent browser shortcuts
        */

        if (
            event.ctrlKey ||
            event.metaKey
        ) {

            /*
                Ctrl/Cmd + Backspace
                = Clear calculator
            */

            if (key === "Backspace") {

                event.preventDefault();

                clearCalculator();

                animateKeyboardButton(
                    "Escape"
                );

                return;
            }


            /*
                Ctrl/Cmd + H
                = Clear history
            */

            if (
                key.toLowerCase() === "h"
            ) {

                event.preventDefault();

                historyContainer.innerHTML =
                    "<p>No calculations yet</p>";

                return;
            }


            return;
        }


        /*
            Numbers
        */

        if (
            key >= "0" &&
            key <= "9"
        ) {

            event.preventDefault();

            inputNumber(key);

            animateKeyboardButton(key);

            return;
        }


        /*
            Decimal
        */

        if (key === ".") {

            event.preventDefault();

            inputNumber(".");

            return;
        }


        /*
            Addition
        */

        if (key === "+") {

            event.preventDefault();

            chooseOperation("+");

            animateKeyboardButton("+");

            return;
        }


        /*
            Subtraction
        */

        if (key === "-") {

            event.preventDefault();

            chooseOperation("−");

            animateKeyboardButton("-");

            return;
        }


        /*
            Multiplication
        */

        if (key === "*") {

            event.preventDefault();

            chooseOperation("×");

            animateKeyboardButton("*");

            return;
        }


        /*
            Division
        */

        if (key === "/") {

            event.preventDefault();

            chooseOperation("÷");

            animateKeyboardButton("/");

            return;
        }


        /*
            Enter
        */

        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculate();

            animateKeyboardButton(
                "Enter"
            );

            return;
        }


        /*
            Escape
        */

        if (key === "Escape") {

            event.preventDefault();

            clearCalculator();

            animateKeyboardButton(
                "Escape"
            );

            return;
        }


        /*
            Backspace
        */

        if (key === "Backspace") {

            event.preventDefault();

            backspace();

            animateKeyboardButton(
                "Backspace"
            );

            return;
        }


        /*
            Delete
        */

        if (key === "Delete") {

            event.preventDefault();

            clearCalculator();

            animateKeyboardButton(
                "Escape"
            );

            return;
        }


        /*
            Percentage
        */

        if (key === "%") {

            event.preventDefault();

            percentage();

            animateKeyboardButton("%");

            return;
        }


        /*
            F1
            Keyboard shortcuts
        */

        if (key === "F1") {

            event.preventDefault();

            keyboardPanel.classList.toggle(
                "show"
            );

            return;
        }

    }
);


/* =========================
   KEYBOARD PANEL TOGGLE
========================= */

keyboardToggle.addEventListener(
    "click",
    () => {

        keyboardPanel.classList.toggle(
            "show"
        );

    }
);


/* =========================
   INITIAL DISPLAY
========================= */

updateDisplay();
