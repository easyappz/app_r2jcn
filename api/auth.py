from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication

from .models import Member

JWT_ALGORITHM = "HS256"
JWT_TTL_MINUTES = 60 * 24  # 24 hours


def create_jwt(member_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(member_id),
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=JWT_TTL_MINUTES)).timestamp()),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def decode_jwt(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed("Токен истёк")
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed("Неверный токен")


class MemberJWTAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return None
        parts = auth_header.split(" ")
        if len(parts) != 2 or parts[0] != self.keyword:
            raise exceptions.AuthenticationFailed("Неверный заголовок авторизации")
        payload = decode_jwt(parts[1])
        member_id = payload.get("sub")
        if not member_id:
            raise exceptions.AuthenticationFailed("Неверный токен")
        try:
            member = Member.objects.get(id=member_id)
        except Member.DoesNotExist:
            raise exceptions.AuthenticationFailed("Пользователь не найден")
        return (member, None)
