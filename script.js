const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");
const historyContainer = document.getElementById("history");

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

    // Animation
    currentDisplay.classList.remove("display-update");

    void currentDisplay.offsetWidth;

    currentDisplay.classList.add("display-update");
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

    else if (number === "." && currentValue.includes(".")) {
        return;
    }

    else if (currentValue === "0" && number !== ".") {
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

    if (operation !== null && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    operation = selectedOperation;

    shouldResetDisplay = true;

    updateDisplay();
}


/* =========================
   CALCULATION
========================= */

function calculate() {

    if (
        operation === null ||
        previousValue === "" ||
        currentValue === ""
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (operation) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "−":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operation = null;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    // Prevent floating point problems
    result = parseFloat(result.toFixed(10));

    addHistory(
        `${firstNumber} ${operation} ${secondNumber}`,
        result
    );

    currentValue = result.toString();

    previousValue = "";
    operation = null;

    shouldResetDisplay = true;

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

    if (currentValue.length === 1) {
        currentValue = "0";
    }

    else {
        currentValue = currentValue.slice(0, -1);
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

    const number = parseFloat(currentValue);

    currentValue = (number / 100).toString();

    updateDisplay();
}


/* =========================
   PLUS / MINUS
========================= */

function changeSign() {

    if (
        currentValue === "0" ||
        currentValue === "Error"
    ) {
        return;
    }

    if (currentValue.startsWith("-")) {
        currentValue = currentValue.slice(1);
    }

    else {
        currentValue = "-" + currentValue;
    }

    updateDisplay();
}


/* =========================
   HISTORY
========================= */

function addHistory(expression, result) {

    const emptyMessage =
        historyContainer.querySelector("p");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const historyItem =
        document.createElement("div");

    historyItem.className = "history-item";

    historyItem.innerHTML = `
        <span>${expression}</span>
        <strong>= ${result}</strong>
    `;

    historyContainer.prepend(historyItem);
}


/* =========================
   CLEAR HISTORY
========================= */

document
    .getElementById("clear-history")
    .addEventListener("click", () => {

        historyContainer.innerHTML =
            "<p>No calculations yet</p>";
    });


/* =========================
   BUTTON EVENTS
========================= */

document
    .querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener("click", () => {

            inputNumber(
                button.dataset.number
            );

        });
    });


document
    .querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener("click", () => {

            chooseOperation(
                button.dataset.operation
            );

        });
    });


document
    .querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener("click", () => {

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

        });
    });


/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers
    if (
        (key >= "0" && key <= "9") ||
        key === "."
    ) {
        inputNumber(key);
    }

    // Operations
    else if (key === "+") {
        chooseOperation("+");
    }

    else if (key === "-") {
        chooseOperation("−");
    }

    else if (key === "*") {
        chooseOperation("×");
    }

    else if (key === "/") {
        event.preventDefault();

        chooseOperation("÷");
    }

    // Enter
    else if (
        key === "Enter" ||
        key === "="
    ) {
        calculate();
    }

    // Escape
    else if (key === "Escape") {
        clearCalculator();
    }

    // Backspace
    else if (key === "Backspace") {
        backspace();
    }

    // Percentage
    else if (key === "%") {
        percentage();
    }

});