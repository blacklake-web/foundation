import React, { CSSProperties, ReactElement, ReactNode } from 'react';
import { Row, Col, Button, Dropdown, Menu, Space } from 'antd';
import { BlIcon } from '@blacklake-web/component';
import { DetailLayoutMenuItem } from '../DetailLayout.type';
import './DetailLayoutContent.less';

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

const renderIcon = (icon: DetailLayoutMenuItem['icon']) =>
  typeof icon === 'string' ? <BlIcon type={icon} /> : icon;
const renderButtonText = (text: DetailLayoutMenuItem['title']) => {
  if (text.length === 2) {
    return text.split('').join(' ');
  }
  return text;
};

const DetailLayoutTitle = (props: DetailLayoutTitleProps) => {
  const { title, extra, baseMenu = [], style } = props;

  const renderTitle = () => {
    const isNodeTitle = typeof title === 'object';

    return isNodeTitle ? title : <h2 style={{ margin: '10px 0', fontSize: 18 }}>{title}</h2>;
  };

  const renderMenu = (menuList: DetailLayoutMenuItem[]) => {
    return (
      <Menu>
        {menuList.map((item) => {
          return (
            <Menu.Item
              key={item.key}
              disabled={item.disabled}
              icon={renderIcon(item.icon)}
              onClick={item.onClick}
            >
              {renderButtonText(item.title)}
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

    const isMoreMenu = baseMenu?.length > 2;
    const firstMenuItem = baseMenu[0];

    if (!firstMenuItem) return null;

    const lastMenuItem = baseMenu[baseMenu.length - 1];

    return (
      <>
        {isMoreMenu ? (
          <>
            <Dropdown.Button
              buttonsRender={([leftButton, rightButton]) => [
                React.cloneElement(leftButton as ReactElement, {
                  disabled: firstMenuItem.disabled,
                }),
                rightButton,
              ]}
              icon={<BlIcon type="iconxiala" />}
              onClick={firstMenuItem.onClick}
              overlay={renderMenu(
                baseMenu.filter((_, index) => index > 0 && index < baseMenu.length - 1),
              )}
              overlayStyle={{ width: 116 }}
            >
              {renderIcon(firstMenuItem.icon)}
              {renderButtonText(firstMenuItem.title)}
            </Dropdown.Button>
            <Button
              key={lastMenuItem.key}
              disabled={lastMenuItem.disabled}
              type="primary"
              onClick={lastMenuItem.onClick}
            >
              {renderIcon(lastMenuItem.icon)}
              {renderButtonText(lastMenuItem.title)}
            </Button>
          </>
        ) : (
          baseMenu.map((item, idx) =>
            item.buttonRender ? (
              item.buttonRender
            ) : (
              <Button
                key={item.key}
                disabled={item.disabled}
                type={idx === baseMenu.length - 1 ? 'primary' : 'default'}
                onClick={item.onClick}
              >
                {renderIcon(item.icon)}
                {renderButtonText(item.title)}
              </Button>
            ),
          )
        )}
      </>
    );
  };

  return (
    <div className={'detail-title '} style={{ ...titleStyle, ...style }}>
      <Row justify={'space-between'} style={{ alignItems: 'center' }}>
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
