class MusicPlayer {
    constructor() {
        this.observers = [];
        this.state = { song: 'Nenhuma', playing: false, cover: '', currentTime: 0, duration: 0 };
        this.audio = new Audio();
        this.audio.addEventListener('timeupdate', () => this.updateTime());
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this.state);
        }
    }

    play(song, cover) {
        this.state = { song: song, playing: true, cover: cover, currentTime: 0, duration: 0 };
        this.audio.src = song;
        this.audio.play();
        this.notifyObservers();
    }

    stop() {
        this.state = { song: 'Nenhuma', playing: false, cover: '', currentTime: 0, duration: 0 };
        this.audio.pause();
        this.audio.currentTime = 0;
        this.notifyObservers();
    }

    updateTime() {
        this.state.currentTime = this.audio.currentTime;
        this.state.duration = this.audio.duration;
        this.notifyObservers();
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }
}

class Display {
    constructor(displayElement) {
        this.displayElement = displayElement;
    }

    update(state) {
        if (state.playing) {
            this.displayElement.innerHTML = `Tocando agora: ${state.song}`;
            document.getElementById('coverDisplay').src = state.cover;
            document.getElementById('coverDisplay').style.display = "block";
        } else {
            this.displayElement.innerHTML = "Música atual: Nenhuma";
            document.getElementById('coverDisplay').src = '';
            document.getElementById('coverDisplay').style.display = "none";
        }
    }
}

class TempoDisplay {
    constructor(displayElement) {
        this.displayElement = displayElement;
    }

    update(state) {
        const currentTimeFormatted = this.formatTime(state.currentTime);
        const durationFormatted = this.formatTime(state.duration);
        this.displayElement.innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
    }

    formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

const player = new MusicPlayer();
const display = new Display(document.getElementById('musicDisplay'));
const tempoDisplay = new TempoDisplay(document.getElementById('timeDisplay'));
player.addObserver(display);
player.addObserver(tempoDisplay);

document.getElementById('playButton').addEventListener('click', function() {
    const songSelect = document.getElementById('songSelect');
    const selectedOption = songSelect.options[songSelect.selectedIndex];
    const selectedSong = selectedOption.value;
    const selectedCover = selectedOption.getAttribute('data-cover');
    player.play(selectedSong, selectedCover);
});

document.getElementById('stopButton').addEventListener('click', function() {
    player.stop();
});

document.getElementById('volumeControl').addEventListener('input', function() {
    const volume = parseFloat(this.value);
    player.setVolume(volume);
    document.getElementById('volumeValue').textContent = `Volume: ${(volume * 100).toFixed(0)}%`;
});

document.getElementById('progressBar').addEventListener('input', function() {
    const progress = parseFloat(this.value) / 100;
    player.audio.currentTime = progress * player.state.duration;
});

player.addObserver({
    update(state) {
        const progress = (state.currentTime / state.duration) * 100 || 0;
        document.getElementById('progressBar').value = progress;
    }
});

