import React, {useState, useLayoutEffect} from 'react';
import './App.css';
import cards from '../../cards';

function App() {
    let [colors, setColors] = useState(getInitialPictures());
    let [revealedCards, setRevealedCards] = useState([]);
    let [moves, setMoves] = useState(0);
    let [screenWidth, setScreenWidth] = useState(window.innerWidth);
    let state = {
        colors, setColors,
        revealedCards, setRevealedCards,
        moves, setMoves,
        screenWidth, setScreenWidth,
    };

    useLayoutEffect(() => {
        function updateSize() {
            setScreenWidth([window.innerWidth]);
        }
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    });

    return (
        <div id={'app-w'}>
            <div id={'score'}>
                Moves: { state.moves }
            </div>
            <div id={'board'} style={getBoardStyle(state)}>
                { getCards(state) }
            </div>
            <div id={'controls'}>
                { getOkButton(state) }
            </div>
        </div>
    );
}

function getBoardStyle(state) {
    let boardSize = state.screenWidth + 'px';
    return {
        width: boardSize,
        height: boardSize
    };
}

function getCards(state) {
    let cards = [];
    for (let i = 0; i < 36; i++) {
        cards.push(
            <div className={'card-w'} style={getCardWrapperStyle(i, state.screenWidth)} key={'card' + i}>
                { getCard(state, i)}
            </div>
        );
    }
    return cards
}

function getCard(state, cardIndex) {
    if (state.colors[cardIndex] == null) return null;
    return (
        <div className={'card'}
             style={getCardStyle(state, cardIndex)}
             onClick={() => onCardClick(state, cardIndex)}>
        </div>
    );
}

function getCardStyle(state, cardIndex) {
    let backgroundImage = state.revealedCards.includes(cardIndex) ? cards[state.colors[cardIndex]] : 'none';
    return {
        backgroundImage: 'url(' + backgroundImage + ')',
    };
}

function onCardClick(state, cardIndex) {
    if (state.revealedCards.length === 2) return;
    if (state.revealedCards.includes(cardIndex)) return;
    let newRevealedCards = state.revealedCards.slice();
    newRevealedCards.push(cardIndex);
    state.setRevealedCards(newRevealedCards);
}

function getCardWrapperStyle(cardIndex, screenWidth) {
    let top = Math.floor(cardIndex / 6) * 100 / 6;
    let left = (cardIndex % 6) * 100 / 6;
    let cardSize = Math.min(100, screenWidth / 6) + 'px';
    return {top: top + '%', left: left + '%', width: cardSize, height: cardSize};
}

function getInitialPictures() {
    let colors = [];
    for (let i = 0; i < 18; i++) {
        colors.push(i);
        colors.push(i);
    }
    shuffle(colors);
    return colors;
}

function getInitialColors() {
    let colors = [];
    for (let i = 0; i < 18; i++) {
        let newColor = getRandomColor();
        colors.push(newColor);
        colors.push(newColor);
    }
    shuffle(colors);
    return colors;
}

function getRandomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += getRandomColorChar();
    }
    return color;
}

function getRandomColorChar() {
    let val = Math.floor(Math.random() * 16);
    if (val < 10) return String.fromCharCode(48 + val);
    return String.fromCharCode(55 + val);
}

function getOkButton(state) {
    if (state.revealedCards.length < 2) return null;
    return <span id={'ok-button'} onClick={() => onOkButtonClick(state)}>OK</span>
}

function onOkButtonClick(state) {
    let newColors = state.colors.slice();
    let cardIndex1 = state.revealedCards[0];
    let cardIndex2 = state.revealedCards[1];
    if (state.colors[cardIndex1] === state.colors[cardIndex2]) {
        newColors[cardIndex1] = null;
        newColors[cardIndex2] = null;
    }
    state.setColors(newColors);
    state.setRevealedCards([]);
    state.setMoves(state.moves + 1);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default App;
