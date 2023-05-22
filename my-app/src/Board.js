import React from 'react';
import {useState, useEffect } from 'react';
import {Grid, Box, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import './App.css';
import Tile from "./Tile.js";



const Board = ({data}) => {
    const board = [];
    let count = 0;
    const lines = data.board.split('\n');
    lines.forEach((line) => {
        let chars = line.split(',');
        board.push(chars);
        chars.forEach((c) => {
            if (c != ' '){
                count++;
            }
        })
    })
    const [open, setOpen] = useState(false);
    const [counter, setCounter] = useState(-1);

    useEffect(() => {
        if (count == counter) {
            setOpen(true);
            counter = 0;
        }
        console.log(counter);
      }, [counter]);

    const handleClose = () => {
        setOpen(false);
    };

    const tileHandleChar = (c, target, found, setFound) => {
        if (c === target && !found){
            console.log('test');
            setCounter(counter + 1);
            setFound(true);
        }
        else if (c !== target && found) {
            setCounter(counter - 1);
            setFound(false);
        }
    }

    return (
        <Box component = {Card} raised display="flex" justifyContent="center" alignItems="center" style = {{backgroundColor: "#84c3eb20", margin: "20px", borderRadius: "20px"}}>
            <Grid container columns = {board[0].length}  style = {{width: "90%", marginTop: "40px", marginBottom: "40px"}}>
                {board.map((line) => {
                    return (
                        line.map((char) => {
                            return (
                                <Tile letter = {char} callback = {tileHandleChar}/>
                            )
                        })
                    )
                })}
            </Grid>
            <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"You won!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Enter a new theme and press generate to play again.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default Board;