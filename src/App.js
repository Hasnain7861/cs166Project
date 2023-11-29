// App.js

import React, { useState } from 'react';

import './App.css';

function* cartesianProduct(chars, length) {
  if (length === 0) {
    yield '';
    return;
  }
  for (let i = 0; i < chars.length; i++) {
    let rest = cartesianProduct(chars, length - 1);
    for (let x of rest) {
      yield [chars[i]].concat(x);
    }
  }
}

function bruteForceWithTimeout(target, maxLength, timeoutDuration) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let attempts = 0;

    for (let length = 1; length <= maxLength; length++) {
      for (let guess of cartesianProduct(characters, length)) {
        attempts++;
        guess = guess.join('');
        if (guess === target) {
          return resolve([guess, attempts]);
        }
        if (Date.now() - startTime > timeoutDuration) {
          return reject(new Error('Operation timed out'));
        }
      }
    }
    return resolve([null, attempts]);
  });
}

function dictionaryAttack(target, maxLength, timeoutDuration) {
  const dictionary = ['password', '123456', 'qwerty', 'letmein', 'admin'];

  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    let attempts = 0;

    for (let word of dictionary) {
      attempts++;
      if (word === target) {
        return resolve([word, attempts]);
      }
      if (Date.now() - startTime > timeoutDuration) {
        return reject(new Error('Operation timed out'));
      }
    }
    return resolve([null, attempts]);
  });
}

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [isCracking, setIsCracking] = useState(false);
  const [attackType, setAttackType] = useState('bruteForce');

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAttackTypeChange = (event) => {
    setAttackType(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setResult('');
    setIsCracking(true);

    try {
      const startTime = Date.now();
      const timeoutDuration = 50000;
      let crackingFunction;

      if (attackType === 'bruteForce') {
        crackingFunction = bruteForceWithTimeout;
      } else if (attackType === 'dictionary') {
        crackingFunction = dictionaryAttack;
      }

      const [crackedPassword, attempts] = await crackingFunction(password, 5, timeoutDuration);
      const endTime = Date.now();
      const timeTakenInSeconds = (endTime - startTime) / 1000; // Convert milliseconds to seconds

      setResult(`Password: ${crackedPassword || 'not found'}, Attempts: ${attempts}, Time taken: ${timeTakenInSeconds.toFixed(2)} seconds`);
    } catch (error) {
      setResult(error.message);
    } finally {
      setIsCracking(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Password Cracker</h1>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter password"
            disabled={isCracking}
            className="input-field"
          />
          <select value={attackType} onChange={handleAttackTypeChange} disabled={isCracking} className="select-field">
            <option value="bruteForce">Brute Force</option>
            <option value="dictionary">Dictionary Attack</option>
          </select>
          <button type="submit" disabled={isCracking} className="button">
            Crack Password
          </button>
        </form>
        {result && <p className="result">Result: {result}</p>}
      </header>
    </div>
  );
}

export default App;
