import React from 'react'
import {
  Icon,
  Step,
  Grid,
  Image,
  Header,
  Dimmer,
  Input,
  Loader,
  Container,
} from 'semantic-ui-react'

export default props => (
  <div>
    <Input
      action={{ color: 'teal', labelPosition: 'right', icon: 'upload', content: 'Copy' }}
      iconPosition='left'
      placeholder='02 77 22 77'>
      <input />
      <Icon name='phone' />
    </Input>
  </div>
)
