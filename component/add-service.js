import React from 'react'
import store from '../store'
import {
  Button,
  Form,
  Input,
  Icon,
  Message,
} from 'semantic-ui-react'

const alert = error => error && (<Message
  style={{ whiteSpace: 'pre', fontFamily: 'monospace' }}
  error
  onDismiss={store.dispatch.DISMISS_ADD_SERVICE}
  header={error.message}
  content={error.srcStack}
/>)
module.exports = ({ inputsValues: { serviceRepo, serviceName }, async }) => {
  serviceRepo
    || (serviceRepo = (serviceName || '')
      && `github.com/kigiri/service-${serviceName}`)

  return (<Form error={Boolean(async.ADD_SERVICE.error)}>
    <Form.Group widths='equal'>
      <Form.Field width={6}>
        <label>Name</label>
        <Input
          label='service-'
          placeholder='some-service-name'
          onChange={store.controlled.serviceName}
          value={serviceName}/>
      </Form.Field>
      <Form.Field width={10}>
        <label>Repository URL</label>
        <Input
          label='https://'
          placeholder='github.com/kigiri/service-some-service-name'
          onChange={store.controlled.serviceRepo}
          value={serviceRepo}/>
      </Form.Field>
    </Form.Group>
    { alert(async.ADD_SERVICE.error) }
    <Button
      icon
      loading={async.ADD_SERVICE.start && !async.ADD_SERVICE.end}
      disabled={async.ADD_SERVICE.start && !async.ADD_SERVICE.end}
      labelPosition='right'
      onClick={() =>
        store.dispatch.ADD_SERVICE({ repo: serviceRepo, name: serviceName })}>
      <Icon name='plus' />
      Add
    </Button>
  </Form>)
}
