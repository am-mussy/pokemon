export interface PokemonTable {
  key: string | number;
  name: string;
  is_default: boolean;
  weight: number;
  species: string;
  img: string | null;
}
