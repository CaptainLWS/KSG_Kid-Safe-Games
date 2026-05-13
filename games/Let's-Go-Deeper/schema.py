# schema.py

VALID_ZONES = {"Shallow", "Twilight", "Midnight", "Abyss"}
VALID_RARITIES = {"Common", "Uncommon", "Rare", "Legendary"}

def validate_creature(data):
    errors = []

    if data.get("zone") not in VALID_ZONES:
        errors.append(f"Invalid zone: {data.get('zone')}")

    if data.get("rarity") not in VALID_RARITIES:
        errors.append(f"Invalid rarity: {data.get('rarity')}")

    required = ["id", "name", "zone", "rarity", "size_cm", "fact"]
    for field in required:
        if field not in data:
            errors.append(f"Missing field: {field}")

    return errors
