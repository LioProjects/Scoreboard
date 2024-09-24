import { NextFunction, Request, Response, Router } from 'express';
import Game, { IGame } from '../Models/game';


export const statisticRoute = Router();

statisticRoute.get('/', async (req, res) => {
  try{
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
});

statisticRoute.get('/:id', async (req, res) => {
  try{
    const game = await Game.findById(req.params.id);
    res.status(200).json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Error fetching game' });
  }
  
});

statisticRoute.post('/', async (req, res) => {
  const clientGame: IGame = req.body;
  console.log(clientGame);

  try {
      const newGame = await Game.create(clientGame)  
      res.status(201).json(newGame);

    } catch (error) {
      console.error('Error creating game or statistics:', error);
      res.status(500).send('Error creating game or statistics');
    }

});

statisticRoute.delete('/:id', async (req, res) => {
  try{
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    res.status(204).send("Game got deleted");
  } catch (error) {
    console.error('Error deleting or finding the game', error)
    res.status(500).send('Error deleting or finding the game')
  }
})

/*
//Todo: if something gets deleted the whole game should be deleted not only the stat;
statisticRoute.delete('/:id', getGame, async (req, res: CustomResponse) => {
    try {
      await res.game.remove()
    }
  });


async function getGame(req: Request, res: CustomResponse, next: NextFunction){
  let game;
  try{
    game = await Game.findById(req.params.id)
    if (game == null){
      return res.status(404).json({message: 'Cannot find Game'});
    }
  } catch (err: any) {
    return res.status(500).json({message: err.message})
  }
  res.game = game
  next();
}*/