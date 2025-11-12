from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password


class Member(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    password = models.CharField(max_length=128)  # hashed password
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password: str) -> None:
        self.password = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self) -> bool:
        # Allows DRF's IsAuthenticated to treat this instance as an authenticated principal
        return True

    def __str__(self) -> str:
        return self.email
