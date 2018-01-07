import React from 'react'
import {
  Form,
  Button,
  Message,
} from 'semantic-ui-react'

export default store => (
  <div>
    <Message warning attached>
      <Message.Header>Disclameur:</Message.Header>
      <p>
        Auto-chomage utilise vos identifiants pour se connecter
        et faire l'actualisation à votre place.
      <br/>
        Nous ne somme pas un service de reconu par pole emplois
        et ne pouvons pas etre considéré responsable si il arrive quoi que
        ce soit à votre compte pole emplois.
      </p>
      <p>
        Si vous voulez verifier ce qui est fait de vos données,
        le code de ce service est libre et dispo sur github.
      </p>
      <p>Bon chomage.</p>
    </Message>
    <Form className='attached fluid segment'>
      <Form.Field>
        <label>Identifiant</label>
        <input placeholder='1234567A' />
      </Form.Field>
      <Form.Field>
        <label>Mot de passe</label>
        <input type='password' />
      </Form.Field>
      <Form.Field>
        <label>Code postal</label>
        <input placeholder='75000'/>
      </Form.Field>
      <Button color='blue' type='submit'>Ce connecté</Button>
    </Form>
  </div>
)
