# models.py

from dataclasses import dataclass, field
from typing import Dict

@dataclass
class SeaCreature:
    id: int
    name: str
    zone: str
    rarity: str
    size_cm: int
    fact: str

@dataclass
class Player:
    name: str
    collection: Dict[int, int] = field(default_factory=dict)

    def add_creature(self, creature: SeaCreature):
        self.collection[creature.id] = self.collection.get(creature.id, 0) + 1
