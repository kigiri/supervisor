import React from 'react'
import Signup from './component/signup'
import Account from './component/account'
import Service from './component/service'
import AddService from './component/add-service'
import { Container, Dimmer, Divider, Loader, Button, Icon, Header, Menu } from 'semantic-ui-react'

const signIn = (<div>
  <a href='https://supervisor.oct.ovh/auth/github'>
    <Button secondary icon labelPosition='left'>
      <Icon name='github' />
      Sign in
    </Button>
  </a>
</div>)

export default store => (
  <Container style={{ marginTop: '3em' }}>
    <Header as='h2' icon={store.user.loadStatus !== 'success'}>
      <Icon name='settings' />
      <Header.Content>
        Supervisor
        <Header.Subheader>
          Manage your services
        </Header.Subheader>
      </Header.Content>
    </Header>
    <Divider horizontal>Add New Services</Divider>
    {AddService(store)}
    <Divider horizontal>Service List</Divider>
    {store.services.map(Service)}
    <Dimmer active={store.user.loadStatus === 'loading'}>
      <Loader content='Loading' />
    </Dimmer>
    <Dimmer active={store.error}>
     {String(store.error)}
    </Dimmer>
    { store.user.loadStatus === 'unauthorized' ? signIn : undefined }
  </Container>
)
