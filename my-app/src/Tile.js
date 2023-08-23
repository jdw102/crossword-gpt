import React from 'react';
import {useState } from 'react';
import {Grid, TextField, Box} from '@mui/material';
import './App.css';

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }


const Tile = ({letter, setSelectedCoordinate, x, y, setCounter,
    callback, id, right, left, down, up, direction, setDirection, acrossWord, downWord, selected}) => {

    const [text, setText] = useState(' ');
    const [found, setFound] = useState(false);
    const [clicked, setClicked] = useState(false);


    function toggleDirection() {
        setSelectedCoordinate({x, y});
        if (clicked){
            let newDirection = direction === 'across' && downWord ? 'down' : direction === 'down' && acrossWord ? 'across' : direction;
            setDirection(newDirection);
        }   
        else {
            let newDirection = direction === 'across'? 
                                acrossWord ? 'across' : 'down'
                                : 
                                downWord? 'down': 'across';
            setDirection(newDirection);
        }
    };

    function handleFocus() {
        setTimeout(() => {
            setClicked(true);
        }, 10)
    }

    function changeLetter(c) {
        let elem = null;
        if (isLetter(c)) {
            setText(c.toUpperCase());
            if (c.toUpperCase() === letter[0] && !found){
                setCounter((prev) => prev + 1);
                setFound(true);
            }
            else if (c.toUpperCase() !== letter[0] && found) {
                setCounter((prev) => prev - 1);
                setFound(false);
            }
            if (direction === "across" && right) {
                elem = document.getElementById(right);
            }
            else if (down && direction === "down") {
                elem = document.getElementById(down);
            }
            elem && elem.focus();
        }
        else if (c === 'Backspace') {
            setText(' ');
            if (direction === "across" && left) {
                elem = document.getElementById(left);
            }
            else if (up && direction === "down") {
                elem = document.getElementById(up);
            }
            elem && elem.focus();
        }
        else if (c === 'ArrowUp') {
            elem = document.getElementById(up);
            if (elem) {
                setDirection("down");
                setSelectedCoordinate({x: x, y: y - 1})
                elem.focus();
            }
        }
        else if (c === 'ArrowDown') {
            elem = document.getElementById(down);
            if (elem) {
                setDirection("down");
                setSelectedCoordinate({x: x, y: y + 1})
                elem.focus();
            }
        }
        else if (c === 'ArrowRight') {
            elem = document.getElementById(right);
            if (elem) {
                setDirection("across");
                setSelectedCoordinate({x: x + 1, y: y})
                elem.focus();
            }
        }
        else if (c === 'ArrowLeft') {
            elem = document.getElementById(left);
            if (elem) {
                setDirection("across");
                setSelectedCoordinate({x: x - 1, y: y})
                elem.focus();
            }
        }
    }

    // useEffect(() => {
    //     callback(text, letter[0], found, setFound);
    //   }, [text]);
      
    return (
        <Grid item xs = {1} s>
            <Box  display="flex" justifyContent="center" alignItems="center" position='relative'>
                <TextField 
                disabled={letter === ' '}
                onClick={toggleDirection}
                onFocus={handleFocus}
                onBlur={() => setClicked(false)}
                id = {id}
                className={letter === ' '? 'empty-tile':  selected? 'selected-tile': 'tile'} 
                value = {text} 
                size ='small'
                onKeyDown = {e => changeLetter(e.key)} 
                sx={{ input: { cursor: 'pointer'}}} 
                inputProps = 
                {{maxLength: 1, style: {textAlign: 'center', fontSize: '2vmin', padding: '20%', fontWeight: '700'}, cursor: 'pointer'}} />
                <div style={{position: 'absolute', top: 0, left: 3, fontSize: '2vmin'}}>
                    {letter[1]}
                </div>
            </Box>
        </Grid>
    )
};

export default React.memo(Tile);