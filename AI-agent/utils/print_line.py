
def print_header(action):
    def decorator(func):
        def wrapper(*args):
            print(f"******************************************* {action} **********************************************")
            return func(*args)

        return wrapper
    return decorator