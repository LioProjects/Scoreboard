import { NextFunction, Request, Response, Router } from 'express';
import Game, { IGame } from '../Models/game';
import { IPlayerStatistic } from '../Models/statistic';
import Player from '../Models/player';
import mongoose from 'mongoose';


export const statisticRoute = Router();

statisticRoute.get('/', async (req, res) => {
  console.log("sala")
  try{
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
});

statisticRoute.post('/', async (req, res) => {
  console.log(req.body)
  const clientGame: IGame = req.body;
  console.log(clientGame)

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

statisticRoute.get('/player', async (req, res) => {
  console.log("hallo")
  try {
    const players = await Player.find();

    const playerStatistics: IPlayerStatistic[] = await Promise.all(
      players.map(async (player) => {
        const playerGames = await Game.find({
          'playerStatistics.playerId': player._id
        });

        const numberOfGamesPlayed = playerGames.length;

        const totalBruttoScore = playerGames.reduce((total, game) => {
          const statistic = game.playerStatistics.find(
            (stat) => stat.playerId.toString() === player._id.toString()
          );
          return total + (statistic ? statistic.bruttoScore : 0);
        }, 0);

        const shotsTaken = playerGames.reduce((total, game) => {
          const statistic = game.playerStatistics.find(
            (stat) => stat.playerId.toString() === player._id.toString()
          );
          return total + (statistic ? statistic.shotsTaken : 0);
        }, 0);

        const avgBruttoScore = shotsTaken > 0 ? Math.round((totalBruttoScore / shotsTaken) * 100) / 100 : 0;

        // Initialize an array of zeros with the length of pointValueScored
        const totalPointValueScored: number[] = [0, 0, 0, 0, 0];

        playerGames.forEach((game) => {
          const statistic = game.playerStatistics.find(
            (stat) => stat.playerId.toString() === player._id.toString()
          );
          if (statistic) {
            statistic.pointValueScored.forEach((value, index) => {
              totalPointValueScored[index] += value;
            });
          }
        });

        const avgPointValueScored = totalPointValueScored.map((value) =>
          shotsTaken > 0 ? Math.round((value / shotsTaken) * 1000) /10 : 0
        );

        // Calculate wins by comparing player's score to opponent's score
        const totalWins = playerGames.reduce((total, game) => {
          const statistic = game.playerStatistics.find(
            (stat) => stat.playerId.toString() === player._id.toString()
          );
          const opponentStatistic = game.playerStatistics.find(
            (stat) => stat.playerId.toString() !== player._id.toString()
          );

          if (statistic && opponentStatistic) {
            return statistic.nettoScore > opponentStatistic.nettoScore ? total + 1 : total;
          }
          return total;
        }, 0);

        const winPercentage = numberOfGamesPlayed > 0
          ? Math.round((totalWins / numberOfGamesPlayed) * 100)
          : 0;

        const playerStatistic: IPlayerStatistic = {
          playerId: player._id.toString(),
          numberOfGamesPlayed,
          winPercentage,
          totalBruttoScore,
          avgBruttoScore,
          shotsTaken,
          avgPointValueScored
        };

        return playerStatistic;
      })
    );

    res.json(playerStatistics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching player statistics', error });
  }
});

statisticRoute.get('/player/:id', async (req, res) => {
  try {
    const playerGames = await Game.find({
      'playerStatistics.playerId': req.params.id
    });

    if (!playerGames.length) {
      return res.status(404).json({ message: "No games found for the player" });
    }

    res.json(playerGames);
  } catch (error) {
    console.error('Error fetching player games:', error);
    res.status(500).json({ message: 'Internal server error' });
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