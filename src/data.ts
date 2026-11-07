import type { Platform, Ranking, Tournament, WrestlingEvent } from './types'
export const platforms: Platform[] = [
  {id:'ESPN+',name:'ESPN+',description:'College duals and championships',color:'#f15f3a'}, {id:'FLO',name:'FloWrestling',description:'International, freestyle, and tournaments',color:'#63d5cb'},
  {id:'B1G+',name:'B1G+',description:'Big Ten duals and conference events',color:'#8ba2ff'}, {id:'UFC',name:'UFC Fight Pass',description:'Select grappling and combat events',color:'#f2f0eb'},
]
export const events: WrestlingEvent[] = [
  {id:'iowa-minn',time:'6:00 PM',status:'live',category:'College',label:'College dual · 8 ranked wrestlers',home:{name:'Iowa',short:'IA',rank:3,color:'#edc541'},away:{name:'Minnesota',short:'MN',rank:8,color:'#9e1b35'},venue:'Carver-Hawkeye Arena',platform:'B1G+',ranked:8},
  {id:'psu-mich',time:'7:30 PM',status:'up next',category:'College',label:'Top pick for you · Ranked dual',home:{name:'Penn State',short:'PS',rank:1,color:'#294165'},away:{name:'Michigan',short:'MI',rank:12,color:'#ffcb4c'},venue:'Bryce Jordan Center',platform:'ESPN+',ranked:7,featured:true,recommendation:'Because you follow Big Ten wrestling'},
  {id:'cowboys-titan',time:'8:00 PM',status:'tonight',category:'International',label:'Freestyle showcase',home:{name:'Cowboys RTC',short:'CR',color:'#e66a32'},away:{name:'Titan Mercury',short:'TM',color:'#159c99'},venue:'National Wrestling Hall of Fame',platform:'FLO',ranked:4},
  {id:'okst-isu',time:'9:00 PM',status:'tonight',category:'College',label:'Big 12 dual · 6 ranked matchups',home:{name:'Oklahoma State',short:'OS',rank:6,color:'#e56a31'},away:{name:'Iowa State',short:'IS',rank:10,color:'#c7253e'},venue:'Gallagher-Iba Arena',platform:'ESPN+',ranked:6},
  {id:'osu-neb',time:'7:00 PM',status:'tomorrow',category:'College',label:'Ranked Big Ten dual',home:{name:'Ohio State',short:'OS',rank:5,color:'#b51c38'},away:{name:'Nebraska',short:'NE',rank:9,color:'#e12e38'},venue:'Covelli Center',platform:'ESPN+',ranked:7,featured:true,recommendation:'Rising matchup with seven ranked bouts'},
  {id:'national-duals',time:'8:00 PM',status:'tomorrow',category:'High School',label:'National Duals · Championship',home:{name:'Pennsylvania',short:'PA',color:'#1e5c91'},away:{name:'Iowa',short:'IA',color:'#f0c84b'},venue:'Xtream Arena',platform:'B1G+',ranked:10,featured:true,recommendation:'Top high school pick for you'},
]
export const tournaments: Tournament[] = [
  {name:'Southern Scuffle',date:'Nov 8–9',location:'Chattanooga, TN',field:'32 teams · NCAA',platform:'FLO'}, {name:'National Collegiate Open',date:'Nov 14–15',location:'Council Bluffs, IA',field:'Open division · NCAA',platform:'ESPN+'}, {name:'Walsh Ironman',date:'Dec 11–12',location:'Cuyahoga Falls, OH',field:'High school · 120 teams',platform:'FLO'},
]
export const rankings: Ranking[] = [
  {rank:1,team:'Penn State',record:'5–0',conference:'Big Ten',movement:0},{rank:2,team:'Virginia Tech',record:'4–0',conference:'ACC',movement:1},{rank:3,team:'Iowa',record:'5–1',conference:'Big Ten',movement:-1},{rank:4,team:'Cornell',record:'3–0',conference:'Ivy',movement:0},{rank:5,team:'Ohio State',record:'4–1',conference:'Big Ten',movement:2},{rank:6,team:'Oklahoma State',record:'3–1',conference:'Big 12',movement:-1},{rank:7,team:'Missouri',record:'4–1',conference:'Big 12',movement:1},{rank:8,team:'Minnesota',record:'4–2',conference:'Big Ten',movement:-2},
]
