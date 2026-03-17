from django.db import models

class Evaluation(models.Model):
    email = models.EmailField()
    gender = models.CharField(max_length=10)
    country = models.CharField(max_length=50)
    image_path = models.TextField()

    json_data = models.JSONField()  # 전체 캡션, 점수 포함 JSON 구조 저장

    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.image_path}"
