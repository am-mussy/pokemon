import { FC, useEffect, useState } from "react";
import { Checkbox, GetProp, Table, TableColumnsType, TableProps } from "antd";
import { PokemonTable } from "../../shared/interfaces/pokemonTableСolumns.ts";
import {
  usePokemons,
  usePokemonsList,
} from "../../shared/api/pokemonQueries.ts";
import { PokemonForm } from "../../shared/PokemonForm/PokemonForm.tsx";
import { PokemonMainInfo } from "../../shared/interfaces/pokemonAPIRespons.ts";

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

const columns: TableColumnsType<PokemonTable> = [
  {
    title: "Имя",
    dataIndex: "name",
    key: "name",
    align: "center",
    width: "10%",
  },
  {
    title: "Стандартный",
    dataIndex: "is_default",
    align: "center",
    width: "5%",
    render: (is_default) => <Checkbox checked={is_default} disabled />,
  },
  {
    title: "Вес",
    dataIndex: "weight",
    key: "weight",
    align: "center",
    width: "5%",
    sorter: (a, b) => a.weight - b.weight,
  },
  {
    title: "Вид",
    dataIndex: "species",
    key: "species",
    align: "center",
    width: "20%",
  },
  Table.EXPAND_COLUMN,
];

const MainPokemonTable: FC = () => {
  const { data: pokemonListData, isLoading, isError } = usePokemonsList();
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 20,
  });

  const { data: pokemonMainInfo, isLoading: pokemonIsLoading } = usePokemons(
    pagination.current ?? 1,
    pagination.pageSize ?? 20,
    pagination.total ?? 20,
  );

  let pokemonData: PokemonTable[] = [];

  if (pokemonMainInfo && !pokemonIsLoading) {
    pokemonData = pokemonMainInfo.map((item: PokemonMainInfo) => {
      return {
        key: item.name,
        name: item.name,
        is_default: item.is_default,
        weight: item.weight,
        species: item.species.name,
        img: item.sprites.front_default,
      };
    });
  }

  useEffect(() => {
    if (!isLoading && !isError && pokemonListData) {
      setPagination({ ...pagination, total: pokemonListData.count });
    }
  }, [pokemonListData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  return (
    <div>
      <Table
        loading={pokemonIsLoading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        columns={columns}
        expandable={{
          expandedRowRender: (record) => (
            <PokemonForm name={record.name} img={record.img} />
          ),
        }}
        rowKey={(record) => record.name}
        dataSource={pokemonData}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default MainPokemonTable;
