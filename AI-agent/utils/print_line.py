def get_main_header(action):
    print(f"******************************************* {action} **********************************************")

def get_sub_header(action):
    return print(f"- {action}")


def print_header(action, subheader=False):
    def decorator(func):
        def wrapper(*args):
            if subheader:
                get_sub_header(action)
            else:
                get_main_header(action)
            return func(*args)

        return wrapper
    return decorator


def print_header_async(action, subheader=False):
    def decorator(func):
        async def wrapper(*args):
            if subheader:
                get_sub_header(action)
            else:
                get_main_header(action)
            return await func(*args)

        return wrapper
    return decorator
    