import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './tcg.module.css';

// Curated list of Pokémon with types [name, type1, type2|null, gen]
const POKEMON: [string, string, string | null, number][] = [
  ['Bulbasaur','Grass','Poison',1],['Charmander','Fire',null,1],['Squirtle','Water',null,1],
  ['Pidgey','Normal','Flying',1],['Rattata','Normal',null,1],['Pikachu','Electric',null,1],
  ['Clefairy','Normal','Fairy',1],['Jigglypuff','Normal','Fairy',1],['Geodude','Rock','Ground',1],
  ['Gengar','Ghost','Poison',1],['Starmie','Water','Psychic',1],['Scyther','Bug','Flying',1],
  ['Gyarados','Water','Flying',1],['Eevee','Normal',null,1],['Vaporeon','Water',null,1],
  ['Jolteon','Electric',null,1],['Flareon','Fire',null,1],['Lapras','Water','Ice',1],
  ['Snorlax','Normal',null,1],['Dragonite','Dragon','Flying',1],['Mewtwo','Psychic',null,1],
  ['Mew','Psychic',null,1],['Raichu','Electric',null,1],['Clefable','Normal','Fairy',1],
  ['Venusaur','Grass','Poison',1],['Charizard','Fire','Flying',1],['Blastoise','Water',null,1],
  ['Alakazam','Psychic',null,1],['Machamp','Fighting',null,1],['Tentacruel','Water','Poison',1],

  ['Chikorita','Grass',null,2],['Cyndaquil','Fire',null,2],['Totodile','Water',null,2],
  ['Togepi','Fairy',null,2],['Togetic','Normal','Fairy',2],['Umbreon','Dark',null,2],
  ['Espeon','Psychic',null,2],['Scizor','Bug','Steel',2],['Heracross','Bug','Fighting',2],
  ['Sneasel','Dark','Ice',2],['Tyranitar','Rock','Dark',2],['Lugia','Psychic','Flying',2],
  ['Ho-Oh','Fire','Flying',2],['Murkrow','Dark','Flying',2],['Misdreavus','Ghost',null,2],
  ['Wooper','Water','Ground',2],['Quagsire','Water','Ground',2],['Skarmory','Steel','Flying',2],
  ['Feraligatr','Water',null,2],['Meganium','Grass',null,2],['Typhlosion','Fire',null,2],

  ['Treecko','Grass',null,3],['Torchic','Fire',null,3],['Mudkip','Water',null,3],
  ['Ralts','Psychic','Fairy',3],['Kirlia','Psychic','Fairy',3],['Gardevoir','Psychic','Fairy',3],
  ['Sableye','Dark','Ghost',3],['Mawile','Steel','Fairy',3],['Aggron','Steel','Rock',3],
  ['Flygon','Dragon','Ground',3],['Absol','Dark',null,3],['Salamence','Dragon','Flying',3],
  ['Metagross','Steel','Psychic',3],['Latias','Dragon','Psychic',3],['Latios','Dragon','Psychic',3],
  ['Rayquaza','Dragon','Flying',3],['Blaziken','Fire','Fighting',3],['Swampert','Water','Ground',3],

  ['Turtwig','Grass',null,4],['Chimchar','Fire',null,4],['Piplup','Water',null,4],
  ['Lucario','Fighting','Steel',4],['Garchomp','Dragon','Ground',4],['Riolu','Fighting',null,4],
  ['Togekiss','Fairy','Flying',4],['Glaceon','Ice',null,4],['Leafeon','Grass',null,4],
  ['Weavile','Dark','Ice',4],['Electivire','Electric',null,4],['Magmortar','Fire',null,4],
  ['Roserade','Grass','Poison',4],['Infernape','Fire','Fighting',4],['Empoleon','Water','Steel',4],

  ['Snivy','Grass',null,5],['Tepig','Fire',null,5],['Oshawott','Water',null,5],
  ['Zoroark','Dark',null,5],['Chandelure','Ghost','Fire',5],['Haxorus','Dragon',null,5],
  ['Hydreigon','Dark','Dragon',5],['Reshiram','Dragon','Fire',5],['Zekrom','Dragon','Electric',5],

  ['Fennekin','Fire',null,6],['Froakie','Water',null,6],['Chespin','Grass',null,6],
  ['Sylveon','Fairy',null,6],['Noivern','Flying','Dragon',6],['Goodra','Dragon',null,6],
  ['Greninja','Water','Dark',6],['Talonflame','Fire','Flying',6],

  ['Rowlet','Grass','Flying',7],['Litten','Fire',null,7],['Popplio','Water',null,7],
  ['Mimikyu','Ghost','Fairy',7],['Kommo-o','Dragon','Fighting',7],['Lunala','Psychic','Ghost',7],
  ['Solgaleo','Psychic','Steel',7],

  ['Grookey','Grass',null,8],['Scorbunny','Fire',null,8],['Sobble','Water',null,8],
  ['Dragapult','Dragon','Ghost',8],['Zacian','Fairy',null,8],['Zamazenta','Fighting',null,8],

  ['Sprigatito','Grass',null,9],['Fuecoco','Fire',null,9],['Quaxly','Water',null,9],
  ['Koraidon','Fighting','Dragon',9],['Miraidon','Electric','Dragon',9],
];


export default function RandomPokemonTeam() {
  const [genFilter, setGenFilter] = useState(0); // 0 = all
  const [team, setTeam] = useState<typeof POKEMON>([]);

  function generate() {
    const pool = genFilter === 0 ? POKEMON : POKEMON.filter(p => p[3] === genFilter);
    if (pool.length < 6) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setTeam(shuffled.slice(0, 6));
  }

  const gens = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <ConverterShell title="Random Pokémon Team" description="Generate a random Pokémon team of 6, with optional generation filter." category="tcg">
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field} style={{ flex: 1, minWidth: 140 }}>
            <label>Generation Filter</label>
            <select value={genFilter} onChange={e => setGenFilter(Number(e.target.value))}>
              {gens.map(g => <option key={g} value={g}>{g === 0 ? 'All Generations' : `Gen ${g}`}</option>)}
            </select>
          </div>
          <div className={styles.field} style={{ justifyContent: 'flex-end' }}>
            <button onClick={generate}>Generate Team</button>
          </div>
        </div>

        {team.length > 0 && (
          <div className={styles.pokemonCards}>
            {team.map((p, i) => (
              <div key={i} className={styles.pokemonCard}>
                <div>{p[0]}</div>
                <div className={styles.pokemonType}>
                  {p[1]}{p[2] ? ` / ${p[2]}` : ''} · Gen {p[3]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
