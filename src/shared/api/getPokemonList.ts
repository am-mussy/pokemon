import axios from "axios";
import {keepPreviousData, useQuery} from "@tanstack/react-query";

import {
    PokemonDescriptionResponse,
    PokemonListResponse,
    PokemonMainInfo
} from "../interfaces/pokemonAPIRespons.ts";


// Запрашиваем общее количество покемонов, для пагинации
const fetchPokemonsList = async (): Promise<PokemonListResponse> => {
    const { data } = await axios.get<PokemonListResponse>(`https://pokeapi.co/api/v2/pokemon-species/`);
    return data;
};

export const usePokemonsList = () => {

    return useQuery({
        queryKey: ['pokemonList'],
        queryFn: fetchPokemonsList,
        placeholderData: keepPreviousData
    })
}


// Запрашиваем данные покемонов для колонок таблицы
const fetchPokemon = async (id: number):Promise<PokemonMainInfo> => {
    const { data } = await axios.get<PokemonMainInfo>(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return data;
};

const fetchPokemons = async (page: number, pageSize: number, total: number):Promise<PokemonMainInfo[]> => {
    const pokemonPromises = [];

    for (let id = ((page * pageSize) - pageSize) + 1; id <= page * pageSize && id < total; id++) {

        const fetch = fetchPokemon(id);
        pokemonPromises.push(fetch);
    }
    return Promise.all(pokemonPromises);
};

export const usePokemons = (page: number, pageSize: number, total: number) => {

    return useQuery({
        queryKey: ['pokemon', 'all', page, pageSize, total],
        queryFn: () => fetchPokemons(page, pageSize, total),
    });

}

const fetchPokemonDescription = async (name: string):Promise<PokemonDescriptionResponse> => {
    const { data } = await axios.get<PokemonDescriptionResponse>(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    return data;
};

export const usePokemonsDescription = (name:string) => {
     return  useQuery({
        queryKey: ['pokemonDescription', name],
        queryFn: () => fetchPokemonDescription(name),
        placeholderData: keepPreviousData
    })
}