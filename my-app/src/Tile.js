import React from 'react';
import {useState, useEffect } from 'react';
import {Grid, Card, Paper, Button, TextField, Box} from '@mui/material';
import './App.css';

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }

const Tile = ({blank, letter, callback}) => {


    const [text, setText] = useState(' ');
    const [found, setFound] = useState(false);

    function changeLetter(c) {
        if (c === 'Backspace') {
            setText(' ');
        }
        else if (c != '' && isLetter(c)){
            setText(c.toUpperCase());
        }
    }

    useEffect(() => {
        callback(text, letter[0], found, setFound);
      }, [text]);


    return (
        <Grid alignItem = "center" style = {{visibility: letter == ' ' ? "hidden": " "}}item xs = {1}>
            <Box display="flex" justifyContent="center" alignItems="center">
                <TextField label = {letter[1]} value = {text} onKeyDown = {e => changeLetter(e.key)} size = "small" sx={{ input: { cursor: 'pointer', caretColor: 'transparent' } }} inputProps = {{maxLength: 1, style: {textAlign: 'center'}, cursor: 'pointer', caretColor: 'transparent'}} />
            </Box>
        </Grid>
    )
}

export default Tile;