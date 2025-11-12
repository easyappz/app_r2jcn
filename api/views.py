from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Member
from .serializers import MemberSerializer, RegisterSerializer, LoginSerializer
from .auth import create_jwt


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        name = serializer.validated_data["name"]
        password = serializer.validated_data["password"]

        if Member.objects.filter(email=email).exists():
            return Response({"detail": "Почта уже зарегистрирована"}, status=status.HTTP_400_BAD_REQUEST)

        member = Member(email=email, name=name)
        member.set_password(password)
        member.save()

        return Response(MemberSerializer(member).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].lower()
        password = serializer.validated_data["password"]

        try:
            member = Member.objects.get(email=email)
        except Member.DoesNotExist:
            return Response({"detail": "Неверная почта или пароль"}, status=status.HTTP_400_BAD_REQUEST)

        if not member.check_password(password):
            return Response({"detail": "Неверная почта или пароль"}, status=status.HTTP_400_BAD_REQUEST)

        token = create_jwt(member.id)
        return Response({"token": token, "member": MemberSerializer(member).data}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(MemberSerializer(request.user).data)

    def patch(self, request):
        member = request.user
        email = request.data.get("email")
        name = request.data.get("name")

        if email:
            email = email.lower()
            if Member.objects.exclude(id=member.id).filter(email=email).exists():
                return Response({"detail": "Эта почта уже занята"}, status=status.HTTP_400_BAD_REQUEST)
            member.email = email
        if name:
            member.name = name
        member.save()
        return Response(MemberSerializer(member).data)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not current_password or not new_password:
            return Response({"detail": "Укажите текущий и новый пароли"}, status=status.HTTP_400_BAD_REQUEST)

        member = request.user
        if not member.check_password(current_password):
            return Response({"detail": "Текущий пароль неверен"}, status=status.HTTP_400_BAD_REQUEST)

        member.set_password(new_password)
        member.save()
        return Response({"detail": "Пароль изменён"})
