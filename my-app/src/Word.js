import React from 'react';
import {useState, useEffect } from 'react';
import {Grid} from '@mui/material';
import './App.css';



const Word = ({data}) => {
    const across = data.across;
    const down = data.down;
    const xSize = Math.max(Math.max(...across.map(obj => obj.x)), Math.max(...down.map(obj => obj.x)));
    const ySize = Math.max(Math.max(...across.map(obj => obj.y)), Math.max(...down.map(obj => obj.y)));
    
    const squareWidth = screen.width / xSize;
    const squareHeight = screen.height / ySize;

    return (
        <div>
            <Grid container>
                {across.map((word) => {
                    return(

                    )
                })}
                {down.map((word) => {
                    return(
                        
                    )
                })}
            </Grid>
        </div>
    )
}