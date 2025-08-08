def dec(func):
    def wrapper(*args):
        print("func is running")
        func(*args)
        print("func is done runngin")
    return wrapper

@dec
def multiply(nums):
    print(nums["num1"] * nums["num2"])

multiply({"num1":1, "num2": 3})