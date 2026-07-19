import { z } from 'zod'

export const leagueSourceSchema = z.object({
  provider: z.literal('nuliga'),
  season: z.string().min(1),
  groupUrl: z.url(),
  teamName: z.string().min(1),
})

export const leagueTeamSnapshotSchema = z.object({
  schemaVersion: z.literal(1),
  sourceUrl: z.url(),
  fetchedAt: z.iso.datetime(),
  season: z.string().min(1),
  team: z.object({
    name: z.string().min(1),
    competition: z.string().min(1).optional(),
  }),
  players: z.array(z.object({
    board: z.string().min(1),
    name: z.string().min(1),
    rating: z.number().int().positive().optional(),
    role: z.enum(['starter', 'reserve']),
    appearances: z.number().int().nonnegative().optional(),
    boardPoints: z.string().min(1).optional(),
  })).min(1),
  matches: z.array(z.object({
    id: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    round: z.string().min(1).optional(),
    home: z.string().min(1),
    away: z.string().min(1),
    status: z.enum(['scheduled', 'finished']),
    result: z.string().min(1).optional(),
    reportUrl: z.url().optional(),
  })),
})
