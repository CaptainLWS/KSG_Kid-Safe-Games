import random
from dataclasses import dataclass, field
from typing import List, Dict


# -----------------------------
# Data models
# -----------------------------

@dataclass
class SeaCreature:
    id: int
    name: str
    zone: str          # e.g. "Shallow", "Twilight", "Midnight", "Abyss"
    rarity: str        # "Common", "Uncommon", "Rare", "Legendary"
    size_cm: int
    fact: str


@dataclass
class Player:
    name: str
    collection: Dict[int, int] = field(default_factory=dict)
    # collection maps creature_id -> count

    def add_creature(self, creature: SeaCreature):
        self.collection[creature.id] = self.collection.get(creature.id, 0) + 1

    def total_creatures(self) -> int:
        return sum(self.collection.values())


# -----------------------------
# Creature database
# -----------------------------

def build_creature_db() -> List[SeaCreature]:
from creature_loader import load_creature_packs

def start_game():
    print_header()
    name = input("Enter your explorer name: ").strip() or "Explorer"
    player = Player(name=name)

    print("\nLoading marine biology packs...")
    db = load_creature_packs()
    print(f"Loaded {len(db)} species.\n")

    main_menu(player, db)


# -----------------------------
# Game logic
# -----------------------------

DEPTH_ZONES = ["Shallow", "Twilight", "Midnight", "Abyss"]

RARITY_WEIGHTS = {
    "Common": 60,
    "Uncommon": 25,
    "Rare": 12,
    "Legendary": 3,
}


def filter_by_zone(creatures: List[SeaCreature], zone: str) -> List[SeaCreature]:
    return [c for c in creatures if c.zone == zone]


def choose_creature_by_rarity(candidates: List[SeaCreature]) -> SeaCreature:
    # Weighted random choice by rarity
    weights = [RARITY_WEIGHTS.get(c.rarity, 1) for c in candidates]
    return random.choices(candidates, weights=weights, k=1)[0]


def attempt_capture(creature: SeaCreature) -> bool:
    # Simple capture logic: rarer creatures are harder to catch
    base_chance = {
        "Common": 0.9,
        "Uncommon": 0.7,
        "Rare": 0.45,
        "Legendary": 0.25,
    }.get(creature.rarity, 0.5)

    roll = random.random()
    return roll <= base_chance


# -----------------------------
# UI helpers (text-based)
# -----------------------------

def print_header():
    print("=" * 50)
    print("        LET'S GO DEEPER — OCEAN EXPLORATION")
    print("=" * 50)
    print("Fact-based sea creatures. Kid-safe. Learn as you explore.\n")


def choose_zone() -> str:
    print("Choose a depth zone to explore:")
    for i, zone in enumerate(DEPTH_ZONES, start=1):
        print(f"  {i}. {zone}")
    print("  0. Go back")

    while True:
        choice = input("Enter choice: ").strip()
        if choice == "0":
            return ""
        if choice.isdigit():
            idx = int(choice)
            if 1 <= idx <= len(DEPTH_ZONES):
                return DEPTH_ZONES[idx - 1]
        print("Invalid choice. Try again.")


def show_player_collection(player: Player, db: List[SeaCreature]):
    print("\n--- YOUR FISH FARM ---")
    if not player.collection:
        print("You haven't collected any creatures yet.")
        return

    id_to_creature = {c.id: c for c in db}
    for cid, count in player.collection.items():
        creature = id_to_creature.get(cid)
        if creature:
            print(f"- {creature.name} x{count} "
                  f"({creature.zone}, {creature.rarity}, ~{creature.size_cm} cm)")
    print(f"\nTotal creatures: {player.total_creatures()}")
    print("----------------------\n")


def explore_zone(player: Player, db: List[SeaCreature]):
    zone = choose_zone()
    if not zone:
        return

    candidates = filter_by_zone(db, zone)
    if not candidates:
        print(f"No data for zone: {zone} yet. Add more creatures to the database!")
        return

    print(f"\nDiving into the {zone} zone...")
    print("Scanning for life...\n")

    # Simulate encounter
    creature = choose_creature_by_rarity(candidates)
    print(f"You encountered a {creature.name}!")
    print(f"Zone: {creature.zone}")
    print(f"Rarity: {creature.rarity}")
    print(f"Approx. size: {creature.size_cm} cm")
    print(f"Fact: {creature.fact}\n")

    while True:
        action = input("Try to collect it? (y/n): ").strip().lower()
        if action in ("y", "n"):
            break
        print("Please enter 'y' or 'n'.")

    if action == "n":
        print(f"You watch the {creature.name} swim away peacefully.\n")
        return

    success = attempt_capture(creature)
    if success:
        player.add_creature(creature)
        print(f"Success! You gently added {creature.name} to your fish farm.")
        print("Remember: in the real ocean, we protect and observe, not capture.\n")
    else:
        print(f"The {creature.name} slipped away into the deep...\n")


def main_menu(player: Player, db: List[SeaCreature]):
    while True:
        print("MAIN MENU")
        print("  1. Explore the ocean")
        print("  2. View your fish farm")
        print("  3. Learn about depth zones")
        print("  0. Quit")
        choice = input("Choose an option: ").strip()

        if choice == "1":
            explore_zone(player, db)
        elif choice == "2":
            show_player_collection(player, db)
        elif choice == "3":
            show_depth_zone_info()
        elif choice == "0":
            print("\nThank you for exploring. Keep caring for the ocean.")
            break
        else:
            print("Invalid choice. Try again.\n")


def show_depth_zone_info():
    print("\n--- DEPTH ZONES ---")
    print("Shallow: Sunlit waters near the surface, coral reefs, and coastal life.")
    print("Twilight: Dim light, many bioluminescent creatures begin to appear.")
    print("Midnight: No sunlight, only darkness and bioluminescence.")
    print("Abyss: Extreme pressure, near freezing, some of the strangest life forms.\n")


def start_game():
    print_header()
    name = input("Enter your explorer name: ").strip() or "Explorer"
    player = Player(name=name)
    db = build_creature_db()

    print(f"\nWelcome, {player.name}. Your mission: learn, explore, and build a peaceful fish farm.\n")
    main_menu(player, db)


if __name__ == "__main__":
    start_game()
