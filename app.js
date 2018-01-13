import React from 'react'
import Signup from './component/signup'
import Account from './component/account'
import Service from './component/service'
import AddService from './component/add-service'
import store from './store'
import { Container, Dimmer, Divider, Loader, Button, Icon, Header, Menu, Message } from 'semantic-ui-react'

const signIn = (<div>
  <a href='https://supervisor.oct.ovh/auth/github'>
    <Button secondary icon labelPosition='left'>
      <Icon name='github' />
      Sign in
    </Button>
  </a>
</div>)

const servicesList = state => (<div>
  <Divider horizontal>Add New Services</Divider>
  {AddService(state)}
  <Divider horizontal>Service List</Divider>
  {Object.keys(state.services)
    .map(serviceName => Service(state.services[serviceName], state))}
</div>)

export default state => {
  const loading = state.user.loadStatus === 'loading'
  const authenticated = state.user.loadStatus === 'success'
  return (<Container
    style={{ marginTop: '3em' }}
    textAlign={authenticated ? 'left' : 'center'}>
    <Header as='h2' icon={!authenticated}>
      <Icon name='settings' />
      <Header.Content>
        Supervisor
        <Header.Subheader>
          Manage your services
        </Header.Subheader>
      </Header.Content>
    </Header>
    {state.error && <Message negative onDismiss={store.dispatch.DISMISS_ERROR}>
      <Message.Header>{state.error.message}</Message.Header>
      <pre>{state.error.stack}</pre>
    </Message>}
    <Dimmer active={loading}>
      <Loader content='Loading' />
    </Dimmer>
    { state.user.loadStatus === 'unauthorized' ? signIn : servicesList(state) }
  </Container>)
}
