import json
import random
import os
from datetime import datetime
from django.http import JsonResponse
from django.conf import settings
from rest_framework.decorators import api_view


@api_view(["GET"])
def get_random_item_by_country(request):
    country = request.GET.get("country")
    if not country:
        return JsonResponse({"error": "Missing country parameter"}, status=400)

    json_filename = f"{country.lower()}_samples.json"
    json_path = os.path.join(settings.BASE_DIR, "data", json_filename)

    if not os.path.isfile(json_path):
        return JsonResponse({"error": f"Data for country '{country}' not found"}, status=404)

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            items = json.load(f)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format"}, status=500)

    if not items:
        return JsonResponse({"error": "No data found in the file"}, status=404)

    selected = random.choice(items)

    dataset_dir_to_label = {
        "Korea_fix_dataset": "Korea",
        "Japan_fix_dataset": "Japan",
        "China_fix_dataset": "China"
    }

    raw_path = selected.get("image_path", "")
    if not raw_path:
        return JsonResponse({"error": "Missing image_path in data item"}, status=400)

    if raw_path.startswith("/media/"):
        for dataset_dir, label in dataset_dir_to_label.items():
            if f"/media/{dataset_dir}" in raw_path:
                raw_path = raw_path.replace(f"/media/{dataset_dir}", f"/media/{label}")
                break
        selected["image_path"] = raw_path
    else:
        path_parts = raw_path.replace("\\", "/").split("/")
        if len(path_parts) < 4:
            return JsonResponse({"error": "Image path is too short"}, status=400)

        rel_image_path = "/".join(path_parts[-4:])

        for dataset_dir, label in dataset_dir_to_label.items():
            if dataset_dir in rel_image_path:
                rel_image_path = rel_image_path.replace(dataset_dir, label)
                break

        media_root = os.path.join(settings.BASE_DIR, "media")
        abs_image_path = os.path.abspath(os.path.join(media_root, rel_image_path))
        if not abs_image_path.startswith(media_root):
            return JsonResponse({"error": "Invalid image path"}, status=400)

        selected["image_path"] = f"/media/{rel_image_path}"

    return JsonResponse(selected, safe=False)


@api_view(["POST"])
def save_evaluation_result(request):
    data = request.data
    print("Received evaluation:", data)

    email = data.get("email", "")
    gender = data.get("gender", "")
    country = data.get("country", "unknown")
    image_path = data.get("image_path")
    json_data = data.get("json_data")
    consent = data.get("consent", True)

    # 필수 항목이 빠지면 오류 반환 (단, 동의하지 않은 경우는 예외 처리)
    if not consent and image_path and json_data:
        save_dir = os.path.join(settings.BASE_DIR, "results", country)
        os.makedirs(save_dir, exist_ok=True)
        file_path = os.path.join(save_dir, "non_agreement.json")

        item = {
            "image_path": image_path,
            "caption": json_data.get("caption", {}),
            "level2": json_data.get("level2", {}),
            "level3": json_data.get("level3", {}),
            "level4": json_data.get("level4", {}),
            "level1": json_data.get("level1", {}),
            "category": json_data.get("category", ""),
            "item": json_data.get("item", ""),
            "nation": json_data.get("nation", "")
        }

        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    results = json.load(f)
            except json.JSONDecodeError:
                results = []
        else:
            results = []

        results.append(item)
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)

        return JsonResponse({"message": "Non-agreement evaluation saved"}, status=200)

    if not all([email, gender, country, image_path, json_data]):
        return JsonResponse({"error": "Missing required fields"}, status=400)

    # 동의한 사용자 결과 저장
    save_dir = os.path.join(settings.BASE_DIR, "results", country)
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, f"{email}_{gender}.json")

    item = {
        "image_path": image_path,
        "caption": json_data.get("caption", {}),
        "level2": json_data.get("level2", {}),
        "level3": json_data.get("level3", {}),
        "level4": json_data.get("level4", {}),
        "level1": json_data.get("level1", {}),
        "category": json_data.get("category", ""),
        "item": json_data.get("item", ""),
        "nation": json_data.get("nation", "")
    }

    results = []
    if os.path.exists(file_path):
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                results = json.load(f)
        except json.JSONDecodeError:
            results = []

    results.append(item)

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    return JsonResponse({"message": "Evaluation saved successfully"})

