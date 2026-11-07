export type Category = 'College' | 'International' | 'High School'
export type Status = 'live' | 'up next' | 'tonight' | 'tomorrow'
export interface Team { name: string; short: string; rank?: number; color: string }
export interface WrestlingEvent { id:string; time:string; status:Status; category:Category; label:string; home:Team; away:Team; venue:string; platform:string; ranked:number; featured?:boolean; recommendation?:string }
export interface Tournament { name:string; date:string; location:string; field:string; platform:string }
export interface Ranking { rank:number; team:string; record:string; conference:string; movement:number }
export interface Platform { id:string; name:string; description:string; color:string }
