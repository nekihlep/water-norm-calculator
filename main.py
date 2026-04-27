from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Water Norm API")

# База данных городов на РУССКОМ
cities_db = {
    "Москва": {"temp": 25, "multiplier": 1.0},
    "Сочи": {"temp": 35, "multiplier": 1.3},
    "Мурманск": {"temp": 15, "multiplier": 0.9},
    "Новосибирск": {"temp": 20, "multiplier": 1.0},
    "Астрахань": {"temp": 32, "multiplier": 1.2}
}


class WaterNormRequest(BaseModel):
    city: Optional[str] = None
    weight: Optional[float] = None


@app.get("/api/status")
def status():
    return {"status": "ok"}


@app.get("/api/cities")
def get_cities():
    cities = [{"name": name, "temperature": data["temp"]}
              for name, data in cities_db.items()]
    return {"cities": cities}


@app.post("/api/water-norm/calculate")
def calculate_norm(request: WaterNormRequest):
    # Проверка города
    if not request.city:
        return {"success": False, "error": "Выберите город"}

    # Проверка наличия веса
    if request.weight is None:
        return {"success": False, "error": "Вес должен быть числом"}

    # Проверка что вес - число
    try:
        weight = float(request.weight)
    except (ValueError, TypeError):
        return {"success": False, "error": "Вес должен быть числом"}

    # Проверка допустимого веса
    if weight < 0:
        return {"success": False, "error": "Вес не может быть отрицательным"}

    if weight < 20:
        return {"success": False, "error": "Вес слишком мал (минимальный вес - 20 кг)"}

    if weight > 300:
        return {"success": False, "error": "Вес слишком велик (максимальный вес - 300 кг)"}

    # Проверка существования города
    if request.city not in cities_db:
        return {"success": False, "error": f"Город '{request.city}' не найден"}

    # Расчет нормы
    city_data = cities_db[request.city]
    base_norm = 30 * weight
    total_norm_ml = base_norm * city_data["multiplier"]

    result = {
        "weight": weight,
        "city": request.city,
        "temperature": city_data["temp"],
        "multiplier": city_data["multiplier"],
        "recommended_norm_ml": round(total_norm_ml),
        "recommended_norm_liters": round(total_norm_ml / 1000, 1)
    }

    return {"success": True, "data": result}


# Статические файлы
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root():
    return FileResponse("static/index.html")