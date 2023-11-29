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
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$.';
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

function App() {
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('');
  const [isCracking, setIsCracking] = useState(false);
  const [attackType, setAttackType] = useState('bruteForce');
  const [dictionaryFile, setDictionaryFile] = useState(null);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAttackTypeChange = (event) => {
    setAttackType(event.target.value);
  };

  const handleFileChange = (event) => {
    setDictionaryFile(event.target.files[0]);
  };

  const dictionaryAttack = (target, timeoutDuration, fileContent) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      let attempts = 0;
      const dictionary = fileContent.split('\n');

      for (let word of dictionary) {
        attempts++;
        if (word.trim() === target) {
          return resolve([word, attempts]);
        }
        if (Date.now() - startTime > timeoutDuration) {
          return reject(new Error('Operation timed out'));
        }
      }
      return resolve([null, attempts]);
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setResult('');
    setIsCracking(true);
    const startTime = Date.now();
    
    if (attackType === 'dictionary' && dictionaryFile) {
      const reader = new FileReader();
      reader.readAsText(dictionaryFile);
      reader.onload = async () => {
        const fileContent = reader.result;
        try {
          const timeoutDuration = 50000;
          const [crackedPassword, attempts] = await dictionaryAttack(password, timeoutDuration, fileContent);
          const timeTakenInSeconds = (Date.now() - startTime) / 1000; // Convert milliseconds to seconds
          setResult(`Password: ${crackedPassword || 'not found'}, Attempts: ${attempts}, Time taken: ${timeTakenInSeconds.toFixed(2)} seconds`);
        } catch (error) {
          setResult(error.message);
        } finally {
          setIsCracking(false);
        }
      };
    } else if (attackType === 'bruteForce') {
      try {
        const startTime = Date.now();
        const timeoutDuration = 50000;
        const [crackedPassword, attempts] = await bruteForceWithTimeout(password, 5, timeoutDuration);
        const timeTakenInSeconds = (Date.now() - startTime) / 1000; // Convert milliseconds to seconds
        setResult(`Password: ${crackedPassword || 'not found'}, Attempts: ${attempts}, Time taken: ${timeTakenInSeconds.toFixed(2)} seconds`);
      } catch (error) {
        setResult(error.message);
      } finally {
        setIsCracking(false);
      }
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
          {attackType === 'dictionary' && (
            <input
              type="file"
              onChange={handleFileChange}
              disabled={isCracking}
              className="input-field"
              style={{color: 'black'}}
            />
          )}
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