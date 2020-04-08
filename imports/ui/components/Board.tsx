// ###### 1 => Meteor imports ############

// ###### 2 => React imports #############
import React, { memo, useMemo } from 'react'

// ###### 3 => Npm imports ###############

// ###### 4 => Local folder imports ######
import { Cards } from './Game'
import Card, { cardStyle } from './Card'

// ###### 5 => Local app imports #########

interface IBoardProps {
	cards: Cards
}

const Board: React.FC<IBoardProps> = ({ cards }) => {
	const maxWidth = useMemo(
		() =>
			Math.sqrt(cards.length) * (cardStyle.width + 2 * cardStyle.margin),
		[cards.length],
	)

	return (
		<div className={`flex wrap`} style={{ maxWidth }}>
			{cards.map((number, idx) => (
				<Card key={idx} index={idx} number={number} />
			))}
		</div>
	)
}

export default memo(Board)
