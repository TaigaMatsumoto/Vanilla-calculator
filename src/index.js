import "./styles.css";
(function() {
  let currentFormula = "";
  let isCalculatorValid = true;

  // let previousFormula = "";
  const currentFormulaEle = document.getElementById("current-formula");
  // const previousForumulaEle = document.getElementById("previous-formula");

  // Assign event listener for number panel
  const numbers = document.querySelectorAll("[class*=number-]");
  numbers.forEach(numberElement => {
    const className = numberElement.className;

    const number = className.match("([0-9]+)")[0];
    if (number >= 0) {
      numberElement.addEventListener("click", event => {
        if (!isCalculatorValid) return;
        currentFormula += number;
        render(currentFormulaEle, currentFormula);
      });
    } else {
      console.error("invalid number is assigned in className");
    }
  });

  // Assign event listener for action panel
  const actions = document.querySelectorAll("[id*=action-");
  actions.forEach(actionElement => {
    const actionType = /action-([\w-]+)/.exec(
      actionElement.getAttribute("id")
    )[1];
    actionElement.addEventListener("click", event => {
      if (!isCalculatorValid) {
        if (actionType === "clear") {
          currentFormula = "";
          isCalculatorValid = true;
          render(currentFormulaEle, currentFormula);
        }
        return;
      }
      switch (actionType) {
        case "clear":
          currentFormula = "";
          render(currentFormulaEle, currentFormula);
          break;
        case "step-back":
          currentFormula = currentFormula.slice(0, -1);
          render(currentFormulaEle, currentFormula);
          break;
        case "remindar":
          if (!isLastCharNumber(currentFormula)) return;
          currentFormula += "%";
          render(currentFormulaEle, currentFormula);
          break;
        case "dot":
          if (!isLastCharNumber(currentFormula)) return;
          currentFormula += ".";
          render(currentFormulaEle, currentFormula);
          break;
        case "delete":
          currentFormula = "";
          // previousFormula = "";
          render(currentFormulaEle, currentFormula);
          // render(previousForumulaEle, previousFormula);
          break;
        case "division":
          if (!isLastCharNumber(currentFormula)) return;
          currentFormula += "/";
          render(currentFormulaEle, currentFormula);
          break;
        case "multiplication":
          if (!isLastCharNumber(currentFormula)) return;
          currentFormula += "*";
          render(currentFormulaEle, currentFormula);
          break;
        case "subtraction":
          if (!isLastCharNumber(currentFormula)) return;
          currentFormula += "-";
          render(currentFormulaEle, currentFormula);
          break;
        case "addition":
          if (!isLastCharNumber(currentFormula)) return;
          currentFormula += "+";
          render(currentFormulaEle, currentFormula);
          break;
        case "equal":
          if (!isLastCharNumber(currentFormula)) return;
          const result = calculate(currentFormula);
          if (!result) {
            isCalculatorValid = false;
            currentFormula =
              "Infinity number is not valid in this calculator. Please press 'C'";
          } else {
            currentFormula = result.toString();
          }
          render(currentFormulaEle, currentFormula);
          // render(previousForumulaEle, currentFormula);
          break;
        default:
          console.error("Please specify legit keyword");
          break;
      }
    });
  });
  function isLastCharNumber(formula) {
    return !Number.isNaN(parseFloat(formula.slice(-1), 10));
  }
  function calculate(formula) {
    const operations = formula.match(/[.|0-9]+|[+-/*%]/g);
    if (operations.length <= 1) {
      return operations[0] ? parseFloat(operations[0], 10) : 0;
    }
    if (operations[0] === "-" && operations.length === 2) {
      return parseFloat(formula, 10);
    }
    if (!isLastCharNumber(operations[operations.length - 1])) {
      operations.pop();
    }
    let result;
    let iteration;
    if (operations[0] === "-") {
      result = parseFloat(operations[0] + operations[1], 10);
      iteration = 2;
    } else {
      result = parseFloat(operations[0], 10);
      iteration = 1;
    }

    for (
      iteration;
      iteration + 1 < operations.length;
      iteration = iteration + 2
    ) {
      let value = parseFloat(operations[iteration + 1], 10);
      switch (operations[iteration]) {
        case "+":
          result += value;
          break;
        case "-":
          result -= value;
          break;
        case "*":
          result *= value;
          break;
        case "/":
          result /= value;
          break;
        case "%":
          result %= value;
          break;
        default:
          console.error("ERROR: do not use any not legit operation symbol.");
      }
    }

    if (!Number.isFinite(result) || Number.isNaN(result)) return false;
    return result;
  }
  function render(element, value, initialize = false) {
    if (!element) {
      console.error("element doesnt exist");
      return false;
    }

    element.innerHTML = value;
    return true;
  }
})();
