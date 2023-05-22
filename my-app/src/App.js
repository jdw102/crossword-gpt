import logo from './logo.svg';
import './App.css';
import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Button, TextField, Grid, List, ListItem, ListItemIcon, ListItemText, CircularProgress, Box, } from '@mui/material';
import Board from './Board.js';

function App() {
  const testUrl = "http://127.0.0.1:5000/test/";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("");


  const handleButtonClick = () => {
    setData(null);
    setLoading(true);
    axios.get(testUrl + theme)
    .then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }

  return (
    <div className="App">
      <h1 className = "header">
        Crossword-GPT
      </h1>
      <Grid container justifyContent= "center" alignItems = "center" spacing = {3}>
        <Grid item xs = {4}>
          <TextField onChange = {(e) => setTheme(e.target.value)} InputProps = {{className: "body"}} placeholder = "Enter a theme..." fullWidth/>
        </Grid>
        <Grid item xs = {2}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={handleButtonClick}
            >
              Generate
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
          )}
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent = "center" alignItems = "center">
        {loading && (
              <CircularProgress
                size={200}
                sx = {{marginTop: "200px"}}
              />
          )}
      </Grid>
      {data != null && 
      <Grid container>
        <Grid item xs = {12} md = {8}> 
          <Board data = {data}/>
        </Grid>
        <Grid item xs = {12} md = {4}>
          <Grid container>
            <Grid item xs = {12} sm = {6} md = {12}>
              <h3>Across</h3>
              <List style = {{marginTop: "-20px"}}>
              {data.across.map((word) => {
                return(
                  <ListItem>
                    <ListItemIcon>
                      {word.id}
                    </ListItemIcon>
                    <ListItemText>
                      {word.hint}
                    </ListItemText>
                  </ListItem>
                )
              })}
              </List>
            </Grid>
            <Grid item xs = {12} sm = {6} md = {12}>
              <h3>Down</h3>
              <List style = {{marginTop: "-20px"}}>
              {data.down.map((word) => {
                return(
                  <ListItem>
                    <ListItemIcon>
                      {word.id}
                    </ListItemIcon>
                    <ListItemText>
                      {word.hint}
                    </ListItemText>
                  </ListItem>
                )
                })}
                </List>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      }
    </div>
  );
}

export default App;
