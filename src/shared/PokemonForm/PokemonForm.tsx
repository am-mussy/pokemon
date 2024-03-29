import {Alert, Avatar, Collapse, CollapseProps, ColorPicker, Input, List, QRCode, Skeleton} from "antd";
import React from "react";
import style from './style.module.css'
import {usePokemonsDescription} from "../api/getPokemonList.ts";
import {PokemonDescription} from "../interfaces/pokemonDescription.ts";
import Panel from "antd/es/cascader/Panel";

interface PokemonFormProps {
    img: string | null;
    name: string;
}

export const PokemonForm: React.FC<PokemonFormProps> = (props) => {
    const {name, img} = props;

    const { data, isError, isLoading} = usePokemonsDescription(name)

    if(isError) {
        return (
            <div>
                <Alert type={'error'}/>
            </div>
        )
    }
    if(isLoading){
        return (
            <div>
                <Skeleton loading={isLoading} active avatar>
                    <List.Item.Meta
                        avatar={<Avatar  />}
                        title={<Input value={name} disabled size={'small'}/>}
                    />
                </Skeleton>
            </div>
        )
    }


    let pokemonDescription: PokemonDescription = {
        name : name,
        color: null,
        shape: null,
        generation: null
    };

    if(data && !isLoading && !isError) {
        pokemonDescription = {
            name: data.name,
            color: data.color?.name || null,
            shape: data.shape?.name || null,
            generation: data.generation?.name || null
        }
    }

    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'Купить на Ozon.ru',
            children: <div className={style.qr}>
                <QRCode value={`https://www.ozon.ru/search/?text=${name}` || '-'} />
            </div>,
        }
    ];

    const onChange = (key: string | string[]) => {
        console.log(key);
    };

    return (
        <div className={style.root}>

            <div className={style.header}>
                <Avatar className={style.avatar} shape="circle" src={img} size={64} />
            </div>
            <div className={style.info}>
                <label className={style.row}>
                    <span>Имя:</span>
                    <Input value={name} disabled size={'small'}/>
                </label>
                <label className={style.row}>
                    <span>Цвет:</span>
                    <div className={style.color}>
                        <Input value={pokemonDescription.color || 'Не известен'} disabled size={'small'}/>
                        <ColorPicker value={pokemonDescription.color} disabled  />
                    </div>
                </label>
                <label className={style.row}>
                    <span>Форма:</span>
                    <Input value={pokemonDescription.shape || 'Не известна'} disabled size={'small'}/>
                </label>
                <label className={style.row}>
                    <span>Поколение:</span>
                    <Input value={pokemonDescription.generation || 'Не известно'} disabled size={'small'}/>
                </label>
                <Collapse size={'small'} items={items} onChange={onChange} />
            </div>

        </div>
    )
}