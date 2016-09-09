import React from 'react'
import ReactDOM from 'react-dom'
import cx from 'classnames'

const API_URL= 'http://sensei-sense-api.herokuapp.com'

const TOKEN = 'TJetta'

class Game extends React.Component {
    constructor () {
      super()
  }

  componentDidMount () {
    const gameId = window.localStorage.getItem('gameId')
    if (gameId) {
      window.fetch(`${API_URL}/games/${gameId}`)
      .then((response) => {
        return response.json()
      }).then((data) => {
        if (data.state === 'won' || data.state === 'lost') {
          this.createGame()
        } else {
          this.setState(data)
        }
      })
    } else {
      this.createGame()
    }
  }

  createGame () {
    window.fetch(`${API_URL}/games?difficulty=${this.props.difficulty}`, {
      method: 'POST'
    }).then((response) => {
      return response.json()
    }).then((data) => {
      this.setState(data)
    })
  }


  render () {
    return <div className='game'>
      <div className='previous'>
        <div className='turn'>
          <Cup color='aqua' />
          <Cup />
          <Cup />
          <Cup />
          <div className='pegs'>
            TODO
          </div>
        </div>
      </div>
      <div className='current turn'>
        <Cup droppable />
        <Cup droppable />
        <Cup droppable />
        <Cup droppable />
        <div className='go'>
          <button>Go</button>
        </div>
      </div>
      <div className='color-well'>
        <Well color='green' />
        <Well color='aqua' />
        <Well color='fuschia' />
        <Well color='blueberry' />
        <Well color='fire' />
        <Well color='coal' />
      </div>
    </div>
  }
}

// TODO: Handling touch events (for mobile) is not implemented.
// React doesn't have `touchenter` so this will likely require some refactoring...
class Cup extends React.Component {

  static propTypes = {
    color: React.PropTypes.string,
    droppable: React.PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      color: this.props.color,
      highlight: false
    }
  }

  _handleDragEnter = (event) => {
    this.setState({
      highlight: true
    })
  }

  _handleDragLeave = (event) => {
    this.setState({
      highlight: false
    })
  }

  _handleDragOver = (event) => {
    // Preventing the default is required to allow
    // drop event to occur.
    event.preventDefault()
  }

  _handleDrop = (event) => {
    const color = event.dataTransfer.getData('text/plain')
    this.setState({
      highlight: false,
      color: color
    })
  }

  render () {
    let color, front
    if (this.state.color) {
      color = <div className={cx('color', this.state.color)} />
    }
    if (this.props.droppable) {
      front = <div
        className='front'
        onDragEnter={this._handleDragEnter}
        onDragLeave={this._handleDragLeave}
        onDragOver={this._handleDragOver}
        onDrop={this._handleDrop}
      />
    } else {
      front = <div className='front' />
    }

    return <div className={cx('cup', { highlight: this.state.highlight })}>
      {color}
      {front}
    </div>
  }
}

class Well extends React.Component {

  static propTypes = {
    color: React.PropTypes.string
  }

  constructor () {
    super()
    this.state = {
      position: {
        x: 0,
        y: 0
      },
      origin: {
        x: 0,
        y: 0
      }
    }
  }

  _handleDragStart = (event) => {
    const position = ReactDOM.findDOMNode(this.refs.orb).getBoundingClientRect()
    if (event.dataTransfer) {
      const dragImage = document.createElement('img')
      const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
      dragImage.src = transparentPixel
      event.dataTransfer.setDragImage(dragImage, 0, 0)
      event.dataTransfer.setData('text/plain', this.props.color)
    }
    this.setState({
      dragging: true,
      origin: {
        x: position.left + (position.width / 2),
        y: position.top + (position.height / 2)
      }
    })
  }

  _handleMouseDown = (event) => {
    this.setState({
      dragging: true
    })
  }

  _handleMouseUp = (event) => {
    this.setState({
      dragging: false
    })
  }

  _handleDrag = (event) => {
    if (event.changedTouches) {
      // Handle mobile touch drag
      this.setState({
        position: {
          x: event.changedTouches[0].clientX - this.state.origin.x,
          y: event.changedTouches[0].clientY - this.state.origin.y
        }
      })
    } else {
      // Handle regular drag
      this.setState({
        position: {
          x: event.clientX - this.state.origin.x,
          y: event.clientY - this.state.origin.y
        }
      })
    }
  }

  _handleDragEnd = (event) => {
    this.setState({
      dragging: false,
      position: {
        x: 0,
        y: 0
      }
    })
  }

  render () {
    let classes = cx('color', this.props.color, { dragging: this.state.dragging })
    return <div className='well'
      draggable
      onDragStart={this._handleDragStart}
      onDragEnd={this._handleDragEnd}
      onDrag={this._handleDrag}
      onTouchStart={this._handleDragStart}
      onTouchEnd={this._handleDragEnd}
      onTouchMove={this._handleDrag}
      onMouseDown={this._handleMouseDown}
      onMouseUp={this._handleMouseUp} >
      <div ref='orb'
        className={classes}
        style={{
          left: this.state.position.x,
          top: this.state.position.y,
          position: 'relative'
        }} />
    </div>
  }
}

export default Game
