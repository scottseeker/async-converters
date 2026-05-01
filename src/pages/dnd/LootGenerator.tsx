import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './dnd.module.css';

type Tier = 'common' | 'uncommon' | 'rare' | 'veryRare' | 'legendary';

const LOOT_TABLES: Record<Tier, { items: string[]; goldMin: number; goldMax: number }> = {
  common: {
    goldMin: 5, goldMax: 50,
    items: [
      'Potion of Healing','Rope (50ft)','Torch x5','Rations x3 days','Bedroll',
      'Tinderbox','Waterskin','Shovel','Crowbar','Lantern (hooded)',
      'Ink & Quill','Sealing Wax','Calligrapher\'s Supplies','Mess Kit','Candles x10',
    ],
  },
  uncommon: {
    goldMin: 50, goldMax: 500,
    items: [
      'Potion of Greater Healing','+1 Ammunition (20)','Bag of Holding','Cloak of Protection',
      'Eyes of the Eagle','Goggles of Night','Helm of Comprehending Languages',
      'Rope of Climbing','Sending Stones','Weapon of Warning',
      'Boots of Elvenkind','Cloak of Elvenkind','Driftglobe','Hat of Disguise',
    ],
  },
  rare: {
    goldMin: 500, goldMax: 5000,
    items: [
      '+2 Weapon','Belt of Giant Strength (Hill)','Boots of Speed','Cloak of Displacement',
      'Flame Tongue Sword','Necklace of Fireballs','Ring of Protection',
      'Ring of Spell Storing','Staff of Healing','Sword of Life Stealing',
      'Wand of Fireballs','Wand of Paralysis','Headband of Intellect',
    ],
  },
  veryRare: {
    goldMin: 5000, goldMax: 50000,
    items: [
      '+3 Weapon','Amulet of the Planes','Carpet of Flying','Cloak of Invisibility',
      'Dancing Sword','Horn of Valhalla','Manual of Bodily Health','Mirror of Life Trapping',
      'Ring of Regeneration','Ring of Shooting Stars','Robe of the Archmagi',
      'Staff of Power','Stone of Controlling Earth Elementals',
    ],
  },
  legendary: {
    goldMin: 50000, goldMax: 500000,
    items: [
      'Deck of Many Things','Holy Avenger','Ring of Three Wishes','Staff of the Magi',
      'Vorpal Sword','Apparatus of Kwalish','Talisman of Pure Good','Talisman of Ultimate Evil',
      'Cube of Force','Iron Flask','Sphere of Annihilation','Tome of the Stilled Tongue',
    ],
  },
};

const TIER_LABELS: Record<Tier, string> = {
  common: 'Common', uncommon: 'Uncommon', rare: 'Rare', veryRare: 'Very Rare', legendary: 'Legendary',
};

const TIER_CLASS: Record<Tier, string> = {
  common: styles.rarityCommon, uncommon: styles.rarityUncommon, rare: styles.rarityRare,
  veryRare: styles.rarityVeryRare, legendary: styles.rarityLegendary,
};

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randItem<T>(arr: T[]) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function LootGenerator() {
  const [tier, setTier] = useState<Tier>('uncommon');
  const [itemCount, setItemCount] = useState(3);
  const [loot, setLoot] = useState<{ rarity: Tier; name: string }[]>([]);
  const [gold, setGold] = useState<number | null>(null);

  function generate() {
    const table = LOOT_TABLES[tier];
    // Mix: mostly chosen tier, small chance of adjacent tier
    const items: { rarity: Tier; name: string }[] = Array.from({ length: itemCount }, () => {
      const roll = Math.random();
      let chosenTier = tier;
      if (roll < 0.15) {
        const tiers = Object.keys(LOOT_TABLES) as Tier[];
        const idx = tiers.indexOf(tier);
        if (idx > 0) chosenTier = tiers[idx - 1];
      } else if (roll > 0.85) {
        const tiers = Object.keys(LOOT_TABLES) as Tier[];
        const idx = tiers.indexOf(tier);
        if (idx < tiers.length - 1) chosenTier = tiers[idx + 1];
      }
      return { rarity: chosenTier, name: randItem(LOOT_TABLES[chosenTier].items) };
    });
    setLoot(items);
    setGold(randInt(table.goldMin, table.goldMax));
  }

  return (
    <ConverterShell title="Loot Generator" description="Generate random D&D 5e treasure and magic items by tier." category="dnd">
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Treasure Tier</label>
            <select value={tier} onChange={e => setTier(e.target.value as Tier)}>
              {(Object.keys(LOOT_TABLES) as Tier[]).map(t => (
                <option key={t} value={t}>{TIER_LABELS[t]}</option>
              ))}
            </select>
          </div>
          <div className={styles.field} style={{ flex: 1, minWidth: 80 }}>
            <label>Items</label>
            <input type="number" min={1} max={10} value={itemCount} onChange={e => setItemCount(Math.max(1, Math.min(10, Number(e.target.value))))} />
          </div>
        </div>
        <div className={styles.actions}>
          <button onClick={generate}>Generate Loot</button>
        </div>
        {loot.length > 0 && (
          <>
            {gold !== null && (
              <div style={{ fontSize: '0.875rem', color: '#f0a030', fontWeight: 700 }}>
                💰 {gold.toLocaleString()} gp
              </div>
            )}
            <div className={styles.lootList}>
              {loot.map((item, i) => (
                <div key={i} className={styles.lootItem}>
                  <span className={`${styles.lootRarity} ${TIER_CLASS[item.rarity]}`}>
                    {TIER_LABELS[item.rarity]}
                  </span>
                  {item.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
