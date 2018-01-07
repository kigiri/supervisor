import React from 'react'
import Logo from './logo'
import validatePhone from './step-validate-phone'
import preSelection from './step-pre-selection'
import confirmId from './step-confirm-id'
import selection from './step-selection'
import {
  Icon,
  Step,
  Grid,
  Image,
  Header,
  Dimmer,
  Loader,
  Container,
} from 'semantic-ui-react'


const stepsData = [
  {
    title: 'Account Creation',
    icon: 'user circle',
    description: 'Connect your github account',
  }, {
    title: 'Validate Phone',
    icon: 'phone',
    description: 'Confirm your phone number',
    content: validatePhone,
  }, {
    title: 'Pre-Selection',
    icon: 'star',
    description: 'Pass the online pre-selection test',
    content: preSelection,
  }, {
    title: 'Confirm Identity',
    icon: 'id card',
    description: 'Come check your identity at the school',
    content: confirmId,
  }, {
    title: 'Selection',
    icon: 'trophy',
    description: 'Pass the in school selection test',
    content: selection,
  }
  // }, {
  //   title: 'Alpha Test',
  //   icon: 'cube',
  //   description: 'Pass the first week of learning',
  // }, {
  //   title: 'Beta Test',
  //   icon: 'cubes',
  //   description: 'Pass the second week of learning',
  // },
]

const StepBlock = function ({ title, description, icon }, i) {
  return (
    <Step completed={ i < this } active={ i === this } key={`step-${i}`}>
      <Icon name={icon} />
      <Step.Content>
        <Step.Title>{title}</Step.Title>
        <Step.Description>{description}</Step.Description>
      </Step.Content>
    </Step>
  )
}

export default store => (
  <Container style={{ marginTop: '6em' }}>
    <Header as='h2'>
      <Icon name='settings' />
      <Header.Content>
        Personal Information
        <Header.Subheader>
          Manage your inscription
        </Header.Subheader>
      </Header.Content>
    </Header>

    <Grid columns={2}>
      <Dimmer active={!store.user.login}>
        <Loader>Loading</Loader>
      </Dimmer>
      <Grid.Column width={8}>
        <Step.Group fluid vertical>
          { stepsData.map(StepBlock, store.user.step) }
        </Step.Group>
      </Grid.Column>

      <Grid.Column>
        {stepsData[store.user.step] && stepsData[store.user.step].content(store)}
      </Grid.Column>
    </Grid>
  </Container>
)
