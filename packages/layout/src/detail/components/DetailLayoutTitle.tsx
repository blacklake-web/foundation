import React, { CSSProperties, ReactNode } from 'react';
import { Row, Col, Button, Dropdown, Menu, Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
//
import { DetailLayoutMenuItem } from '../DetailLayout.type';

interface DetailLayoutTitleProps {
  /**详情标题 */
  title?: ReactNode;
  /**标题旁拓展内容 */
  extra?: ReactNode;
  /**操作按钮列表 */
  baseMenu?: DetailLayoutMenuItem[];
  style?: CSSProperties;
}

const titleStyle = {
  padding: '10px 20px',
  borderBottom: '1px solid #b1b1b12e',
};
const extraStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
};

const baseButtonStyle = {
  border: 'none',
  background: '#f5f5f5'
}

const DetailLayoutTitle = (props: DetailLayoutTitleProps) => {
  const { title, extra, baseMenu = [], style } = props;

  const renderTitle = () => {
    const isNodeTitle = typeof title === 'object';

    return isNodeTitle ? title : <h2 style={{ marginBottom: 0 }}>{title}</h2>;
  };

  const renderMenu = (menuList: DetailLayoutMenuItem[]) => {
    return (
      <Menu>
        {menuList.map((item) => {
          return (
            <Menu.Item key={item.key} icon={item?.icon} onClick={item.onClick}>
              {item.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  /**
   * 渲染baseMenu的其他菜单按钮(第二个及以后)
   * @returns reactNode
   */
  const renderBaseMenu = () => {
    const isEmptyMenu = baseMenu?.length === 0;

    if (isEmptyMenu) return null;

    const isMoreMenu = baseMenu?.length > 5;
    const firstMenuItem = baseMenu[1];

    if (!firstMenuItem) return null;

    return (
      <>
        {isMoreMenu ? (
          <Dropdown.Button
            onClick={firstMenuItem.onClick}
            overlay={
              isMoreMenu ? renderMenu(baseMenu.filter((item, index) => index > 1)) : <span />
            }
            icon={isMoreMenu ? <EllipsisOutlined /> : ''}
          >
            {firstMenuItem.icon}
            {firstMenuItem.title}
          </Dropdown.Button>
        ) : (
          baseMenu.map((item) =>
            item.buttonRender ? (
              item.buttonRender
            ) : (
              <Button style={baseButtonStyle} onClick={item.onClick}>
                {item.icon}
                {item.title}
              </Button>
            ),
          )
        )}
      </>
    );
  };

  return (
    <div style={{ ...titleStyle, ...style }}>
      <Row justify={'space-between'}>
        <Col span={14}>{renderTitle()}</Col>
        <Col span={10} style={extraStyle}>
          <Space size={8} align="start">
            {extra}
            {renderBaseMenu()}
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export { DetailLayoutTitle };
