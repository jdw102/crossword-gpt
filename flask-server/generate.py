import random
from enum import Enum
import openai
import json
from dotenv import load_dotenv
import os
load_dotenv()


class Dir(Enum):
    HORIZONTAL = 1
    VERTICAL = 2


def generate_cross(words, max_words, x_size, y_size):
    random.shuffle(words)
    word = words.pop()
    count = 1
    across_index = 2
    down_index = 1
    across_map = {}
    down_map = {}
    crossword = [[' ' for _ in range(x_size)] for _ in range(y_size)]
    crossword = place(word, crossword, int(x_size / 2), int(y_size / 2), Dir.HORIZONTAL)
    across_map[1] = [word, int(x_size / 2), int(y_size / 2)]
    while count < max_words and len(words) > 0:
        word = words.pop()
        placements = []
        for letter in word:
            for y in range(len(crossword)):
                for x in range(len(crossword[0])):
                    if crossword[y][x] == letter:
                        placements.extend(find_placement(word, crossword, x, y))
        max_score = 0
        best_board = crossword
        best_placement = None
        for placement in placements:
            new_board = place(word, crossword.copy(), placement[0], placement[1], placement[2])
            new_score = generate_score(new_board)
            if new_score > max_score:
                max_score = new_score
                best_board = new_board
                best_placement = placement
        if max_score > 0:
            crossword = best_board
            count = count + 1
            if best_placement is not None:
                if best_placement[2] == Dir.HORIZONTAL:
                    across_map[across_index] = [word, best_placement[0], best_placement[1]]
                    across_index += 1
                else:
                    down_map[down_index] = [word, best_placement[0], best_placement[1]]
                    down_index += 1
    add_numbers(crossword, across_map, down_map)
    return crossword, across_map, down_map


def add_numbers(crossword, across_map, down_map):
    for key in across_map:
        word, x, y = across_map[key]
        crossword[y][x] = word[0] + str(key)
    for key in down_map:
        word, x, y = down_map[key]
        crossword[y][x] = word[0] + str(key)

def generate_score(board):
    size_ratio = max(float(len(board)) / len(board[0]), float(len(board[0])) / len(board))
    filled = 0
    empty = 0
    for y in range(len(board)):
        for x in range(len(board[0])):
            if board[y][x] == ' ':
                empty = empty + 1
            else:
                filled = filled + 1
    fill_ratio = float(filled) / empty
    return size_ratio * 10 + fill_ratio * 20


def find_placement(word, crossword, x, y):
    x_size = len(crossword[0])
    y_size = len(crossword)
    size = len(word)
    location = 0
    for i in range(size):
        if word[i] == crossword[y][x]:
            location = i
    first_half = word[0:location]
    second_half = word[location + 1:size]
    # Check horizontal and vertical
    horizontal_valid = True
    vertical_valid = True
    for i in range(len(first_half)):
        new_x = x - i - 1
        new_y = y - i - 1
        if 0 < x < x_size - 1 and 0 <= new_x < x_size and crossword[y - 1][new_x] != ' ' or crossword[y + 1][new_x] != ' ':
            horizontal_valid = False
        if 0 <= new_x < x_size and crossword[y][new_x] != ' ':
            horizontal_valid = False
        if 0 < y < y_size - 1 and 0 <= new_y < y_size and crossword[new_y][x + 1] != ' ' or crossword[new_y][x - 1] != ' ':
            vertical_valid = False
        if 0 <= new_y < y_size and crossword[new_y][x] != ' ':
            vertical_valid = False
    for i in range(len(second_half)):
        new_x = x + i + 1
        new_y = y + i + 1
        if 0 <= new_x < x_size and crossword[y][new_x] != ' ':
            horizontal_valid = False
        if 0 <= new_x < x_size and 0 < y < y_size - 1 and (crossword[y + 1][new_x] != ' ' or crossword[y - 1][new_x] != ' '):
            horizontal_valid = False
        if 0 <= new_y < y_size and crossword[new_y][x] != ' ':
            vertical_valid = False
        if 0 <= new_y < y_size and 0 < x < x_size - 1 and (crossword[new_y][x - 1] != ' ' or crossword[new_y][x + 1] != ' '):
            vertical_valid = False
    if 0 < y < y_size - 1 and crossword[y + 1][x] != ' ' or crossword[y - 1][x] != ' ':
        vertical_valid = False
    if 0 < x < x_size - 1 and crossword[y][x + 1] != ' ' or crossword[y][x - 1] != ' ':
        horizontal_valid = False
    placements = []
    if horizontal_valid:
        placements.append((x - len(first_half), y, Dir.HORIZONTAL))
    if vertical_valid:
        placements.append((x, y - len(first_half), Dir.VERTICAL))
    return placements


def place(word, crossword, x, y, direction):
    board = [x[:] for x in crossword]
    size = len(word)
    if direction == Dir.HORIZONTAL:
        for i in range(size):
            if 0 < x + i < len(board[0]):
                board[y][x + i] = word[i]
    else:
        for i in range(size):
            if 0 < y + i < len(board):
                board[y + i][x] = word[i]
    return board


def minimize_crossword_area(puzzle, across_map, down_map):
    min_row, max_row = len(puzzle), 0
    min_col, max_col = len(puzzle[0]), 0

    for row in range(len(puzzle)):
        for col in range(len(puzzle[row])):
            if puzzle[row][col] != ' ':
                min_row = min(min_row, row)
                max_row = max(max_row, row)
                min_col = min(min_col, col)
                max_col = max(max_col, col)

    reduced_puzzle = []
    for row in range(min_row, max_row + 1):
        reduced_puzzle.append(puzzle[row][min_col:max_col + 1])
    for key in across_map.keys():
        across_map[key][1] -= min_col
        across_map[key][2] -= min_row
    for key in down_map.keys():
        down_map[key][1] -= min_col
        down_map[key][2] -= min_row
    return reduced_puzzle


def create_board_string(crossword):
    temp = []
    for line in crossword:
        temp.append(','.join(line))
    return '\n'.join(temp)

openai.api_key = os.getenv("KEY")
messages = [
    {"role": "system", "content": "You are an assistant."}
]
prompt = os.getenv("BASE_PROMPT")

def gpt_call(theme):
    messages.append(
        {"role": "user", "content": prompt + theme},
    )
    chat = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=messages
    )
    reply = chat.choices[0].message.content
    messages.append({"role": "assistant", "content": reply})
    print(reply)
    data = json.loads(reply)
    hint_map = {}
    for pair in data["words"]:
        hint_map[pair['word']] = pair['hint']
    words = parse_map(hint_map)
    crossword, across_map, down_map = generate_cross(words, 20, 50, 50)
    minimized = minimize_crossword_area(crossword, across_map, down_map)
    return export_json(hint_map, across_map, down_map, create_board_string(minimized))


def export_json(hint_map, across_map, down_map, board):
    larger_map = {}
    across_vals = []
    for key in across_map.keys():
        name, x, y = across_map[key]
        value = {
            "id": key,
            "name": name,
            "hint": hint_map[name],
            "x": x,
            "y": y
        }
        across_vals.append(value)
    down_vals = []
    for key in down_map.keys():
        name, x, y = down_map[key]
        value = {
            "id": key,
            "name": name,
            "hint": hint_map[name],
            "x": x,
            "y": y
        }
        down_vals.append(value)
    larger_map["across"] = across_vals
    larger_map["down"] = down_vals
    larger_map["board"] = board
    return larger_map

def parse_map(m):
    words = []
    for key in m.keys():
        words.append(key)
    return words