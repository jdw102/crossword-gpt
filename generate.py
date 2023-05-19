import random
from enum import Enum
import csv

class Dir(Enum):
    HORIZONTAL = 1
    VERTICAL = 2


def generate_cross(words, max_words, x_size, y_size):
    random.shuffle(words)
    word = words.pop()
    crossword = [[' ' for _ in range(x_size)] for _ in range(y_size)]
    crossword = place(word, crossword, int(x_size / 2), int(y_size / 2), Dir.HORIZONTAL)
    count = 1
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
        for placement in placements:
            if placement is None:
                continue
            new_board = place(word, crossword.copy(), placement[0], placement[1], placement[2])
            new_score = generate_score(new_board)
            if new_score > max_score:
                max_score = new_score
                best_board = new_board
        if max_score > 0:
            crossword = best_board
            count = count + 1
    return crossword


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


def minimize_crossword_area(puzzle):
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

    return reduced_puzzle


def export_cross(crossword):
    finished = minimize_crossword_area(crossword)
    with open('crossword.csv', 'w') as f:
        writer = csv.writer(f)
        for line in finished:
            writer.writerow(line)

test = ["puffed", "pealed", "ballet", "game", "greeds", "kills", "simplify", "shop", "fig", "paws"]
word_list = [
    "python",
    "code",
    "algorithm",
    "variable",
    "list",
    "loop",
    "function",
    "string",
    "dictionary",
    "module"
]
export_cross(generate_cross(word_list, 20, 30, 30))

