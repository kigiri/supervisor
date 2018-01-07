import React from 'react'
import store from '../store'
import {
  Button,
  Icon,
  Menu,
  Segment,
  Form,
  Input,
} from 'semantic-ui-react'

const select = (service, selected) => service.selected === selected
  ? undefined
  : () => store.dispatch.SERVICE_SELECT({ serviceName: service.name, selected })

const preStyle = {
  maxHeight: '20em',
  overflowY: 'scroll',
  overflowX: 'hidden',
  color: '#767676',
}

const contentSwitch = {
  undefined: service => service.description,
  log: service => (<pre style={preStyle}>
      {`root@head:/service/supervisor# ./start.sh
server started: http://localhost:6789
[Redis] connect
[Redis] ready
{ supervisor:
   { name: 'supervisor',
     version: '1.0.0',
     description: 'supervise services',
     main: 'index.js',
     scripts: { test: 'echo "Error: no test specified" && exit 1' },
     repository:
      { type: 'git',
        url: 'git+https://github.com/kigiri/service-supervisor.git' },
     keywords: [],
     author: '',
     license: 'ISC',
     bugs: { url: 'https://github.com/kigiri/service-supervisor/issues' },
     homepage: 'https://github.com/kigiri/service-supervisor#readme',
     dependencies: { '4k': '0.0.8', redis: '^2.8.0' },
     env: {} } }
TypeError: Cannot read property 'email' of null
    at getUserInfo.then (/service/supervisor/github.js:46:18)
    at <anonymous>
        `}
    </pre>),
  env: service => (<Form>
    {Object.keys(service.env).map(key => (<Form.Field key={key}>
      <label>{key}</label>
      <Input
        value={service.env[key]}
        labelPosition='right'
        onChange={e => store.dispatch.ENV_CHANGE({
          serviceName: service.name,
          value: e.target.value,
          key,
        })}
        label={<Button icon='minus' onClick={() => store.dispatch
          .DEL_ENV({ serviceName: service.name, key }) } />
        }/>
    </Form.Field>))}
    <Button type='submit'>Save</Button>
    <Input
      labelPosition='right'
      onChange={store.controlled.addEnv}
      value={store.getState().inputsValues.addEnv || ''}
      label={
        <Button icon='plus' onClick={() =>
          store.dispatch.ADD_ENV(service.name)} />
      }/>
  </Form>),
}

module.exports = service => (<div key={service.name} style={{ paddingBottom: 20 }}>
  <Menu tabular attached='top'>
    <Menu.Item
      header
      active={!service.selected}
      onClick={select(service, undefined)}>
      {service.name[0].toUpperCase()+service.name.slice(1)}
      <span style={{ fontWeight: 'normal', color: '#767676', marginLeft: '0.5em'}} >
       v{service.version}
      </span>
    </Menu.Item>
    <Menu.Menu position='right'>
      <Menu.Item
        icon='download'
        onClick={() => {
          if (service.selected !== 'log') {
            store.dispatch.SERVICE_SELECT({
              serviceName: service.name,
              selected: 'log',
            })
          }
        }} />
      <Menu.Item
        icon='repeat'
        onClick={() => {
          if (service.selected !== 'log') {
            store.dispatch.SERVICE_SELECT({
              serviceName: service.name,
              selected: 'log',
            })
          }
        }} />
      <Menu.Item
        icon='terminal'
        active={service.selected === 'log'}
        onClick={select(service, 'log')} />
      <Menu.Item
        icon='setting'
        active={service.selected === 'env'}
        onClick={select(service, 'env')} />
    </Menu.Menu>
  </Menu>
  <Segment attached='bottom'>
    {contentSwitch[service.selected](service)}
  </Segment>
</div>)

/*

(<Item>
  <Item.Content>
    <Item.Header>{service.name[0].toUpperCase()+service.name.slice(1)}</Item.Header>
    <Item.Meta>
      <span className='cinema'>{service.description}</span>
    </Item.Meta>
    <Item.Extra>
      <Button.Group floated='right' buttons={[
        { key: 'log', icon: 'terminal' },
        { key: 'restart', icon: 'repeat' },
        { key: 'env', icon: 'setting' },
      ]}/>
    </Item.Extra>
  </Item.Content>
</Item>)


*/
