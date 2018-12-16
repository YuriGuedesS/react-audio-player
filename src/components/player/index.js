import React from 'react';
import song01 from 'app/assets/r-u-mine.mp3';
import song02 from 'app/assets/river.mp3';
import song03 from 'app/assets/beat-the-devils-tattoo.mp3';

// should display (mm:ss) minutes and seconds
const formattedTime = (time) => {
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
  // fill the range value with a color
  // styles

  render() {
    const {
      currentTime, duration, playing,
    } = this.state;
    return (
      <div>
        <input
          type="range"
          value={currentTime}
          max={duration || 100}
          onChange={this.seekTrack}
        />
        <button
          type="button"
          onClick={playing ? this.pause : this.play}
        >
          {playing ? 'pause' : 'play'}
        </button>
        <button
          type="button"
          onClick={this.toggleMute}
        >
          mutte
        </button>
        <button
          type="button"
          onClick={this.toggleLoop}
        >
          loop
        </button>
        {currentTime && (
          <p>
            Current:
            {formattedTime(currentTime)}
          </p>
        )}
        {duration && (
          <p>
            duration:
            {formattedTime(duration)}
          </p>
        )}
        <button
          type="button"
          onClick={this.prevSong}
        >
           prev
        </button>
        <button
          type="button"
          onClick={this.nextSong}
        >
          next
        </button>
      </div>
    );
  }
}

Player.defaultProps = {
};

export default Player;
