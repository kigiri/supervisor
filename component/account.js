import React from 'react'
import {
  Form,
  Button,
  Message,
  Icon,
  Table,
} from 'semantic-ui-react'

const pad = n => `0${n}`.slice(-2)
const formatDate = d => `le ${pad(d.getDate())}/${("0"+(d.getMonth() + 1)).slice(-2)}/${d.getFullYear()} à ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
/*
<nom, prenom>
Activation automatique [x]
Notification par email [x] sms (utilsateur free) [x] (options)
Prochaine actualisation prévue le XX / XX / XX à 20h32
Historique des actualisation:
succes le xx / xx / xx à HH:mm
succes le xx / xx / xx à HH:mm
succes le xx / xx / xx à HH:mm

<Oubliez moi> (supprime toute vos informations personnelles du serveur)
*/
export default store => (
  <div>
    <Form.Checkbox checked inline label='Activation automatique' />
    <Form.Checkbox checked inline label='Notification par email' />
    <Form.Checkbox inline label='Notification par sms (free)' />
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='3'>Actualisations</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell collapsing>
            <Icon name='wait' />Actualisé {formatDate(new Date)}
          </Table.Cell>
          <Table.Cell collapsing textAlign='right'>En attente</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Icon name='checkmark' color='green'/>Actualisé {formatDate(new Date)}
          </Table.Cell>
          <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Icon name='checkmark' color='green' />Actualisé {formatDate(new Date)}
          </Table.Cell>
          <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Icon name='remove' color='red' />Echec d'actualisation {formatDate(new Date)}
          </Table.Cell>
          <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Icon name='checkmark' color='green' />Actualisé {formatDate(new Date)}
          </Table.Cell>
          <Table.Cell textAlign='right'>10 hours ago</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
    <Button color='red'>Oubliez moi</Button>
  </div>
)

