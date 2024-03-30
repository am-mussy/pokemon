import { FC } from "react";
import { Modal, Typography } from "antd";
const { Text, Link, Title } = Typography;
export const ModalError: FC = () => {
  return (
    <div>
      <Modal title="Ошибка" open={true} closable={false} footer={null}>
        <Title>Что-то пошло не так</Title>
        <div>
          <Text>
            Попробуйте перезагрузить страницу или обратиться к владельцу
            ресурса:{" "}
          </Text>
          <Link href="https://t.me/aydogan" target="_blank">
            t.me/aydogan
          </Link>
        </div>
      </Modal>
    </div>
  );
};

export default ModalError;
