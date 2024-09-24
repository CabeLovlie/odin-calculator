let displayValue = '0';
let currentOperation = null;
let firstOperand = null;
let waitingForSecondOperand = false;
let activeOperatorButton = null;

const display = document.getElementById('display');
const textMeasure = document.getElementById('text-measure');
const acButton = document.querySelector('.button.topRow');

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
};

const performOperation = (a, b, operator) => {
  let result;
  switch (operator) {
      case '+':
          result = add(a, b);
          break;
      case '-':
          result = subtract(a, b);
          break;
      case '*':
          result = multiply(a, b);
          break;
      case '/':
          result = divide(a, b);
          break;
      default:
          throw new Error(`Unsupported operator: ${operator}`);
  }
  // Check if result needs scientific notation
  if (result.toString().replace('.', '').length > 9) {
      result = result.toExponential(5); 
  }
  return result;
};

const formatDisplayValue = (value) => {
    const [integer, decimal] = value.split('.');
    const formattedInteger = parseInt(integer, 10).toLocaleString();
    return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};

const adjustFontSize = () => {
  const displayPaddingLeft = 35; 
  const displayPaddingRight = 20; 
  const displayWidth = display.clientWidth - displayPaddingLeft - displayPaddingRight;
  const numericContent = display.textContent.replace(/[^0-9.]/g, '');

  if (numericContent.length > 9) return; 

  textMeasure.style.fontSize = '6.5em'; 
  textMeasure.textContent = display.textContent.replace(/,/g, ''); 

  let fontSize = 6.5; 
  while (textMeasure.clientWidth > displayWidth && fontSize > 1) { 
      fontSize -= 0.1; 
      textMeasure.style.fontSize = `${fontSize}em`;
  }

  display.style.fontSize = `${fontSize}em`;
};

const updateACButton = () => {
  if (displayValue === '0' && !waitingForSecondOperand && !currentOperation) {
      acButton.querySelector('span').textContent = 'AC';
  } else {
      acButton.querySelector('span').textContent = 'C';
  }
};

const toggleSign = () => {
  if (displayValue !== '0') {
    // Check if the current value is negative
    if (displayValue.charAt(0) === '-') {
      // If it's negative, remove the negative sign
      displayValue = displayValue.slice(1);
    } else {
      // If it's Positive, add the negative sign
      displayValue = '-' + displayValue
    }
  }
  updateDisplay();
}

const percentage = () => {
  // If an operation is active, and the second operand is being entered
  if (currentOperation && waitingForSecondOperand === false) {
    // Convert the current second operand into a percentage of the first operand
    displayValue = (parseFloat(displayValue) / 100) * firstOperand;
  } else {
    // Otherwise, just turn the current display vlaue into a percentage
    displayValue = parseFloat(displayValue ) / 100;
  }
  updateDisplay();
}

const updateDisplay = () => {
  display.textContent = formatDisplayValue(displayValue.toString());
  adjustFontSize();
  updateACButton();
};

const appendNumber = (number) => {
  if (waitingForSecondOperand) {
      displayValue = number;
      waitingForSecondOperand = false;
  } else {
      const numericContent = displayValue.replace(/[^0-9.]/g, ''); // Only numeric characters and dot
      if (numericContent.length < 9) { // Limit to 9 numeric characters
          displayValue = displayValue === '0' ? number : displayValue + number;
      }
  }
  updateDisplay(); // Only update if a new number is actually added
};

const appendDot = () => {
  if (waitingForSecondOperand) {
    displayValue = '0.';
    waitingForSecondOperand = false;
  } else if (!displayValue.includes('.') && displayValue.replace(/[^0-9.]/g, '').length < 9) { // Reserve space for dot
    displayValue += '.';
  }
  updateDisplay();
};

const clearDisplay = () => {
  if (displayValue !== '0' && !waitingForSecondOperand) {
      displayValue = '0';
  } else if (waitingForSecondOperand) {
      displayValue = '0';
      waitingForSecondOperand = false;
  } else {
      displayValue = '0';
      currentOperation = null;
      firstOperand = null;
      waitingForSecondOperand = false;
      if (activeOperatorButton) {
          activeOperatorButton.classList.remove('active');
          activeOperatorButton = null;
      }
  }
  display.style.fontSize = '6.5em'; // Ensure correct initial font size
  updateDisplay();
};


const setOperation = (operator, button) => {
  if (currentOperation && waitingForSecondOperand) {
      currentOperation = operator;
      return;
  }

  if (firstOperand == null && !isNaN(parseFloat(displayValue))) {
      firstOperand = parseFloat(displayValue);
  } else if (currentOperation) {
      const result = performOperation(firstOperand, parseFloat(displayValue), currentOperation);
      displayValue = `${result}`;
      firstOperand = result;
  }

  currentOperation = operator;
  waitingForSecondOperand = true;
  updateDisplay();

  if (activeOperatorButton) {
      activeOperatorButton.classList.remove('active');
  }
  button.classList.add('active');
  activeOperatorButton = button;
};

const calculate = () => {
  if (currentOperation && firstOperand != null) {
    let result = performOperation(firstOperand, parseFloat(displayValue), currentOperation);
    displayValue = `${result}`;
    currentOperation = null;
    firstOperand = null;
    waitingForSecondOperand = false;
    if (activeOperatorButton) {
      activeOperatorButton.classList.remove('active');
      activeOperatorButton = null;
    }
    updateDisplay();
  }
};

updateDisplay();
