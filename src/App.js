import React, { useState } from 'react';
import styled from 'styled-components';
import picture from './cyber-4610993_640.jpg';

const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${picture});
  background-size: cover;
  background-position: center;
`;

const LoginForm = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
`;

const PasswordInput = styled.input`
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #4caf50; /* Green background color */
  color: white; /* White text color */
  border: none; /* Remove border */
  border-radius: 5px;
  cursor: pointer; /* Pointer/hand cursor */
  width: 100%;
  box-sizing: border-box;
`;

const Heading = styled.h1`
  color: white;
`;

const App = () => {
  const [password, setPassword] = useState('');
  const [method, setMethod] = useState('brute-force'); 
  const [crackResult, setCrackResult] = useState('');

  const crackPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/crack-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          method,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to crack password');
      }

      const result = await response.json();
      setCrackResult(`Password found: ${result.result}, Attempts: ${result.attempts}, Time taken: ${result.time_taken.toFixed(2)} seconds`);
    } catch (error) {
      console.error(error);
      setCrackResult('Failed to crack password');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    crackPassword();
  };

  return (
    <AppWrapper>
      <LoginForm>
        <Heading>Enter your password below</Heading>
        <PasswordInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="brute-force">Brute Force</option>
          <option value="dictionary">Dictionary Attack</option>
        </select>
        <SubmitButton type="submit" onClick={handleSubmit}>Submit</SubmitButton>
      </LoginForm>

      {crackResult && <p>{crackResult}</p>}
    </AppWrapper>
  );
}

export default App;
