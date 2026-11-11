/* ============================
   Unit Converter Logic
   ============================ */

const conversionFactors = {
  // Length factors (to meters)
  length: {
    meter: 1,
    kilometer: 0.001,
    centimeter: 100,
    millimeter: 1000,
    inch: 39.3701,
    foot: 3.28084,
    yard: 1.09361,
    mile: 0.000621371,
  },
  // Weight factors (to grams)
  weight: {
    gram: 1,
    kilogram: 0.001,
    pound: 0.00220462,
    ounce: 0.035274,
  },
  // Temperature conversion functions
  temperature: {
    celsius: {
      toFahrenheit: (c) => (c * 9/5) + 32,
      toKelvin: (c) => c + 273.15,
    },
    fahrenheit: {
      toCelsius: (f) => (f - 32) * 5/9,
      toKelvin: (f) => (f - 32) * 5/9 + 273.15,
    },
    kelvin: {
      toCelsius: (k) => k - 273.15,
      toFahrenheit: (k) => (k - 273.15) * 9/5 + 32,
    },
  },
};

// Update result UI
function updateResult(value, fromUnit, toUnit, result) {
  const resultEl = document.getElementById('result');
  const resultUnitEl = document.getElementById('result-unit');
  const resultDetailEl = document.getElementById('result-detail');
  
  resultEl.textContent = parseFloat(result).toFixed(4);
  resultUnitEl.textContent = toUnit;
  
  // Show detail for temperature
  if (fromUnit.includes('celsius') || fromUnit.includes('fahrenheit') || fromUnit.includes('kelvin')) {
    resultDetailEl.textDirection = 'ltr';
    resultDetailEl.textContent = `转换公式: ${fromUnit} → ${toUnit}`;
  } else {
    resultDetailEl.textContent = '';
  }
}

// Handle convert button
document.getElementById('convert-btn').addEventListener('click', () => {
  const value = parseFloat(document.getElementById('input-value').value) || 0;
  const fromUnit = document.getElementById('from-unit').value;
  const toUnit = document.getElementById('to-unit').value;
  
  let result;
  
  // Check if temperature conversion
  if (fromUnit !== toUnit && 
      (fromUnit === 'celsius' || fromUnit === 'fahrenheit' || fromUnit === 'kelvin')) {
    // Temperature conversion
    let celsius;
    
    if (fromUnit === 'celsius') {
      celsius = value;
    } else if (fromUnit === 'fahrenheit') {
      celsius = conversionFactors.temperature.fahrenheit.toCelsius(value);
    } else if (fromUnit === 'kelvin') {
      celsius = conversionFactors.temperature.kelvin.toCelsius(value);
    }
    
    if (toUnit === 'celsius') {
      result = celsius;
    } else if (toUnit === 'fahrenheit') {
      result = conversionFactors.temperature.celsius.toFahrenheit(celsius);
    } else if (toUnit === 'kelvin') {
      result = conversionFactors.temperature.celsius.toKelvin(celsius);
    }
  } else {
    // Length or weight conversion (using factors)
    let baseValue;
    
    // Determine category from unit names
    const isLength = ['meter', 'kilometer', 'centimeter', 'millimeter', 'inch', 'foot', 'yard', 'mile'].includes(fromUnit);
    const isWeight = ['gram', 'kilogram', 'pound', 'ounce'].includes(fromUnit);
    
    if (isLength) {
      baseValue = value * (conversionFactors.length[fromUnit] / conversionFactors.length[toUnit]);
    } else if (isWeight) {
      baseValue = value * (conversionFactors.weight[fromUnit] / conversionFactors.weight[toUnit]);
    } else {
      result = value;
    }
    
    result = baseValue;
  }
  
  updateResult(value, fromUnit, toUnit, result);
});

// Allow Enter key to convert
document.getElementById('input-value').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('convert-btn').click();
  }
});