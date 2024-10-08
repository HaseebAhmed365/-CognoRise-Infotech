import math

def print_board(board):
    for row in board:
        print("|".join(row))
        print("-" * 5)

def check_win(board, player):
    # Check rows, columns, and diagonals
    for row in board:
        if all([cell == player for cell in row]):
            return True
    for col in range(3):
        if all([board[row][col] == player for row in range(3)]):
            return True
    if all([board[i][i] == player for i in range(3)]) or all([board[i][2 - i] == player for i in range(3)]):
        return True
    return False

def check_draw(board):
    return all([cell != ' ' for row in board for cell in row])

def player_move(board):
    move = None
    while move is None:
        try:
            row, col = map(int, input("Enter your move (row and column): ").split())
            if board[row][col] == ' ':
                board[row][col] = 'X'
                move = (row, col)
            else:
                print("Cell already taken. Try again.")
        except (ValueError, IndexError):
            print("Invalid move. Try again.")

def minimax(board, depth, is_maximizing):
    if check_win(board, 'O'):
        return 1
    if check_win(board, 'X'):
        return -1
    if check_draw(board):
        return 0

    if is_maximizing:
        best_score = -math.inf
        for row in range(3):
            for col in range(3):
                if board[row][col] == ' ':
                    board[row][col] = 'O'
                    score = minimax(board, depth + 1, False)
                    board[row][col] = ' '
                    best_score = max(score, best_score)
        return best_score
    else:
        best_score = math.inf
        for row in range(3):
            for col in range(3):
                if board[row][col] == ' ':
                    board[row][col] = 'X'
                    score = minimax(board, depth + 1, True)
                    board[row][col] = ' '
                    best_score = min(score, best_score)
        return best_score

def ai_move(board):
    best_score = -math.inf
    move = None
    for row in range(3):
        for col in range(3):
            if board[row][col] == ' ':
                board[row][col] = 'O'
                score = minimax(board, 0, False)
                board[row][col] = ' '
                if score > best_score:
                    best_score = score
                    move = (row, col)
    board[move[0]][move[1]] = 'O'

def play_game():
    board = [[' ' for _ in range(3)] for _ in range(3)]
    print_board(board)

    while True:
        player_move(board)
        print_board(board)
        if check_win(board, 'X'):
            print("Player wins!")
            break
        if check_draw(board):
            print("It's a draw!")
            break

        ai_move(board)
        print_board(board)
        if check_win(board, 'O'):
            print("AI wins!")
            break
        if check_draw(board):
            print("It's a draw!")
            break

if __name__ == "__main__":
    play_game()
