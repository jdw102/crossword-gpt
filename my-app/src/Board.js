import React from 'react';
import {useState, useEffect } from 'react';
import {Grid, Box, Card, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@mui/material';
import './Board.css';
import Tile from "./Tile.js";




const Board = ({setSelectedWord, board, coordinateMap, tiles, count}) => {
    const initialGrid = Array.from({ length: board.length }, () =>
    Array.from({ length: board[0].length }, () => false)
    );
    const [direction, setDirection] = useState("across");
    const [selectedCoordinate, setSelectedCoordinate] = useState({x: 0, y: 0});   
    const [open, setOpen] = useState(false);
    const [counter, setCounter] = useState(0);
    const [booleanBoard, setBooleanBoard] = useState(initialGrid)

    useEffect(() => {
        if (count == counter) {
            setOpen(true);
            setCounter(0);
        }
      }, [counter]);

    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        let words = coordinateMap.get(selectedCoordinate.x + "x" + selectedCoordinate.y);
        let word = null;
        if (words) {
            word = words.find((w) => w.direction === direction);
            setSelectedWord(word);
        }
        if (word) {
            let newCoordinates = word.coordinates;
            let newBoard = [...initialGrid];
            newCoordinates.forEach((c) => {
                newBoard[c.y][c.x] = true;
            })
            setBooleanBoard(newBoard)
        }
    }, [direction, selectedCoordinate])

    let i = -1;
    return (
        <Box component = {Card} raised display="flex" justifyContent="center" alignItems="center" style = {{ border: '0.5rem solid #191b1d', borderRadius: "0"}}>
            {board.length > 0 && 
            <Grid container columns = {board[0].length}  style = {{width: "100%"}}>
                {tiles.map((row) => {
                    i++;
                    let j = -1;
                    return (
                        row.map((props, key) => {
                            j++;
                            return (
                                <Tile 
                                key={key}
                                {...props}
                                setCounter={setCounter}
                                direction={booleanBoard[i][j]? direction: "across"}
                                setDirection={setDirection}
                                setSelectedCoordinate={setSelectedCoordinate}
                                selected={booleanBoard[i][j]}
                                />
                            )
                        })
                    )
                })}
            </Grid>
            }
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

export default React.memo(Board);