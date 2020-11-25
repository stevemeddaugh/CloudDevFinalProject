import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Rating
} from 'semantic-ui-react'

import { createGame, deleteGame, getGames, patchGame } from '../api/games-api'
import Auth from '../auth/Auth'
import { Game } from '../types/Game'

interface GamesProps {
  auth: Auth
  history: History
}

interface GamesState {
  games: Game[]
  newGameName: string
  newGamePublisher: string
  newGameYear: string
  newGameRating: number
  loadingGames: boolean
}

export class Games extends React.PureComponent<GamesProps, GamesState> {
  state: GamesState = {
    games: [],
    newGameName: '',
    newGamePublisher: '',
    newGameYear: '',
    newGameRating: 0,
    loadingGames: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGameName: event.target.value })
  }

  handlePublisherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGamePublisher: event.target.value })
  }

  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGameYear: event.target.value })
  }

  onEditButtonClick = (gameId: string) => {
    this.props.history.push(`/games/${gameId}/edit`)
  }

  onGameCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newGame = await createGame(this.props.auth.getIdToken(), {
        name: this.state.newGameName,
        publisher: this.state.newGamePublisher,
        releaseYear: this.state.newGameYear,
        rating: this.state.newGameRating
      })
      this.setState({
        games: [...this.state.games, newGame],
        newGameName: '',
        newGamePublisher: '',
        newGameYear: '',
        newGameRating: 0
      })
    } catch {
      alert('Game creation failed')
    }
  }

  onGameDelete = async (gameId: string) => {
    try {
      await deleteGame(this.props.auth.getIdToken(), gameId)
      this.setState({
        games: this.state.games.filter(game => game.gameId != gameId)
      })
    } catch {
      alert('Game deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const games = await getGames(this.props.auth.getIdToken())
      this.setState({
        games,
        loadingGames: false
      })
    } catch (e) {
      alert(`Failed to fetch games: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Board Games</Header>

        {this.renderCreateGameInput()}

        {this.renderGames()}
      </div>
    )
  }

  renderCreateGameInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'orange',
              labelPosition: 'left',
              icon: 'add',
              content: 'New game',
              onClick: this.onGameCreate
            }}
            actionPosition="left"
            placeholder="Boardgame..."
            value={this.state.newGameName}
            onChange={this.handleNameChange}
          />
          <Input
            placeholder="Publisher..."
            value={this.state.newGamePublisher}
            onChange={this.handlePublisherChange}
          />
          <Input
            placeholder="Year..."
            value={this.state.newGameYear}
            onChange={this.handleYearChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGames() {
    if (this.state.loadingGames) {
      return this.renderLoading()
    }
    
    return this.renderGamesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Games...
        </Loader>
      </Grid.Row>
    )
  }

  renderHeaderLabels() {
    return (
      <Grid.Row>
        <Grid.Column width={4}>
          <label className="ui header">Rating</label>
        </Grid.Column>
        <Grid.Column width={4}>
          <label className="ui header">Name</label>
        </Grid.Column>
        <Grid.Column width={4} floated="right">
          <label className="ui header">Publisher</label>
        </Grid.Column>
        <Grid.Column width={2} floated="right">
          <label className="ui header">Release Year</label>
        </Grid.Column>
        <Grid.Column width={1} floated="right">
          <label className="ui header">Edit</label>
        </Grid.Column>
        <Grid.Column width={1} floated="right">
          <label className="ui header">Delete</label>
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderGamesList() {
    return (
      <Grid padded>
        {this.renderHeaderLabels()}
        {this.state.games.map((game, pos) => {
          return (
            <Grid.Row key={game.gameId}>
              <Grid.Column width={4}>
                <Rating icon="star" maxRating={5} rating={game.rating} disabled />
              </Grid.Column>
              <Grid.Column width={4}>
                {game.name}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {game.publisher}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {game.releaseYear}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(game.gameId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onGameDelete(game.gameId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {game.attachmentUrl && (
                <Image src={game.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
