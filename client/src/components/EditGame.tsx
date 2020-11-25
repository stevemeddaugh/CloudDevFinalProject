import { History } from 'history'
import * as React from 'react'
import { Form, Button, Divider, Grid, Input, Rating, RatingProps } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getGame, patchGame } from '../api/games-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditGameProps {
  match: {
    params: {
      gameId: string
    }
  }
  auth: Auth
  history: History
}

interface EditGameState {
  gameName: string
  gamePublisher: string
  gameYear: string
  gameRating: number
  file: any
  uploadState: UploadState
}

export class EditGame extends React.PureComponent<
  EditGameProps,
  EditGameState
> {
  state: EditGameState = {
    gameName: '',
    gamePublisher: '',
    gameYear: '',
    gameRating: 0,
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gameName: event.target.value })
  }

  handlePublisherChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gamePublisher: event.target.value })
  }

  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ gameYear: event.target.value })
  }

  handleRatingChange = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: RatingProps) => {
    var newRating = data.rating as number
    this.setState({ gameRating: newRating })
  }

  updateGame = async () => {
    try {
      await patchGame(this.props.auth.getIdToken(), this.props.match.params.gameId, { 
        name: this.state.gameName,
        publisher: this.state.gamePublisher,
        releaseYear: this.state.gameYear,
        rating: this.state.gameRating
       })
    } catch {
      alert('Game rating failed')
    } finally {
      this.props.history.push(`/`)
    }
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.gameId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const game = await getGame(this.props.auth.getIdToken(), this.props.match.params.gameId)
      this.setState({
        gameName: game.name,
        gamePublisher: game.publisher,
        gameYear: game.releaseYear,
        gameRating: game.rating,
      })
    } catch (e) {
      alert(`Failed to fetch game: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <div>
          <h1>Update Game Info</h1>
          {this.renderEditGameInput()}
        </div>
        <div>
          <h1>Upload Game Image</h1>

          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>File</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Image to upload"
                onChange={this.handleFileChange}
              />
            </Form.Field>

            {this.renderUploadButton()}
          </Form>
        </div>
      </div>
    )
  }

  renderEditGameInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'orange',
              labelPosition: 'left',
              icon: 'add',
              content: 'Update game',
              onClick: this.updateGame
            }}
            actionPosition="left"
            value={this.state.gameName}
            onChange={this.handleNameChange}
          />
          <Input
            value={this.state.gamePublisher}
            onChange={this.handlePublisherChange}
          />
          <Input
            value={this.state.gameYear}
            onChange={this.handleYearChange}
          />
          <Rating icon="star" maxRating={5} rating={this.state.gameRating} onRate={ this.handleRatingChange } clearable />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderUploadButton() {
    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
