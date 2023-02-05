/* eslint-disable no-plusplus */
import {Component} from 'react'
import './App.css'
import {FaMicrophoneAlt} from 'react-icons/fa'

class App extends Component {
  state = {
    text: '',
    recording: false,
    translatedText: '',
  }

  componentDidMount() {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    this.recognition = new window.SpeechRecognition()
    this.recognition.interimResults = true
    this.recognition.lang = 'en-IN'

    this.recognition.addEventListener('result', event => {
      let text = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          text += event.results[i][0].transcript
        }
      }
      this.setState({text})
    })
  }

  startRecording = () => {
    this.setState({recording: true})
    this.recognition.start()
  }

  stopRecording = () => {
    this.setState({recording: false})
    this.recognition.stop()
  }

  translateToHindi = async () => {
    const {text} = this.state
    console.log(text)
    const subscriptionKey = ''
    const endpoint = 'https://api.cognitive.microsofttranslator.com/'
    const path = `/translate?api-version=3.0&to=hi&text=${encodeURI(text)}`
    const requestOptions = {
      method: 'GET',
      headers: {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
      },
    }

    try {
      const response = await fetch(endpoint + path, requestOptions)
      const json = await response.json()
      this.setState({translatedText: json[0].text})
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const {text, recording, translatedText} = this.state
    const backColor = recording
      ? 'stop-record-button-color'
      : 'start-record-button-color'
    return (
      <>
        <div className="app-container">
          <h1 className="heading">Speech-to-Text and Translation</h1>

          <div className="buttons">
            <button
              type="button"
              className={`record-button ${backColor}`}
              onClick={recording ? this.stopRecording : this.startRecording}
            >
              {recording ? 'Stop' : 'Start'} Recording
            </button>
            {recording ? <FaMicrophoneAlt className="mic-icon" /> : ''}

            <button
              type="button"
              className="translate-button"
              onClick={this.translateToHindi}
            >
              Translate to Hindi
            </button>
          </div>
          <p className="text-display">{text}</p>
          <p className="text-display">{translatedText}</p>
        </div>
      </>
    )
  }
}

export default App
