import { events, platforms, rankings, tournaments } from './data'
import type { Platform, Ranking, Tournament, WrestlingEvent } from './types'
export interface MatSideApi { getEvents():Promise<WrestlingEvent[]>; getPlatforms():Promise<Platform[]>; getTournaments():Promise<Tournament[]>; getRankings():Promise<Ranking[]> }
// Replace these methods with fetch('/api/...') when the Python backend is introduced.
export const api: MatSideApi = { getEvents:async()=>events, getPlatforms:async()=>platforms, getTournaments:async()=>tournaments, getRankings:async()=>rankings }
