import { playIcon, pauseIcon } from './icons/svgIcons.js';

// "Interface" Observer para garantir que todos os observers implementem o método update
class Observer {
    update(event, data) {
        throw new Error("Method 'update(event, data)' must be implemented.");
    }
}

// Classe Subject "abstrata" para gerenciar os observers
class Subject {
    constructor() {
        this.observers = [];
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

    notifyObservers(event, data) {
        this.observers.forEach(observer => observer.update(event, data));
    }
}

// MusicPlayer estende Subject
class MusicPlayer extends Subject {
    constructor() {
        super(); // Chamada ao construtor da classe pai
        this.state = { song: {}, playing: false };
    }

    play(song) {
        this.state = { song: song, playing: true };
        this.notifyObservers('play', this.state);
    }

    stop() {
        this.state = { ...this.state.song, playing: false };
        this.notifyObservers('stop', this.state);
    }
}

// Implementação dos Observers
class MainPlayer extends Observer {
    constructor(playerElement) {
        super();
        this.playerElement = playerElement;
        this.audio = document.createElement("AUDIO");
        playerElement.appendChild(this.audio);
    }

    update(event, data) {
        switch (event) {
            case 'play':
                this.audio.src = data.song.file;
                this.audio.play();
                this.playerElement.querySelector('.play').innerHTML = pauseIcon();
                break;
            case 'stop':
                this.audio.pause();
                this.playerElement.querySelector('.play').innerHTML = playIcon();
                break;
        }

        // Atualização dos detalhes da música independentemente do evento
        if (data.song) {
            this.playerElement.querySelector('.info').innerHTML = `
                <h1>${data.song.title}</h1>
                <p>${data.song.artist}</p>
            `;
            this.playerElement.querySelector('.album-cover').src = `${data.song.cover}`;
        }
    }
}

// SidebarPlayer e MiniPlayer podem ser implementados de forma similar ao MainPlayer
// com variações específicas conforme necessário para suas funcionalidades
class SidebarPlayer extends Observer {
    constructor(playerElement) {
        super();
        this.playerElement = playerElement;
    }

    update(event, data) {
        switch (event) {
            case 'play':
                this.playerElement.querySelector('.play').innerHTML = pauseIcon();
                break;
            case 'stop':
                this.playerElement.querySelector('.play').innerHTML = playIcon();
                break;
        }

        if (data.song) {
            this.playerElement.querySelector('.info').innerHTML = `
                <h1>${data.song.title}</h1>
                <p>${data.song.artist}</p>
            `;
            this.playerElement.querySelector('.album-cover').src = `${data.song.cover}`;
        }
    }
}

class MiniPlayer extends Observer {
    constructor(playerElement) {
        super();
        this.playerElement = playerElement;
    }

    update(event, data) {
        switch (event) {
            case 'play':
                this.playerElement.querySelector('.play').innerHTML = pauseIcon();
                break;
            case 'stop':
                this.playerElement.querySelector('.play').innerHTML = playIcon();
                break;
        }
        if (data.song) {
            this.playerElement.querySelector('.info').innerHTML = `
                <h1>${data.song.title}</h1>
                <p>${data.song.artist}</p>
            `;
            this.playerElement.querySelector('.album-cover').src = `${data.song.cover}`;
        }
    }
}

// Instanciando o MusicPlayer e os observers
const player = new MusicPlayer();

const mainPlayerElement = document.getElementById('main-player');
const mainPlayer = new MainPlayer(mainPlayerElement);

const sidebarPlayerElement = document.getElementById('sidebar-player');
const sidebarPlayer = new SidebarPlayer(sidebarPlayerElement);

const miniPlayerElement = document.getElementById('mini-player');
const miniPlayer = new MiniPlayer(miniPlayerElement);

// Adicionar observers ao MusicPlayer
player.addObserver(mainPlayer);
player.addObserver(sidebarPlayer);
player.addObserver(miniPlayer);

// Exemplo de interação
const handlePlay = () => {
    if (player.state.playing) {
        player.stop();
    } else {
        player.play({
            title: 'Better Day',
            file: 'songs/better-day.mp3',
            artist: 'Penguin Music',
            cover: 'songs/better-day.webp'
        });
    }
}

mainPlayerElement.querySelector('.play').addEventListener('click', handlePlay);
sidebarPlayerElement.querySelector('.play').addEventListener('click', handlePlay);
miniPlayerElement.querySelector('.play').addEventListener('click', handlePlay);