class Prompt:
    def __init__(self, code, player):
        self.code = code #101-105 is might passing 10, 20, 30, 40, 50, 201-205 is insight passing 10, 20, 30, 40, 50
        self.player = player
    def to_dict(self):
        return {
            "code": self.code,
            "player": self.player
        }