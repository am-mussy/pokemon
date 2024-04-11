export type PokemonTable = {
  key: string | number;
  name: string;
  is_default: boolean;
  weight: number;
  species: string;
  img: string | null;
  types: string[];
  exp: number;
};

export type DataIndex = keyof PokemonTable;

export type AllPokemonTypes = {
  value: string;
  text: string;
};
