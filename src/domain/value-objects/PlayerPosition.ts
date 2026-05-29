/**
 * Football player positions.
 * Used for player profiles and team roster filtering.
 */
export enum PlayerPosition {
  GOALKEEPER = 'GOALKEEPER',
  CENTER_BACK = 'CENTER_BACK',
  LEFT_BACK = 'LEFT_BACK',
  RIGHT_BACK = 'RIGHT_BACK',
  DEFENSIVE_MIDFIELDER = 'DEFENSIVE_MIDFIELDER',
  CENTRAL_MIDFIELDER = 'CENTRAL_MIDFIELDER',
  ATTACKING_MIDFIELDER = 'ATTACKING_MIDFIELDER',
  LEFT_WINGER = 'LEFT_WINGER',
  RIGHT_WINGER = 'RIGHT_WINGER',
  STRIKER = 'STRIKER',
}

/**
 * Russian display names for player positions.
 */
export const PositionLabels: Record<PlayerPosition, string> = {
  [PlayerPosition.GOALKEEPER]: 'Вратарь',
  [PlayerPosition.CENTER_BACK]: 'Центральный защитник',
  [PlayerPosition.LEFT_BACK]: 'Левый защитник',
  [PlayerPosition.RIGHT_BACK]: 'Правый защитник',
  [PlayerPosition.DEFENSIVE_MIDFIELDER]: 'Опорный полузащитник',
  [PlayerPosition.CENTRAL_MIDFIELDER]: 'Центральный полузащитник',
  [PlayerPosition.ATTACKING_MIDFIELDER]: 'Атакующий полузащитник',
  [PlayerPosition.LEFT_WINGER]: 'Левый вингер',
  [PlayerPosition.RIGHT_WINGER]: 'Правый вингер',
  [PlayerPosition.STRIKER]: 'Нападающий',
};