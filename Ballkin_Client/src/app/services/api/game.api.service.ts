import axios from 'axios';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';

const BASE_URL = 'http://localhost:5000'; // Adjust to your backend URL

const STATISTIC_ENDPOINT = `${BASE_URL}/statistics`;

const convertStatisticMapToArray = (gameData: Map<Player, Statistic>) => {
  const statisticsArray = Array.from(gameData.entries()).map(([player, statistic]) => ({
    playerId: player._id, 
    nettoScore: statistic.nettoScore,
    bruttoScore: statistic.bruttoScore,
    shotsTaken: statistic.shotsTaken,
    avgBruttoScore: statistic.avgBruttoScore,
    pointValueScored: Object.fromEntries(statistic.pointValueScored.entries()), 
    avgPointValueScored: Object.fromEntries(statistic.avgPointValueScored.entries()),
    sufferedMalus: statistic.sufferedMalus,
    additiveScore: statistic.additiveScore
  }));
  console.log({playerStatistics: statisticsArray})
  return { playerStatistics: statisticsArray};
}

export const getGames = async () => {
  try {
    const response = await axios.get(STATISTIC_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const createGame = async (gameData: Map<Player, Statistic>) => {
  console.log("hallo")
  const playerStatisticArray = convertStatisticMapToArray(gameData)
  try {
    const response = await axios.post(STATISTIC_ENDPOINT, playerStatisticArray);
    return response.data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

export const deleteGame = async (id: string) => {
  try {
    const response = await axios.delete(`${STATISTIC_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting game:', error);
    throw error;
  }
};