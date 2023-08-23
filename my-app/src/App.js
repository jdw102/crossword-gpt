import React from 'react';
import './App.css';
import {useState} from 'react';
import axios from 'axios';
import {Button, Grid, List,
  ListItem, ListItemIcon, ListItemText, CircularProgress, Box, IconButton, Tooltip, Grow } from '@mui/material';
import Board from './Board.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function App() {
  const URL = "https://jworthy1.pythonanywhere.com/play-cross/";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [theme, setTheme] = useState("");


  const handleButtonClick = () => {
    setData(null);
    setLoading(true);
    axios.get(URL + theme)
    .then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }

  let count = 0;
  const board = [];
  const coordinateMap = new Map();
  data && data.board.split('\n').forEach((line) => {
      let chars = line.split(',');
      board.push(chars);
      let blanks = []
      chars.forEach((c) => {
          if (c !== ' '){
              count++;
          }
          blanks.push(' ');
      })
  }); 
  
  data && data.across.forEach((word) => {
      const coordinates = [];
      let x = word.x;
      let y = word.y;
      for (let i = 0; i < word.name.length; i++) {
          coordinates.push({x: x + i, y: y});
      }
      coordinates.forEach((c) => {
          let key = c.x + "x" + c.y;
          coordinateMap.set(key, [{word: word.name, coordinates: coordinates, direction: "across", hint: word.hint}])
      })
  }); 

  data && data.down.forEach((word) => {
      const coordinates = [];
      let x = word.x;
      let y = word.y;
      for (let i = 0; i < word.name.length; i++) {
          coordinates.push({x: x, y: y + i});
      }
      coordinates.forEach((c) => {
          let key = c.x + "x" + c.y;
          if (!coordinateMap.has(key)){
              coordinateMap.set(key, [])
          }
          let arr = coordinateMap.get(key);
          arr.push({word: word.name, coordinates: coordinates, direction: "down", hint: word.hint});
          coordinateMap.set(key, arr);
      })
  }); 

  const tiles = [];
  let i = -1;
  board.length > 0 && board.forEach((line) => {
    i++;
    let j = -1;
    const arr = [];
    line.forEach((char) => {
      j++;
      let right = coordinateMap.has((j + 1) + "x" + i)? "tile" + (j + 1) + "x" + i: null;
      let left = coordinateMap.has((j - 1) + "x" + i)? "tile" + (j - 1) + "x" + i: null;
      let down = coordinateMap.has(j + "x" + (i + 1))? "tile" + j + "x" + (i + 1): null;
      let up = coordinateMap.has(j + "x" + (i - 1))? "tile" + j + "x" + (i - 1): null;
      const words = coordinateMap.get(j + "x" + i);
      const acrossWord = words? words.find((w) => w.direction === 'across'): null;
      const downWord = words? words.find((w) => w.direction === 'down'): null;
      arr.push({
      letter: char, 
      id: "tile" + j + "x" + i,
      x: j, y: i, 
      right: right,
      left: left,
      down: down,
      up: up,
      acrossWord: acrossWord,
      downWord: downWord,
      })
    })
  tiles.push(arr);
})

  return (
    <div className="App">
      {
      !data && 
      <div style={{display: 'flex', justifyContent:'center', width: '100%', marginTop: '15%', marginBottom: '1rem'}}>
        {"CROSSWORD-GPT".split("").map((char, key) => {
          let val = key * 50;
          return (
            <Grow key={key} in timeout={250} style={{transitionDelay: `${val}ms`}}>
              <input className='title-tile' placeholder={char} disabled />
            </Grow>
          )
        })}
      </div>
      }
      {
        data && 
        <div>
          <h1 className = "header">
            {theme} Puzzle
          </h1>
          <Tooltip title = "Back to Home">
            <IconButton style={{position: 'absolute', top: 20, left: 0}} onClick={() => setData(null)}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </div>
      }
      {!data && <Grid container justifyContent= "center" alignItems = "center" spacing = {3} >
        <Grid item xs = {6}>
          <input 
          disabled={loading}
          className='theme-input'
          maxLength="30"
          onChange = {(e) => setTheme(e.target.value)} placeholder = "Enter a theme..." />
        </Grid>
        <Grid item xs = {12}>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant="contained"
              disabled={loading}
              style={{fontFamily: 'Georgia', backgroundColor: '#191b1d'}}
              onClick={handleButtonClick}
            >
              {!loading && "Generate"}
              {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'white',
                  transitionDelay: 'all 500ms ease'
                }}
              />
              )}
            </Button>
            
          </Box>
        </Grid>
        <Grid item xs = {12} style={{marginTop: '5%'}}>
          <p style={{fontSize: '1vmax',fontStyle: 'italic', fontFamily: 'Georgia', color: '#000000b0'}}>
          Enter the theme for your crossword puzzle and click generate to play. All hints and answers are generated using Chat GPT!
          </p>
        </Grid>
      </Grid>}
      {data != null && 
      <Grid container>
        <Grid item xs = {12} md = {8}> 
          <Board setSelectedWord={setSelectedWord} board={board} coordinateMap={coordinateMap} tiles={tiles} count={count}/>
          <div style={{backgroundColor: "lightblue", height: '10vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{marginTop: 'auto', marginBottom: 'auto', fontFamily:'Georgia'}}>
              {selectedWord && selectedWord.hint}
            </div>
          </div>
        </Grid>
        <Grid item xs = {12} md = {4} style={{backgroundColor: 'white'}}>
          <Grid container>
            <Grid item xs = {12} sm = {6} md = {12}>
              <h3 style={{fontFamily: "Georgia"}}>Across</h3>
              <List style = {{marginTop: "-20px"}}>
              {data.across.map((word, key) => {
                return(
                  <ListItem key ={key}>
                    <ListItemIcon>
                      {word.id}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontFamily: 'Georgia'}} primary={word.hint} />
                  </ListItem>
                )
              })}
              </List>
            </Grid>
            <Grid item xs = {12} sm = {6} md = {12}>
              <h3 style={{fontFamily: "Georgia"}}>Down</h3>
              <List style = {{marginTop: "-20px"}}>
              {data.down.map((word, key) => {
                return(
                  <ListItem key = {key}>
                    <ListItemIcon>
                      {word.id}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{fontFamily: 'Georgia'}} primary={word.hint} />
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
