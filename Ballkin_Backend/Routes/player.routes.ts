import {Router} from 'express';
import Player, {IPlayer} from '../Models/player';


export const playerRoute = Router();

playerRoute.get('/', async (req, res) => {
    try{
        const players = await Player.find();
        res.status(200).json(players);
    } catch (error){
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Error fetching players' });
    }
})

playerRoute.post('/', async (req, res) => {
    const clientPlayer: IPlayer = req.body;
    try{
        const newPlayer = await Player.create(clientPlayer);
        res.status(201).send(newPlayer);
        console.log(newPlayer);
    } catch (error) {
        console.error('Error creating player', error);
        res.status(500).send('Error creating player');
    }
})
