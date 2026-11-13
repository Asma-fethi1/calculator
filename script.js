
const result = document.getElementById("result");
const history = document.getElementById("history");
const buttons = document.querySelectorAll("button");

let expression = "";
let justCalculated = false;

function updateDisplay() {
  result.textContent = expression || "0";
}

function addValue(value) {
  if (justCalculated && /[0-9.(]/.test(value)) {
    expression = "";
  }

  justCalculated = false;

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/()%]/).pop();

    if (currentNumber.includes(".")) return;

    if (!currentNumber) {
      expression += "0";
    }
  }

  expression += value;
  updateDisplay();
}

function clearCalculator() {
  expression = "";
  history.textContent = "Previous calculation";
  result.textContent = "0";
  justCalculated = false;
}

function backspace() {
  expression = expression.slice(0, -1);
  justCalculated = false;
  updateDisplay();
}

function calculate() {
  if (!expression) return;

  try {
    let exp = expression;

    // Convert percentage into division by 100
    exp = exp.replace(/(\d+\.?\d*)%/g, "($1/100)");

    // Check division by zero
    if (/\/\s*0(?![\d.])/.test(exp)) {
      throw new Error("Cannot divide by zero");
    }

    // Only allow calculator characters
    if (!/^[0-9+\-*/().\s]+$/.test(exp)) {
      throw new Error("Invalid expression");
    }

    const answer = Function('"use strict"; return (' + exp + ')')();

    if (!Number.isFinite(answer)) {
      throw new Error("Cannot divide by zero");
    }

    history.textContent = expression + " =";
    expression = String(Number(answer.toPrecision(12)));
    result.textContent = expression;
    justCalculated = true;

  } catch (error) {
    result.textContent = error.message === "Cannot divide by zero"
      ? "Cannot divide by zero"
      : "Invalid expression";

    justCalculated = false;
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (action === "clear") {
      clearCalculator();
    } else if (action === "backspace") {
      backspace();
    } else if (action === "equals") {
      calculate();
    } else if (value) {
      addValue(value);
    }
  });
});

// Keyboard support
document.addEventListener("keydown", event => {
  if (/^[0-9.]$/.test(event.key)) {
    addValue(event.key);
  } else if (["+", "-", "*", "/", "(", ")", "%"].includes(event.key)) {
    addValue(event.key);
  } else if (event.key === "Enter" || event.key === "=") {
    calculate();
  } else if (event.key === "Backspace") {
    backspace();
  } else if (event.key === "Escape") {
    clearCalculator();
  }
});
