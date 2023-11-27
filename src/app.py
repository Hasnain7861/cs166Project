from flask import Flask, request, jsonify
import itertools
import time

app = Flask(__name__)

# Brute-force attack method
def brute_force(target, max_length):
    characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    attempts = 0

    for length in range(1, max_length + 1):
        for guess in itertools.product(characters, repeat=length):
            attempts += 1
            guess = ''.join(guess)
            if guess == target:
                return guess, attempts
    return None, attempts

# Dictionary attack method
def dictionary_attack(target, dictionary_file):
    attempts = 0
    with open(dictionary_file, 'r') as file:
        for word in file:
            word = word.strip()
            attempts += 1
            if word == target:
                return word, attempts
    return None, attempts

@app.route('/crack-password', methods=['POST'])
def crack_password():
    data = request.json
    password_to_crack = data['password']
    method = data['method']
    max_length = 5  # For brute-force
    dictionary_file = 'common_passwords.txt'  # Replace with your dictionary file path

    start_time = time.time()
    if method == 'brute-force':
        result, attempts = brute_force(password_to_crack, max_length)
    elif method == 'dictionary':
        result, attempts = dictionary_attack(password_to_crack, dictionary_file)
    else:
        return jsonify({"error": "Invalid method selected."}), 400

    end_time = time.time()

    response_data = {
        "result": result,
        "attempts": attempts,
        "time_taken": end_time - start_time
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
