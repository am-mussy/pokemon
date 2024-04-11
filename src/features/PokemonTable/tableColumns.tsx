import {
  Checkbox,
  TableColumnsType,
  TableColumnType,
  Tag,
  Typography,
} from "antd";
import { getRandomColor } from "../../shared/randomColor/randomColor.ts";
import {
  AllPokemonTypes,
  DataIndex,
} from "../../shared/types/pokemonTableСolumns.ts";
import PokemonTable from "./PokemonTable.tsx";

const { Text } = Typography;

export const getColumns = (
  getColumnSearchProps: (T: DataIndex) => TableColumnType<PokemonTable>,
  allPokemonTypes: AllPokemonTypes[],
): TableColumnsType<PokemonTable> => {
  return [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "10%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Стандартный",
      dataIndex: "is_default",
      align: "center",
      width: "5%",
      render: (is_default: boolean) => (
        <Checkbox checked={is_default} disabled />
      ),
    },
    {
      title: "Вес",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      width: "20%",
      render: (weight) => <Text keyboard>{weight}</Text>,
      sorter: (a, b) => a.weight - b.weight,
    },
    {
      title: "Опыт",
      dataIndex: "exp",
      key: "exp",
      align: "center",
      width: "20%",
      render: (exp) => <Text keyboard>{exp}</Text>,
      sorter: (a, b) => a.exp - b.exp,
    },
    {
      title: "Тип",
      key: "types",
      dataIndex: "types",
      filterSearch: true,
      filters: [...allPokemonTypes],
      onFilter: (value, record) => {
        if (typeof value === "string") {
          return record.types.some(
            (type: string) => type.toUpperCase() === value.toUpperCase(),
          );
        }
        return false;
      },
      render: (_: any, { types }: { types: string[] }) => (
        <>
          {types.map((type: string) => {
            return (
              <Tag color={getRandomColor()} key={type}>
                {type.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];
};
