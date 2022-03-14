from tracemalloc import is_tracing
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.serializers import UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status


def emailSender(data):
    pass


class MyCreatorTokenSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class MyCreatorTokenView(TokenObtainPairView):
    serializer_class = MyCreatorTokenSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data['name']
    user.email = data['email']
    user.username = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data
    username = data['email']

    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False,
        )

        # TODO: send activation email to user
        data = {}
        result = emailSender(data)

        if result:
            message = {
                'detail': 'Welcome to E-Shop. You should verify your email.Please check your Inbox. We sent an email.'
            }
            return Response(message, status=status.HTTP_201_CREATED)
        else:
            message = {
                'detail': 'There\'s a problem on sending email.'
            }
            return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except:
        user = User.objects.get(username=username)

        if user and not user.is_active:

            # TODO: send activation email to user
            data = {}
            result = emailSender(data)

            if result:
                message = {
                    'detail': 'User with this email already exists but is not active. You should verify your email.Please check your Inbox. We sent an email.'
                }
                return Response(message, status=status.HTTP_400_BAD_REQUEST)
            else:
                message = {
                    'detail': 'There\'s a problem on sending email.'
                }
                return Response(message, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif user and user.is_active:
            message = {
                'detail': 'User with this email already exists and is active too. Please login.'
            }
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
