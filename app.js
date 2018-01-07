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

const servicesList = store => (<div>
  <Divider horizontal>Add New Services</Divider>
  {AddService(store)}
  <Divider horizontal>Service List</Divider>
  {Object.keys(store.services)
    .map(serviceName => Service(store.services[serviceName], store))}
</div>)

export default store => {
  const loading = store.user.loadStatus === 'loading'
  const authenticated = store.user.loadStatus === 'success'
  return (<Container
    style={{ marginTop: '3em' }}
    textAlign={authenticated ? 'left' : 'centred'}>
    <Header as='h2' icon={!authenticated}>
      <Icon name='settings' />
      <Header.Content>
        Supervisor
        <Header.Subheader>
          Manage your services
        </Header.Subheader>
      </Header.Content>
    </Header>
    <Dimmer active={loading || store.error}>
      {String(store.error || '')}
      <Loader content='Loading' />
    </Dimmer>
    { store.user.loadStatus === 'unauthorized' ? signIn : servicesList(store) }
  </Container>)
}
