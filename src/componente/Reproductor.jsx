import React, { useState, useRef } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FaFolder, FaRandom, FaRedo, FaStepForward, FaStepBackward, FaSearch } from 'react-icons/fa';


export const Reproductor = () => {
    const [playlist, setPlaylist] = useState([]);
    const [isRandom, setIsRandom] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const audioPlayer = useRef(null);

    const handlePlay = (e, index) => {
        console.log(`Reproduciendo: ${playlist[index].name}`);
        setCurrentIndex(index);
    };

    const handleEnded = () => {
        audioPlayer.current.audio.current.pause();
        if (isRepeat) {
            // Repetir la misma canción
            audioPlayer.current.audio.current.currentTime = 0;
            audioPlayer.current.audio.current.play();
        } else if (isRandom) {
            // Reproducir una canción aleatoria
            const randomIndex = Math.floor(Math.random() * playlist.length);
            setCurrentIndex(randomIndex);
        } else {
            // Avanzar a la siguiente canción
            const nextIndex = (currentIndex + 1) % playlist.length;
            setCurrentIndex(nextIndex);
        }
    };

    const handleSelectFolder = async () => {
        try {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.webkitdirectory = true;

            fileInput.addEventListener('change', async () => {
                const files = Array.from(fileInput.files);
                const newPlaylist = files.map((file) => ({ name: file.name, src: URL.createObjectURL(file) }));
                setPlaylist(newPlaylist);
                setCurrentIndex(0);
            });

            fileInput.click();
        } catch (error) {
            console.error('Error al seleccionar la carpeta:', error);
        }
    };

    const handleJumpForward = () => {
        if (currentIndex < playlist.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else if (isRepeat) {
            setCurrentIndex(0); // Vuelve a la primera canción si está en la última y se está repitiendo
        }
    };

    const handleJumpBackward = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prevIndex) => prevIndex - 1);
        } else if (isRepeat) {
            setCurrentIndex(playlist.length - 1); // Va a la última canción si está en la primera y se está repitiendo
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPlaylist = playlist.filter((song) =>
        song.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="reproductor-header">
                <div>Reproductor SAorozcoM</div>
                <div className="search-input">
                    <input
                        type="text"
                        placeholder="Buscar canciones por nombre"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <FaSearch className="search-icon" />
                </div>
            </div>
            <AudioPlayer
                ref={audioPlayer}
                autoPlay={true}
                preload='auto'
                src={filteredPlaylist[currentIndex]?.src}
                onPlay={(e) => handlePlay(e, currentIndex)}
                onEnded={handleEnded}
                loop={isRepeat}
                muted={false}
                showSkipControls={true}
                showJumpControls={true}
                showDownloadProgress={true}
                showFilledProgress={true}
                showFilledVolume={true}
                hasDefaultKeyBindings={true}
                autoPlayAfterSrcChange={true}
                volumeJumpStep={0.1}
                progressJumpStep={5000}
                customAdditionalControls={[
                    <button key="folderButton" onClick={handleSelectFolder}>
                        <FaFolder />
                    </button>,
                    <button key="randomButton" onClick={() => setIsRandom((prev) => !prev)}>
                        <FaRandom />
                    </button>,
                    <button key="repeatButton" onClick={() => setIsRepeat((prev) => !prev)}>
                        <FaRedo />
                    </button>,
                    <button key="jumpBackwardButton" onClick={handleJumpBackward}>
                        <FaStepBackward />
                    </button>,
                    <button key="jumpForwardButton" onClick={handleJumpForward}>
                        <FaStepForward />
                    </button>,
                ]}
            />
            <ul>
                {filteredPlaylist.map((song, index) => (
                    <li key={index} onClick={() => handlePlay(null, index)}>
                        {song.name}
                    </li>
                ))}
            </ul>
        </>
    );
};



