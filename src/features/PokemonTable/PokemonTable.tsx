import { FC, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  GetProp,
  Input,
  InputRef,
  Space,
  Table,
  TableColumnsType,
  TableColumnType,
  TableProps,
  Tag,
  Typography,
} from "antd";
import { PokemonTable } from "../../shared/interfaces/pokemonTableСolumns.ts";
import {
  usePokemons,
  usePokemonsList,
} from "../../shared/api/pokemonQueries.ts";
import { PokemonForm } from "../../shared/PokemonForm/PokemonForm.tsx";
import {
  PokemonMainInfo,
  PokemonTypes,
} from "../../shared/interfaces/pokemonAPIRespons.ts";
import { getRandomColor } from "../../shared/randomColor/randomColor.ts";
import { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import ModalError from "../../shared/modal/modalError/ModalError.tsx";
const { Text } = Typography;

type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

type DataIndex = keyof PokemonTable;

type AllPokemonTypes = {
  value: string;
  text: string;
};

const MainPokemonTable: FC = () => {
  const {
    data: pokemonListData,
    isLoading,
    isError: isPokemonListError,
  } = usePokemonsList();

  const [pagination, setPagination] = useState<TablePaginationConfig>({
    pageSize: 20,
  });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  let pokemonData: PokemonTable[] = [];
  const uniquePokemonTypes: Set<string> = new Set();
  const allPokemonTypes: AllPokemonTypes[] = [];

  const {
    data: pokemonMainInfo,
    isLoading: pokemonIsLoading,
    isError: isPokemonMainInfoError,
  } = usePokemons(
    pagination.current ?? 1,
    pagination.pageSize ?? 20,
    pagination.total ?? 20,
  );

  if (pokemonMainInfo && !pokemonIsLoading) {
    pokemonData = pokemonMainInfo.map((item: PokemonMainInfo) => {
      const types: string[] = item.types.map((typeObj: PokemonTypes) => {
        uniquePokemonTypes.add(typeObj.type.name);
        return typeObj.type.name;
      });

      return {
        key: item.name,
        name: item.name,
        is_default: item.is_default,
        weight: item.weight,
        species: item.species.name,
        img: item.sprites.front_default,
        exp: item.base_experience,
        types,
      };
    });

    for (const type of uniquePokemonTypes) {
      allPokemonTypes.push({ text: type, value: type });
    }
  }

  useEffect(() => {
    if (!isLoading && !isPokemonListError && pokemonListData) {
      setPagination({ ...pagination, total: pokemonListData.count });
    }
  }, [pokemonListData]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): TableColumnType<PokemonTable> => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        return record[dataIndex]!.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        ),
    };
  };

  const columns: TableColumnsType<PokemonTable> = [
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
      render: (is_default) => <Checkbox checked={is_default} disabled />,
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
        return record.types.some(
          (el) => el.toUpperCase() === String(value).toUpperCase(),
        );
      },
      render: (_, { types }) => (
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
    Table.EXPAND_COLUMN,
  ];

  if (isPokemonListError || isPokemonMainInfoError) {
    return <ModalError />;
  }

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
