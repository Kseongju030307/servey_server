from django.urls import path
from .views import get_random_item_by_country, save_evaluation_result

urlpatterns = [
    path("get-sample/", get_random_item_by_country, name="get-sample"),
    path("evaluate/", save_evaluation_result, name="evaluate"),
]