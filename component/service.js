import React from 'react'
import { distanceInWordsToNow } from 'date-fns'
import store from '../store'
import {
  Button,
  Icon,
  Menu,
  Segment,
  Form,
  Input,
  Label,
  Statistic,
} from 'semantic-ui-react'

const colors = {
  bg: '#282a36',
  fg: '#f8f8f2',
  selected: '#44475a',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c',
}

const countStyle = {
  // background: ,
  color: colors.comment,
  // borderRadius: 3,
  // marginRight: 4,
  // display: 'inline-block',
}

const inverted = {
  background: colors.bg,
  borderColor: 'black',
  color: colors.fg,
}

const preStyle = {
  ...inverted,
  height: '22em',
  overflowY: 'scroll',
  overflowX: 'hidden',
  fontFamily: 'monospace',
}

const dist = ts =>
  distanceInWordsToNow(new Date(Number(ts.slice(0, -3))))

const select = (service, selected) => service.selected === selected
  ? undefined
  : () => store.dispatch.SERVICE_SELECT({ serviceName: service.name, selected })

const isLoading = ({ start, end, data }, name, icon) => (data
  && ((data.name || data) === name)
  && start
  && !end)
const actionButton = (type, icon, service, state) => {
  const loading = isLoading(state.async[type], service.name, icon)

  return (<Menu.Item
    style={{ color: '#CCC' }}
    disabled={loading}
    icon={loading ? 'wait' : icon}
    onClick={() => {
      store.dispatch[type]({ name: service.name })
      if (service.selected !== 'log') {
        store.dispatch.SERVICE_SELECT({
          serviceName: service.name,
          selected: 'log',
        })
      }
    }}
  />)
}

const addEnv = ev => {
  ev.preventDefault()
  if (!ev.target.value) return document.getElementById(`env-input-0`).select()
  store.dispatch.ADD_ENV(ev.target.name)
}
const addEnvIfEnter = ev => ev.key === 'Enter' ? addEnv(ev) : undefined
const selectInput = sign => ev => {
  ev.preventDefault()
  const el = document
    .getElementById(`env-input-${Number(ev.target.id.slice(10)) + sign}`)
    || document.querySelector('#logger .input input')
  el.select()
}
const selectNext = selectInput(+1)
const selectPrev = selectInput(-1)
const selectEventKeys = [ 'Enter', 'ArrowUp', 'ArrowDown' ]
const selectEventHandler = ev => selectEventKeys.includes(ev.key)
  ? (((ev.key === 'Enter' && !ev.shiftKey) || ev.key === 'ArrowDown')
    ? selectNext
    : selectPrev)(ev)
  : undefined

const toggleHide = () => store.dispatch.HIDE_ENV()
const valueStyle = {
  width: '33.3333%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}
const uptimeStatusEl = (time, color, icon) => (
  <Statistic style={valueStyle} color={color}>
    <Statistic.Value>
      <Icon name={icon} />
    </Statistic.Value>
    <Statistic.Label>
    {dist(time)}
    </Statistic.Label>
  </Statistic>
)
const uptimeStatus = service =>
  (!service.started || service.stopped > service.started)
    ? uptimeStatusEl(service.stopped, 'red', 'ban')
    : uptimeStatusEl(service.started, 'green', 'wait')

const contentSwitch = {
  undefined: service => (<Statistic.Group widths='3'>
    <Statistic style={valueStyle}>
      <Statistic.Value>
        <Icon name={service.icon || 'cube'} />
         -{service.version}
      </Statistic.Value>
      <Statistic.Label>{service.description}</Statistic.Label>
    </Statistic>
    {uptimeStatus(service)}
    <Statistic style={valueStyle}>
      <Statistic.Value>{service.port}</Statistic.Value>
      <Statistic.Label>port</Statistic.Label>
    </Statistic>
  </Statistic.Group>),
  log: (service, state) => {
    service.sub || store.dispatch.SUB()
    return (<table><tbody>{(service.logs || []).map(log => (
      <tr key={log.index} style={{ color: log.boot === service.lastBoot ? '' : colors.purple }}>
        <td style={countStyle}>{log.repeated ? log.repeated.length : ''}</td>
        <td>{log.message}</td>
      </tr>))}
    </tbody></table>)
  },
  env: (service, state) => (<Form>
    {Object.keys(service.env).sort().map((key, i) => (<Form.Field key={key}>
      <label>{key}</label>
      <Input
        value={service.env[key]}
        labelPosition='right'
        onKeyDown={selectEventHandler}
        id={`env-input-${i}`}
        type={state.hideEnv ? 'password' : 'text'}
        onChange={e => store.dispatch.ENV_CHANGE({
          serviceName: service.name,
          value: e.target.value,
          key,
        })}
        label={<Button icon='minus' onClick={() => store.dispatch
          .DEL_ENV({ serviceName: service.name, key }) } />
        }/>
    </Form.Field>))}
    <Input
      fluid
      action
      id={`env-input-${Object.keys(service.env).length}`}
      name={service.name}
      onKeyDown={addEnvIfEnter}
      onChange={store.controlled.addEnv}
      value={(state.inputsValues.addEnv || '')} >
        <Button
          style={{ marginRight: 16 }}
          icon={state.hideEnv ? 'unhide' : 'hide'}
          onClick={toggleHide} />
        <input />
        <Button icon='plus' name={service.name} onClick={addEnv} />
    </Input>
  </Form>),
}

module.exports = (service, state) => (<div key={service.name} style={{ paddingBottom: 20 }}>
  <Menu tabular attached='top'>
    <Menu.Item
      header
      active={!service.selected}
      onClick={select(service, undefined)}>
      {service.name.toUpperCase()}
    </Menu.Item>
    <Menu.Item
      icon='terminal'
      style={service.selected === 'log' ? inverted : {}}
      active={service.selected === 'log'}
      onClick={select(service, 'log')} />
    <Menu.Item
      icon='setting'
      active={service.selected === 'env'}
      onClick={select(service, 'env')} />
    <Menu.Menu position='right'>
      {actionButton('RESTART_SERVICE', 'repeat', service, state)}
      {actionButton('UPDATE_SERVICE', 'download', service, state)}
      {actionButton('START_SERVICE', 'play', service, state)}
      {actionButton('STOP_SERVICE', 'stop', service, state)}
    </Menu.Menu>
  </Menu>
  <Segment
    id={service.selected && `service-${service.selected}`}
    attached='bottom'
    style={service.selected === 'log' ? preStyle : {}}>
    {contentSwitch[service.selected](service, state)}
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
