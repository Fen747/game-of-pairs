// ###### 1 => Meteor imports ############

// ###### 2 => React imports #############
import React, { memo, useCallback, useContext } from 'react'
import { createUseStyles } from 'react-jss'
import clsx from 'clsx'

// ###### 3 => Npm imports ###############

// ###### 4 => Local folder imports ######
import { GameContext, GameState } from './Game'

// ###### 5 => Local app imports #########

interface ICardProps {
	number: number
}

export const cardStyle = Object.freeze({
	height: 90,
	width: 90,
	margin: 20,
})

const highlightedStyle = Object.freeze({
	backgroundColor: 'blue',
	transform: 'scale(1.1, 1.1)',
})

const useStyles = createUseStyles({
	card: {
		height: cardStyle.height,
		width: cardStyle.width,
		margin: cardStyle.margin,
		transition: 'all 200ms ease-in-out',
		backgroundColor: 'darkblue',
		cursor: 'pointer',
		transform: 'scale(1, 1)',
		color: 'transparent',
		fontWeight: 'bold',

		'&:hover': highlightedStyle,

		'&.selected': {
			...highlightedStyle,
			color: 'white',
			cursor: 'default',
		},

		'&.found': {
			...highlightedStyle,
			backgroundColor: 'lightblue',
			color: 'white',
			cursor: 'default',
		},
	},
})

const Card: React.FC<ICardProps> = ({ number, index }) => {
	const classes = useStyles()
	const { state, actions } = useContext<GameState>(GameContext)
	const selected = state.showAll || state.selected.includes(index)
	const found = state.foundCardIndexes.includes(index)
	const handleClick = useCallback(() => {
		if (!found) {
			actions.selectCard(index)
		}
	}, [number, actions.selectCard, found])

	return (
		<div
			className={clsx(`flex center-b ${classes.card}`, {
				selected,
				found,
			})}
			onClick={handleClick}
		>
			{number}
		</div>
	)
}

export default memo(Card)
