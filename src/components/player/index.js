import React from 'react';
import ReactSVG from 'react-svg';
import song01 from 'app/assets/r-u-mine.mp3';
import song02 from 'app/assets/river.mp3';
import song03 from 'app/assets/beat-the-devils-tattoo.mp3';
import PlayIcon from 'app/assets/play.svg';
import PauseIcon from 'app/assets/pause.svg';
import NextIcon from 'app/assets/next.svg';
import LoopIcon from 'app/assets/loop.svg';
import Shuffle from 'app/assets/shuffle.svg';
import List from 'app/assets/list.svg';
import SongCover1 from 'app/assets/cover1.jpeg';

// should display (mm:ss) minutes and seconds
const formattedTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toFixed(0);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: false,
      mutted: false,
      currentTime: 0,
      shouldRepeat: false,
      currentSong: 0,
      songs: [song01, song02, song03],
      duration: '00',
      value: 10,
    };

    this.createAudio = this.createAudio.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.seekTrack = this.seekTrack.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.prevSong = this.prevSong.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
  }

  componentDidMount() {
    this.audio = document.createElement('audio');
    this.audio.src = song01;

    // Media events
    this.audio.addEventListener('timeupdate', () => {
      const { currentTime } = this.audio;
      this.setState({
        currentTime,
        duration: this.audio.duration,
      });
    });

    this.audio.addEventListener('ended', () => {
      const { shouldRepeat } = this.state;
      if (shouldRepeat) {
        this.play();
      } else {
        this.nextSong();
      }
    });
  }

  getCurrentSong(currentSong) {
    const { songs } = this.state;

    // when is bigger than the array value reset to the initial song
    if (currentSong > songs.length - 1) {
      this.setState({
        currentSong: 0,
      });
      return songs[0];
    }

    // when is less than the array value reset to the initial song
    if (currentSong < 0) {
      this.setState({
        currentSong: songs.length,
      });
      return songs[songs.length - 1];
    }

    return songs[currentSong];
  }

  play() {
    this.setState({
      playing: true,
      duration: this.audio.duration,
    }, () => {
      this.audio.play();
    });
  }

  pause() {
    this.setState({
      playing: false,
    }, () => {
      this.audio.pause();
    });
  }

  toggleMute() {
    const { mutted } = this.state;
    this.setState({
      mutted: !mutted,
    }, () => {
      this.audio.volume = mutted;
    });
  }

  seekTrack(event) {
    const seekValue = event.target.value;
    this.pause();
    this.audio.currentTime = seekValue;
    this.setState({
      currentTime: seekValue,
    }, () => {
      this.play();
    });
  }

  // Loop
  toggleLoop() {
    const { shouldRepeat } = this.state;
    this.setState({
      shouldRepeat: !shouldRepeat,
    });
  }

  createAudio(url, currentSong) {
    this.audio = null;
    this.audio = document.createElement('audio');
    this.audio.src = url;

    const { mutted } = this.state;
    if (mutted) {
      this.audio.volume = !mutted;
    }

    this.audio.addEventListener('timeupdate', () => {
      const { currentTime } = this.audio;
      this.setState({
        currentTime,
        duration: this.audio.duration,
      });
    });

    this.audio.addEventListener('ended', () => {
      const { shouldRepeat } = this.state;
      if (shouldRepeat) {
        this.play();
      } else {
        this.nextSong();
      }
    });

    this.setState({ currentSong }, () => {
      this.play();
    });
  }

  nextSong() {
    this.audio.pause();

    const { currentSong } = this.state;
    const newCurrentSong = currentSong + 1;
    const currentUrlSong = this.getCurrentSong(newCurrentSong);

    this.createAudio(currentUrlSong, newCurrentSong);
  }

  prevSong() {
    this.audio.pause();

    const { currentSong } = this.state;
    const newCurrentSong = currentSong - 1;
    const currentUrlSong = this.getCurrentSong(newCurrentSong);

    this.createAudio(currentUrlSong, newCurrentSong);
  }

  // TODO
  // create svg icon with sound icon and LR balance 

  render() {
    const {
      currentTime, duration, playing,
    } = this.state;
    return (
      <div className="player">
        <div className="song">
          <div className="song-cover">
            <img src={SongCover1} />
          </div>
          <div className="song-info">
            <h2 className="song-title">
              RU Mine - <span className="song-band">Artick Monkeys</span>
            </h2>
            <div className="song-meta-data">
              <span>
                320kbps - {' '}
                44 kHz
              </span>
            </div>
            <div className="song-custom">
              <div className="song-custom-container">
                <div className="song-volume-wrapper">
                  <input
                    className="song-volume"
                    value={0}
                    max={100}
                    onChange={(event) => console.log(event.target.value)}
                    type="range"
                  />
                  <input
                    className="song-balance"
                    type="range"
                    max={100}
                    min={0}
                    step="1"
                    onChange={value => console.log('value', value)}
                  />
                </div>
                <div className="sound-system">
                  <div className="sound-system-type">
                    <span>mono</span>
                    <button>
                      EQ
                    </button>
                  </div>
                  <div className="sound-system-type">
                    <span>stereo</span>
                    <button>
                      PL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="progress-container">
          <span className="current-time">{formattedTime(currentTime)}</span>
          <input
            className="progress"
            value={currentTime}
            max={duration || 100}
            onChange={this.seekTrack}
            type="range"
          />
        </div>
        <div className="controls">
          <div className="controls-song">
            <button
              type="button"
              onClick={this.prevSong}
              className="btn-previous"
            >
              <ReactSVG
                src={NextIcon}
                svgClassName="previous"
              />
            </button>
            <button
              type="button"
              className="btn-play"
              onClick={playing ? this.pause : this.play}
            >
              <ReactSVG
                src={playing ? PauseIcon : PlayIcon}
                svgClassName={playing ? 'pause' : 'play'}
              />
            </button>
           <button
             type="button"
             onClick={this.nextSong}
             className="btn-next"
           >
             <ReactSVG
               src={NextIcon}
               svgClassName="next"
             />
           </button>
          </div>
          <div className="controls-sequence">
            <button
              type="button"
              className="btn-loop"
              onClick={this.toggleLoop}
            >
              <ReactSVG
                src={List}
                svgClassName="loop"
              />
            </button>
            <button
              type="button"
              className="btn-loop"
              onClick={this.toggleLoop}
            >
              <ReactSVG
                src={Shuffle}
                svgClassName="loop"
              />
            </button>
            <button
              type="button"
              className="btn-loop"
              onClick={this.toggleLoop}
            >
              <ReactSVG
                src={LoopIcon}
                svgClassName="loop"
              />
            </button>
            <button
              className="btn-add"
              type="button"
            >
              Add To <span>+</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Player.defaultProps = {
};

export default Player;
