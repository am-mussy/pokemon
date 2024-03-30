export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

interface PokemonResult {
  name: string;
  url: string;
}

type Species = {
  name: string;
  url: string;
};

type Sprites = {
  front_default: string | null;
};

export type PokemonType = {
  name: string;
  url: string;
};

export type PokemonTypes = {
  slot: number;
  type: PokemonType;
};

export interface PokemonMainInfo {
  name: string;
  is_default: boolean;
  weight: number;
  species: Species;
  sprites: Sprites;
  types: PokemonTypes[];
  base_experience: number;
}

type PokemonColor = {
  name: string;
  url: string;
};

type PokemonShape = {
  name: string;
  url: string;
};

type PokemonGeneration = {
  name: string;
  url: string;
};

export interface PokemonDescriptionResponse {
  name: string;
  color: PokemonColor | null;
  shape: PokemonShape | null;
  generation: PokemonGeneration | null;
}
