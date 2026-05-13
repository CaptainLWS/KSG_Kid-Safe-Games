# creature_loader.py

import json
import os
from schema import validate_creature
from models import SeaCreature

PACK_DIR = "creature_packs"

def load_creature_packs():
    creatures = []
    seen_ids = set()

    for filename in os.listdir(PACK_DIR):
        if not filename.endswith(".json"):
            continue

        path = os.path.join(PACK_DIR, filename)

        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"[ERROR] Could not read {filename}: {e}")
            continue

        for entry in data:
            errors = validate_creature(entry)
            if errors:
                print(f"[INVALID] {filename} creature skipped: {errors}")
                continue

            if entry["id"] in seen_ids:
                print(f"[DUPLICATE] ID {entry['id']} skipped (already used).")
                continue

            seen_ids.add(entry["id"])
            creatures.append(SeaCreature(**entry))

    return creatures
