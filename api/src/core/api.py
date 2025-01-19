from ninja import NinjaAPI, Schema

api = NinjaAPI()


class UserSchema(Schema):
    username: str
    is_authenticated: bool
    email: str = None


@api.get("/hello")
def hello(request):
    return "Hello world"


@api.get("/me", response=UserSchema)
def hello(request):
    return request.user
