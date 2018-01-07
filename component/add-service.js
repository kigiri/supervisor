import React from 'react'
import store from '../store'
import {
  Button,
  Form,
  Input,
  Icon,
} from 'semantic-ui-react'


module.exports = ({ inputsValues }) => (<Form>
  <Form.Group widths='equal'>
    <Form.Field width={6}>
      <label>Name</label>
      <Input
        label='service-'
        placeholder='some-service-name'
        onChange={store.controlled.serviceName}
        value={inputsValues.serviceName}/>
    </Form.Field>
    <Form.Field width={10}>
      <label>Repository URL</label>
      <Input
        label='https://'
        placeholder='github.com/kigiri/service-some-service-name'
        onChange={store.controlled.serviceRepo}
        value={inputsValues.serviceRepo
          || (inputsValues.serviceName || '')
          && `github.com/kigiri/service-${inputsValues.serviceName}`}/>
    </Form.Field>
  </Form.Group>
  <Button icon labelPosition='right'>
    <Icon name='plus' />
    Add
  </Button>
</Form>)
