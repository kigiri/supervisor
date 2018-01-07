import React from 'react'
import Logo from './logo'
import {
  Icon,
  Menu,
  Image,
  Container,
} from 'semantic-ui-react'

export default store => (
  <Menu fixed='top' inverted>
    <Container>
      <Menu.Item as='a' header href='/'>
        <div style={{ paddingRight: 5 }}><Logo size={20} /></div>
        NaN.ci
      </Menu.Item>
      <Menu.Item as='a' active>User</Menu.Item>
      <Menu.Item as='a' href='/refs'>Refs</Menu.Item>
      <Menu.Item as='a' href='/blog'>Blog</Menu.Item>
      <Menu.Item as='a' href='/faq'>FAQ</Menu.Item>

      <Menu.Menu position='right'>
        <Menu.Item name='signup'>
        <Image avatar src={`${store.user.avatar}?s=56&v=4`}></Image>
         {store.user.login}
        </Menu.Item>
        <Menu.Item name='logout' onClick={() => console.log('wee')}>
         Logout
        </Menu.Item>
      </Menu.Menu>
    </Container>
  </Menu>
)
